const prisma = require('./lib/prisma');
const PDFService = require('./services/pdfService');
const fs = require('fs');

async function testPDFGeneration() {
  try {
    console.log('🧪 Testing PDF generation...');
    
    // Get a sample invoice
    const invoice = await prisma.invoice.findFirst({
      include: {
        customer: true,
        items: true,
        payments: true
      }
    });
    
    if (!invoice) {
      console.log('❌ No invoices found in database');
      return;
    }
    
    console.log(`✅ Found invoice: ${invoice.invoiceNumber}`);
    
    // Generate PDF
    const pdfBuffer = await PDFService.generateInvoicePDF(invoice);
    console.log(`✅ PDF generated successfully, size: ${pdfBuffer.length} bytes`);
    
    // Save to file for testing
    const filename = `test-invoice-${invoice.invoiceNumber}.pdf`;
    fs.writeFileSync(filename, pdfBuffer);
    console.log(`💾 PDF saved as: ${filename}`);
    
  } catch (error) {
    console.error('❌ Error testing PDF generation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPDFGeneration();