#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const galleryDir = path.join(__dirname, '../public/images/gallery');
const webpDir = path.join(galleryDir, 'webp');

async function convertToWebP() {
  console.log('🖼️  Converting gallery images to WebP format...\n');
  
  // Create webp directory
  if (!fs.existsSync(webpDir)) {
    fs.mkdirSync(webpDir, { recursive: true });
  }
  
  // Get all PNG images
  const images = fs.readdirSync(galleryDir)
    .filter(file => file.endsWith('.png') && !file.includes('originals') && !file.includes('optimized'));
  
  console.log(`Found ${images.length} images to convert\n`);
  
  let totalSizeBefore = 0;
  let totalSizeAfter = 0;
  
  for (const image of images) {
    const inputPath = path.join(galleryDir, image);
    const outputPath = path.join(webpDir, image.replace('.png', '.webp'));
    
    // Get original size
    const statsBefore = fs.statSync(inputPath);
    totalSizeBefore += statsBefore.size;
    
    console.log(`Converting ${image}...`);
    console.log(`  Original PNG: ${(statsBefore.size / 1024 / 1024).toFixed(2)} MB`);
    
    try {
      // First convert to JPEG with quality 85, then to WebP
      // This gives better compression than direct PNG to WebP
      const tempJpeg = outputPath.replace('.webp', '_temp.jpg');
      await execPromise(`sips -s format jpeg -s formatOptions 85 "${inputPath}" --out "${tempJpeg}"`);
      await execPromise(`sips -s format webp "${tempJpeg}" --out "${outputPath}"`);
      
      // Remove temp file
      fs.unlinkSync(tempJpeg);
      
      // Get new size
      const statsAfter = fs.statSync(outputPath);
      totalSizeAfter += statsAfter.size;
      
      console.log(`  WebP: ${(statsAfter.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Saved: ${((1 - statsAfter.size / statsBefore.size) * 100).toFixed(1)}%\n`);
      
    } catch (error) {
      console.error(`  Error converting ${image}: ${error.message}\n`);
    }
  }
  
  console.log('📊 Conversion Summary:');
  console.log(`Total size before: ${(totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total size after: ${(totalSizeAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total saved: ${((1 - totalSizeAfter / totalSizeBefore) * 100).toFixed(1)}%`);
  console.log(`\n✅ WebP images saved to: ${webpDir}`);
  console.log('\nTo use WebP images, update your HTML to reference the .webp files.');
}

convertToWebP().catch(console.error);