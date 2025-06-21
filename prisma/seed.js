const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Production environment detected - only seeding essential data');
    
    // Only create admin user in production
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const adminUser = await prisma.user.upsert({
        where: { email: process.env.ADMIN_EMAIL },
        update: {}, // Don't update existing admin
        create: {
          email: process.env.ADMIN_EMAIL,
          name: process.env.ADMIN_NAME || 'Admin',
          password: adminPassword,
          role: 'ADMIN',
          apiKey: `at_${uuidv4()}`,
        },
      });
      console.log('Admin user ready:', adminUser.email);
    } else {
      console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD required in production');
      process.exit(1);
    }
    
    console.log('Production seeding complete - no demo data created');
    return;
  }

  // Development/staging seeding continues below
  console.log('Development environment - creating demo data...');

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@axisthorn.com' },
    update: {}, // Don't update if exists
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@axisthorn.com',
      name: process.env.ADMIN_NAME || 'Axis Thorn Admin',
      password: adminPassword,
      role: 'ADMIN',
      apiKey: `at_${uuidv4()}`,
    },
  });

  console.log('Admin user ready:', adminUser.email);

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@axisthorn.com' },
    update: {}, // Don't update if exists
    create: {
      email: 'demo@axisthorn.com',
      name: 'Demo User',
      password: demoPassword,
      role: 'USER',
      apiKey: `at_demo_${uuidv4()}`,
    },
  });

  console.log('Demo user ready:', demoUser.email);

  // Create demo customers (idempotent)
  const customerData = [
    {
      name: 'Acme Corporation',
      email: 'billing@acme.com',
      phone: '555-0100',
      company: 'Acme Corporation',
      address: {
        street: '123 Business Ave',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'USA'
      },
      taxId: '12-3456789',
    },
    {
      name: 'Tech Innovations Inc',
      email: 'accounts@techinnovations.com',
      phone: '555-0200',
      company: 'Tech Innovations Inc',
      address: {
        street: '456 Tech Boulevard',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        country: 'USA'
      },
      taxId: '98-7654321',
    },
    {
      name: 'Global Enterprises Ltd',
      email: 'finance@globalent.com',
      phone: '555-0300',
      company: 'Global Enterprises Ltd',
      address: {
        street: '789 International Way',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      taxId: '55-1234567',
    },
  ];

  const customers = [];
  for (const data of customerData) {
    let customer = await prisma.customer.findFirst({
      where: {
        email: data.email,
        userId: demoUser.id,
      },
    });
    
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          ...data,
          userId: demoUser.id,
        },
      });
    }
    
    customers.push(customer);
  }

  console.log(`Created ${customers.length} customers`);

  // Create demo products (idempotent)
  const productData = [
    {
      name: 'Financial Consulting - Hourly',
      description: 'Professional financial consulting services billed hourly',
      price: 250.00,
      category: 'Consulting',
      sku: 'FIN-CONS-HR',
    },
    {
      name: 'Tax Preparation - Individual',
      description: 'Individual tax return preparation and filing',
      price: 500.00,
      category: 'Tax Services',
      sku: 'TAX-IND-001',
    },
    {
      name: 'Business Tax Filing',
      description: 'Corporate tax return preparation and filing',
      price: 1500.00,
      category: 'Tax Services',
      sku: 'TAX-BUS-001',
    },
    {
      name: 'Bookkeeping Services - Monthly',
      description: 'Monthly bookkeeping and financial record maintenance',
      price: 800.00,
      category: 'Bookkeeping',
      sku: 'BOOK-MON-001',
    },
    {
      name: 'Financial Audit',
      description: 'Comprehensive financial audit and review',
      price: 5000.00,
      category: 'Audit',
      sku: 'AUD-FIN-001',
    },
  ];

  const products = [];
  for (const data of productData) {
    let product = await prisma.product.findFirst({
      where: {
        sku: data.sku,
        userId: demoUser.id,
      },
    });
    
    if (!product) {
      product = await prisma.product.create({
        data: {
          ...data,
          userId: demoUser.id,
        },
      });
    }
    
    products.push(product);
  }

  console.log(`Created ${products.length} products`);

  // Create demo invoices with items
  const invoiceData = [
    {
      customer: customers[0],
      items: [
        { product: products[0], quantity: 8, description: 'Financial Consulting - 8 hours' },
        { product: products[3], quantity: 1, description: 'Monthly Bookkeeping' },
      ],
      status: 'PAID',
      paymentStatus: 'COMPLETED',
    },
    {
      customer: customers[1],
      items: [
        { product: products[1], quantity: 2, description: 'Tax Preparation for 2 individuals' },
        { product: products[0], quantity: 4, description: 'Financial Consulting - 4 hours' },
      ],
      status: 'SENT',
      paymentStatus: 'PENDING',
    },
    {
      customer: customers[2],
      items: [
        { product: products[2], quantity: 1, description: 'Corporate Tax Filing' },
        { product: products[4], quantity: 1, description: 'Annual Financial Audit' },
        { product: products[0], quantity: 12, description: 'Financial Consulting - 12 hours' },
      ],
      status: 'PARTIAL',
      paymentStatus: 'PENDING',
    },
  ];

  const invoices = [];
  for (let i = 0; i < invoiceData.length; i++) {
    const data = invoiceData[i];
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`;
    
    // Calculate totals
    let subtotal = 0;
    const itemsData = data.items.map((item, index) => {
      const amount = item.product.price * item.quantity;
      subtotal += amount;
      return {
        productId: item.product.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.product.price,
        amount: amount,
        order: index,
      };
    });

    const taxRate = 0.0875; // 8.75% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    const amountPaid = data.status === 'PAID' ? total : (data.status === 'PARTIAL' ? total * 0.5 : 0);
    const amountDue = total - amountPaid;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId: data.customer.id,
        userId: demoUser.id,
        subtotal,
        tax,
        taxRate: taxRate * 100,
        total,
        amountDue,
        amountPaid,
        status: data.status,
        paymentStatus: data.paymentStatus,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        terms: 'Net 30',
        notes: 'Thank you for your business!',
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // Create payment records for paid/partial invoices
    if (data.status === 'PAID' || data.status === 'PARTIAL') {
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: amountPaid,
          method: 'BANK_TRANSFER',
          status: 'COMPLETED',
          notes: data.status === 'PARTIAL' ? 'Partial payment received' : 'Full payment received',
        },
      });
    }

    invoices.push(invoice);
  }

  console.log(`Created ${invoices.length} invoices with items and payments`);

  // Create demo access codes (development only)
  if (process.env.NODE_ENV !== 'production') {
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
        await prisma.accessCode.upsert({
          where: { code: codeData.code },
          update: {}, // Don't update if exists
          create: {
            ...codeData,
            createdById: adminUser.id
          }
        });
        console.log(`Created access code: ${codeData.code}`);
      } catch (error) {
        console.log(`Access code ${codeData.code} already exists`);
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });