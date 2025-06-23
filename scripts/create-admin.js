#!/usr/bin/env node

/**
 * Script to create an admin user
 * Usage: DATABASE_URL="your-connection-string" node scripts/create-admin.js
 */

import crypto from 'crypto';
import readline from 'readline';
import db from '../lib/db.js';

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
        const existingUser = await db.user.findUnique({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            const overwrite = await question('\nUser already exists. Update password? (yes/no): ');
            if (overwrite.toLowerCase() !== 'yes') {
                console.log('\nOperation cancelled.');
                process.exit(0);
            }
        }

        // Hash password
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

        // Create or update admin user
        let admin;
        if (existingUser) {
            admin = await db.user.update({
                where: { email: email.toLowerCase() },
                data: {
                    passwordHash: hash,
                    passwordSalt: salt,
                    updatedAt: new Date()
                }
            });
        } else {
            admin = await db.user.create({
                data: {
                    email: email.toLowerCase(),
                    name: name,
                    passwordHash: hash,
                    passwordSalt: salt,
                    role: 'admin',
                    emailVerified: true
                }
            });
        }

        console.log(existingUser ? '\n✅ Admin password updated successfully!\n' : '\n✅ Admin user created successfully!\n');
        console.log('Admin Details:');
        console.log(`- ID: ${admin.id}`);
        console.log(`- Email: ${admin.email}`);
        console.log(`- Name: ${admin.name}`);
        console.log(`- Role: ${admin.role}`);
        console.log('\nYou can now log in with these credentials.');
        
        if (!db.isUsingDatabase()) {
            console.log('\n⚠️  Note: Using in-memory storage. Data will be lost on restart.');
            console.log('Set DATABASE_URL environment variable to use persistent storage.');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (!process.env.DATABASE_URL && db.isUsingDatabase() === false) {
            console.error('\nNo DATABASE_URL environment variable found!');
            console.error('Usage: DATABASE_URL="your-connection-string" node scripts/create-admin.js');
        }
    } finally {
        rl.close();
        await db.$disconnect();
    }
}

// Run the script
createAdmin().catch(console.error);