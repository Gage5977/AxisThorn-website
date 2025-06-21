const Invoice = require('../finance-management/models/Invoice');
const PDFDocument = require('pdfkit');

class PDFService {
  /**
   * Convert Prisma invoice model to Invoice-Generator DTO
   * @param {Object} prismaInvoice - Invoice from Prisma with includes
   * @returns {Invoice} - Invoice-Generator model instance
   */
  static prismaToInvoiceDTO(prismaInvoice) {
    return new Invoice({
      id: prismaInvoice.id,
      number: prismaInvoice.invoiceNumber,
      customerName: prismaInvoice.customer.name,
      customerEmail: prismaInvoice.customer.email,
      customerAddress: prismaInvoice.customer.address || {},
      items: prismaInvoice.items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount
      })),
      status: prismaInvoice.status.toLowerCase(),
      currency: 'usd',
      subtotal: prismaInvoice.subtotal,
      tax: prismaInvoice.tax,
      taxRate: prismaInvoice.taxRate,
      discount: prismaInvoice.discount,
      discountType: prismaInvoice.discountType.toLowerCase(),
      total: prismaInvoice.total,
      amountPaid: prismaInvoice.amountPaid,
      amountDue: prismaInvoice.amountDue,
      dueDate: prismaInvoice.dueDate,
      invoiceDate: prismaInvoice.createdAt,
      notes: prismaInvoice.notes || '',
      terms: prismaInvoice.terms || '',
      createdAt: prismaInvoice.createdAt,
      updatedAt: prismaInvoice.updatedAt
    });
  }

  /**
   * Generate PDF buffer for an invoice
   * @param {Object} prismaInvoice - Invoice from Prisma with includes
   * @returns {Promise<Buffer>} - PDF buffer
   */
  static async generateInvoicePDF(prismaInvoice) {
    const invoice = this.prismaToInvoiceDTO(prismaInvoice);
    
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        
        doc.on('data', buffer => buffers.push(buffer));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Header
        this.addHeader(doc, invoice);
        
        // Customer information
        this.addCustomerInfo(doc, invoice);
        
        // Invoice details
        this.addInvoiceDetails(doc, invoice);
        
        // Items table
        this.addItemsTable(doc, invoice);
        
        // Totals
        this.addTotals(doc, invoice);
        
        // Footer
        this.addFooter(doc, invoice);
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  static addHeader(doc, invoice) {
    // Company name and logo area
    doc.fontSize(24)
       .fillColor('#1e3a8a')
       .text('Axis Thorn LLC', 50, 50);
    
    doc.fontSize(12)
       .fillColor('#64748b')
       .text('Financial Consulting & Administrative Services', 50, 80);
    
    // Invoice title
    doc.fontSize(20)
       .fillColor('#1e3a8a')
       .text('INVOICE', 400, 50, { align: 'right' });
    
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`Invoice #: ${invoice.number}`, 400, 80, { align: 'right' })
       .text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 400, 95, { align: 'right' })
       .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 400, 110, { align: 'right' });
    
    // Line separator
    doc.moveTo(50, 140)
       .lineTo(550, 140)
       .strokeColor('#e5e7eb')
       .stroke();
  }

  static addCustomerInfo(doc, invoice) {
    let yPos = 160;
    
    // Bill To section
    doc.fontSize(14)
       .fillColor('#374151')
       .text('Bill To:', 50, yPos);
    
    yPos += 20;
    doc.fontSize(12)
       .fillColor('#111827')
       .text(invoice.customerName, 50, yPos);
    
    if (invoice.customerAddress) {
      const addr = invoice.customerAddress;
      if (addr.street) {
        yPos += 15;
        doc.text(addr.street, 50, yPos);
      }
      if (addr.city || addr.state || addr.zip) {
        yPos += 15;
        const cityStateZip = [addr.city, addr.state, addr.zip].filter(Boolean).join(', ');
        doc.text(cityStateZip, 50, yPos);
      }
      if (addr.country) {
        yPos += 15;
        doc.text(addr.country, 50, yPos);
      }
    }
    
    yPos += 15;
    doc.text(invoice.customerEmail, 50, yPos);
    
    return yPos + 30;
  }

  static addInvoiceDetails(doc, invoice) {
    const startY = 160;
    
    // Invoice details box
    doc.rect(350, startY, 200, 120)
       .fillColor('#f8fafc')
       .fill()
       .strokeColor('#e5e7eb')
       .stroke();
    
    let yPos = startY + 15;
    doc.fillColor('#374151')
       .fontSize(10);
    
    doc.text('Status:', 360, yPos)
       .text(invoice.status.toUpperCase(), 420, yPos);
    
    yPos += 20;
    doc.text('Payment Status:', 360, yPos)
       .text(invoice.paymentStatus?.toUpperCase() || 'UNPAID', 420, yPos);
    
    yPos += 20;
    doc.text('Amount Due:', 360, yPos)
       .fillColor('#dc2626')
       .fontSize(12)
       .text(`$${invoice.amountDue.toFixed(2)}`, 420, yPos);
    
    yPos += 25;
    doc.fillColor('#374151')
       .fontSize(10)
       .text('Total Amount:', 360, yPos)
       .fontSize(12)
       .text(`$${invoice.total.toFixed(2)}`, 420, yPos);
  }

  static addItemsTable(doc, invoice) {
    let yPos = 320;
    
    // Table header
    doc.rect(50, yPos, 500, 25)
       .fillColor('#1e3a8a')
       .fill();
    
    doc.fillColor('#ffffff')
       .fontSize(10)
       .text('Description', 60, yPos + 8)
       .text('Qty', 350, yPos + 8)
       .text('Unit Price', 400, yPos + 8)
       .text('Amount', 480, yPos + 8);
    
    yPos += 25;
    
    // Table rows
    invoice.items.forEach((item, index) => {
      const bgColor = index % 2 === 0 ? '#f8fafc' : '#ffffff';
      
      doc.rect(50, yPos, 500, 20)
         .fillColor(bgColor)
         .fill();
      
      doc.fillColor('#374151')
         .fontSize(9)
         .text(item.description, 60, yPos + 6, { width: 280 })
         .text(item.quantity.toString(), 350, yPos + 6)
         .text(`$${item.unitPrice.toFixed(2)}`, 400, yPos + 6)
         .text(`$${item.amount.toFixed(2)}`, 480, yPos + 6);
      
      yPos += 20;
    });
    
    // Table border
    doc.rect(50, 320, 500, yPos - 320)
       .strokeColor('#e5e7eb')
       .stroke();
    
    return yPos + 20;
  }

  static addTotals(doc, invoice) {
    let yPos = doc.y + 20;
    
    // Totals box
    doc.rect(350, yPos, 200, 100)
       .fillColor('#f8fafc')
       .fill()
       .strokeColor('#e5e7eb')
       .stroke();
    
    yPos += 15;
    doc.fillColor('#374151')
       .fontSize(10);
    
    doc.text('Subtotal:', 360, yPos)
       .text(`$${invoice.subtotal.toFixed(2)}`, 480, yPos, { align: 'right' });
    
    if (invoice.discount > 0) {
      yPos += 15;
      doc.text('Discount:', 360, yPos)
         .text(`-$${invoice.discount.toFixed(2)}`, 480, yPos, { align: 'right' });
    }
    
    yPos += 15;
    doc.text(`Tax (${invoice.taxRate}%):`, 360, yPos)
       .text(`$${invoice.tax.toFixed(2)}`, 480, yPos, { align: 'right' });
    
    // Total line
    yPos += 20;
    doc.moveTo(360, yPos)
       .lineTo(540, yPos)
       .strokeColor('#374151')
       .stroke();
    
    yPos += 10;
    doc.fontSize(12)
       .fillColor('#1e3a8a')
       .text('Total:', 360, yPos)
       .text(`$${invoice.total.toFixed(2)}`, 480, yPos, { align: 'right' });
    
    if (invoice.amountPaid > 0) {
      yPos += 15;
      doc.fontSize(10)
         .fillColor('#059669')
         .text('Paid:', 360, yPos)
         .text(`$${invoice.amountPaid.toFixed(2)}`, 480, yPos, { align: 'right' });
      
      yPos += 15;
      doc.fillColor('#dc2626')
         .text('Amount Due:', 360, yPos)
         .text(`$${invoice.amountDue.toFixed(2)}`, 480, yPos, { align: 'right' });
    }
  }

  static addFooter(doc, invoice) {
    const footerY = 700;
    
    // Terms and notes
    if (invoice.terms) {
      doc.fontSize(10)
         .fillColor('#6b7280')
         .text('Terms:', 50, footerY)
         .text(invoice.terms, 50, footerY + 15, { width: 500 });
    }
    
    if (invoice.notes) {
      doc.fontSize(10)
         .fillColor('#6b7280')
         .text('Notes:', 50, footerY + 40)
         .text(invoice.notes, 50, footerY + 55, { width: 500 });
    }
    
    // Company footer
    doc.fontSize(8)
       .fillColor('#9ca3af')
       .text('Axis Thorn LLC | AI-Powered Financial Intelligence', 50, 750, { align: 'center', width: 500 })
       .text('Email: info@axisthorn.com | Web: https://axisthorn.com', 50, 765, { align: 'center', width: 500 });
  }
}

module.exports = PDFService;