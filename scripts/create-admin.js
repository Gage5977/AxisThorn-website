#!/usr/bin/env node

/**
 * Script to create an admin user
 * Usage: node scripts/create-admin.js
 */

import crypto from 'crypto';
import readline from 'readline';

// Simple in-memory storage for demo
// In production, this would connect to your database
const adminUsers = new Map();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function hideInput() {
    process.stdin.on('data', () => {
        // Move cursor back and clear the line
        process.stdout.write('\033[2K\033[200D');
    });
}

async function createAdmin() {
    console.log('=== Create Admin User ===\n');

    try {
        // Get admin details
        const email = await question('Email: ');
        const name = await question('Name: ');
        
        console.log('Password: ');
        hideInput();
        const password = await question('');
        process.stdin.removeAllListeners('data');
        console.log(''); // New line after password
        
        // Validate inputs
        if (!email || !email.includes('@')) {
            throw new Error('Invalid email address');
        }
        
        if (!password || password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        
        if (!name || name.length < 2) {
            throw new Error('Name must be at least 2 characters long');
        }

        // Check if admin already exists
        if (adminUsers.has(email.toLowerCase())) {
            throw new Error('Admin with this email already exists');
        }

        // Hash password
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

        // Create admin user
        const adminId = `admin_${crypto.randomBytes(8).toString('hex')}`;
        const admin = {
            id: adminId,
            email: email.toLowerCase(),
            name: name,
            passwordHash: hash,
            passwordSalt: salt,
            role: 'admin',
            createdAt: new Date().toISOString(),
            emailVerified: true
        };

        // Save admin (in production, save to database)
        adminUsers.set(email.toLowerCase(), admin);

        console.log('\n✅ Admin user created successfully!\n');
        console.log('Admin Details:');
        console.log(`- ID: ${admin.id}`);
        console.log(`- Email: ${admin.email}`);
        console.log(`- Name: ${admin.name}`);
        console.log(`- Role: ${admin.role}`);
        console.log('\nYou can now log in with these credentials at /login.html');

        // In production, you would:
        // 1. Save to database
        // 2. Send welcome email
        // 3. Log the creation event

        // For demo purposes, output the admin data that would be saved
        console.log('\n--- Admin Data (for demo) ---');
        console.log(JSON.stringify({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            createdAt: admin.createdAt
        }, null, 2));

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

// Run the script
createAdmin().catch(console.error);