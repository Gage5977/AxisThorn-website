#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const galleryDir = path.join(__dirname, '../public/images/gallery');
const optimizedDir = path.join(galleryDir, 'optimized');

async function optimizeImages() {
  console.log('🖼️  Optimizing gallery images...\n');
  
  // Create optimized directory
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Get all PNG images
  const images = fs.readdirSync(galleryDir)
    .filter(file => file.endsWith('.png') && !file.includes('originals'));
  
  console.log(`Found ${images.length} images to optimize\n`);
  
  let totalSizeBefore = 0;
  let totalSizeAfter = 0;
  
  for (const image of images) {
    const inputPath = path.join(galleryDir, image);
    const outputPath = path.join(optimizedDir, image);
    
    // Get original size
    const statsBefore = fs.statSync(inputPath);
    totalSizeBefore += statsBefore.size;
    
    console.log(`Processing ${image}...`);
    console.log(`  Original: ${(statsBefore.size / 1024 / 1024).toFixed(2)} MB`);
    
    try {
      // Use sips to create optimized version
      // Reduce quality to 85% for smaller file size while maintaining visual quality
      await execPromise(`sips -s formatOptions 85 "${inputPath}" --out "${outputPath}"`);
      
      // Get new size
      const statsAfter = fs.statSync(outputPath);
      totalSizeAfter += statsAfter.size;
      
      console.log(`  Optimized: ${(statsAfter.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Saved: ${((1 - statsAfter.size / statsBefore.size) * 100).toFixed(1)}%\n`);
      
    } catch (error) {
      console.error(`  Error optimizing ${image}: ${error.message}\n`);
    }
  }
  
  console.log('📊 Optimization Summary:');
  console.log(`Total size before: ${(totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total size after: ${(totalSizeAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total saved: ${((1 - totalSizeAfter / totalSizeBefore) * 100).toFixed(1)}%`);
  console.log(`\n✅ Optimized images saved to: ${optimizedDir}`);
  console.log('\nTo use optimized images, replace originals with optimized versions.');
}

optimizeImages().catch(console.error);