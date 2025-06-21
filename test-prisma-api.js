const prisma = require('./lib/prisma');

async function testPrismaAPI() {
  try {
    console.log('🧪 Testing Prisma connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Prisma connected successfully');
    
    // Test getting invoices
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        items: true,
        payments: true
      },
      take: 3
    });
    
    console.log(`✅ Found ${invoices.length} invoices`);
    if (invoices.length > 0) {
      console.log('📄 Sample invoice:');
      console.log(JSON.stringify(invoices[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error testing Prisma:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaAPI();