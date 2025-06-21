const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@axisthorn.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@axisthorn.com',
      name: process.env.ADMIN_NAME || 'Axis Thorn Admin',
      password: adminPassword,
      role: 'ADMIN',
      apiKey: `at_${uuidv4()}`,
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@axisthorn.com' },
    update: {},
    create: {
      email: 'demo@axisthorn.com',
      name: 'Demo User',
      password: demoPassword,
      role: 'USER',
      apiKey: `at_${uuidv4()}`,
    },
  });

  console.log('Created demo user:', demoUser.email);

  // Create demo customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
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
        userId: demoUser.id,
      },
    }),
    prisma.customer.create({
      data: {
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
        userId: demoUser.id,
      },
    }),
    prisma.customer.create({
      data: {
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
        userId: demoUser.id,
      },
    }),
  ]);

  console.log(`Created ${customers.length} customers`);

  // Create demo products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Financial Consulting - Hourly',
        description: 'Professional financial consulting services billed hourly',
        price: 250.00,
        category: 'Consulting',
        sku: 'FIN-CONS-HR',
        userId: demoUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tax Preparation - Individual',
        description: 'Individual tax return preparation and filing',
        price: 500.00,
        category: 'Tax Services',
        sku: 'TAX-IND-001',
        userId: demoUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Business Tax Filing',
        description: 'Corporate tax return preparation and filing',
        price: 1500.00,
        category: 'Tax Services',
        sku: 'TAX-BUS-001',
        userId: demoUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bookkeeping Services - Monthly',
        description: 'Monthly bookkeeping and financial record maintenance',
        price: 800.00,
        category: 'Bookkeeping',
        sku: 'BOOK-MON-001',
        userId: demoUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Financial Audit',
        description: 'Comprehensive financial audit and review',
        price: 5000.00,
        category: 'Audit',
        sku: 'AUD-FIN-001',
        userId: demoUser.id,
      },
    }),
  ]);

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