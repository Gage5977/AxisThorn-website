// Database Seed Script
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seed...');

    // Create admin user
    const adminSalt = crypto.randomBytes(16).toString('hex');
    const adminHash = crypto.pbkdf2Sync('Admin123!', adminSalt, 10000, 64, 'sha512').toString('hex');

    const admin = await prisma.user.upsert({
        where: { email: 'admin@axisthorn.com' },
        update: {},
        create: {
            email: 'admin@axisthorn.com',
            name: 'Admin User',
            passwordHash: adminHash,
            passwordSalt: adminSalt,
            role: 'ADMIN',
            emailVerified: true,
        }
    });

    console.log('Created admin user:', admin.email);

    // Create demo client user
    const clientSalt = crypto.randomBytes(16).toString('hex');
    const clientHash = crypto.pbkdf2Sync('Demo123!', clientSalt, 10000, 64, 'sha512').toString('hex');

    const client = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            email: 'demo@example.com',
            name: 'Demo Client',
            company: 'Demo Company Inc.',
            passwordHash: clientHash,
            passwordSalt: clientSalt,
            role: 'CLIENT',
            emailVerified: true,
        }
    });

    console.log('Created demo client:', client.email);

    // Create sample documents for demo client
    const documents = await Promise.all([
        prisma.document.create({
            data: {
                userId: client.id,
                name: 'Financial Report Q3 2024.pdf',
                type: 'application/pdf',
                size: 2048000,
                url: '/uploads/financial-report-q3-2024.pdf'
            }
        }),
        prisma.document.create({
            data: {
                userId: client.id,
                name: 'Contract Agreement.docx',
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                size: 512000,
                url: '/uploads/contract-agreement.docx'
            }
        })
    ]);

    console.log(`Created ${documents.length} sample documents`);

    // Create sample invoices
    const invoices = await Promise.all([
        prisma.invoice.create({
            data: {
                userId: client.id,
                invoiceNumber: 'INV-2024-001',
                amount: 5000,
                status: 'PAID',
                dueDate: new Date('2024-01-15'),
                paidAt: new Date('2024-01-10')
            }
        }),
        prisma.invoice.create({
            data: {
                userId: client.id,
                invoiceNumber: 'INV-2024-002',
                amount: 7500,
                status: 'PENDING',
                dueDate: new Date('2024-02-15')
            }
        })
    ]);

    console.log(`Created ${invoices.length} sample invoices`);

    // Create sample admin notes
    const notes = await prisma.note.create({
        data: {
            userId: client.id,
            authorId: admin.id,
            content: 'Initial consultation completed. Client interested in financial automation services.'
        }
    });

    console.log('Created sample note');

    // Create sample activities
    const activities = await Promise.all([
        prisma.activity.create({
            data: {
                userId: client.id,
                type: 'user.login',
                description: 'User logged in'
            }
        }),
        prisma.activity.create({
            data: {
                userId: client.id,
                type: 'document.upload',
                description: 'Uploaded Financial Report Q3 2024.pdf',
                metadata: { documentId: documents[0].id }
            }
        }),
        prisma.activity.create({
            data: {
                type: 'system.startup',
                description: 'System started successfully'
            }
        })
    ]);

    console.log(`Created ${activities.length} sample activities`);

    console.log('Database seed completed!');
    console.log('\nDemo credentials:');
    console.log('Admin: admin@axisthorn.com / Admin123!');
    console.log('Client: demo@example.com / Demo123!');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });