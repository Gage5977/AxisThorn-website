const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAccessCodes() {
  console.log('Seeding demo access codes...');
  
  // Get admin user
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminUser) {
    console.error('No admin user found');
    return;
  }

  const accessCodes = [
    {
      code: 'DEMO-2025-AXIS',
      description: 'Demo access code for testing',
      maxUses: 100,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    },
    {
      code: 'VIP1-TEST-CODE',
      description: 'VIP test access with limited uses',
      maxUses: 5,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    },
    {
      code: 'BETA-AXIS-2025',
      description: 'Beta program access',
      maxUses: 50,
      expiresAt: null // No expiration
    }
  ];

  for (const codeData of accessCodes) {
    try {
      const code = await prisma.accessCode.upsert({
        where: { code: codeData.code },
        update: {}, // Don't update if exists
        create: {
          ...codeData,
          createdById: adminUser.id
        }
      });
      console.log(`✅ Created access code: ${code.code}`);
    } catch (error) {
      console.log(`⚠️  Access code ${codeData.code} already exists`);
    }
  }

  console.log('Done!');
}

seedAccessCodes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());