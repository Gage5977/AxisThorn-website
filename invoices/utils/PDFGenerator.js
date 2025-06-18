const PDFDocument = require('pdfkit');

class PDFGenerator {
  static async generateInvoicePDF(invoice) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];
        
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        
        // Header
        doc.fontSize(20)
           .text('INVOICE', 50, 50)
           .fontSize(10)
           .text(`Invoice #: ${invoice.number}`, 50, 80)
           .text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 50, 95)
           .text(`Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Upon Receipt'}`, 50, 110);
        
        // Status
        doc.fontSize(12)
           .text(`Status: ${invoice.status.toUpperCase()}`, 400, 80);
        
        // Customer Details
        doc.fontSize(12)
           .text('Bill To:', 50, 150)
           .fontSize(10)
           .text(invoice.customerName, 50, 170)
           .text(invoice.customerEmail, 50, 185);
        
        if (invoice.customerAddress) {
          const addr = invoice.customerAddress;
          let y = 200;
          if (addr.line1) {
            doc.text(addr.line1, 50, y);
            y += 15;
          }
          if (addr.line2) {
            doc.text(addr.line2, 50, y);
            y += 15;
          }
          if (addr.city || addr.state || addr.postalCode) {
            doc.text(`${addr.city}, ${addr.state} ${addr.postalCode}`, 50, y);
          }
        }
        
        // Items Table
        const tableTop = 300;
        doc.fontSize(10);
        
        // Table Headers
        doc.text('Description', 50, tableTop)
           .text('Qty', 300, tableTop)
           .text('Unit Price', 350, tableTop)
           .text('Amount', 450, tableTop);
        
        // Line below headers
        doc.moveTo(50, tableTop + 15)
           .lineTo(550, tableTop + 15)
           .stroke();
        
        // Items
        let y = tableTop + 25;
        invoice.items.forEach(item => {
          doc.text(item.description, 50, y)
             .text(item.quantity.toString(), 300, y)
             .text(`$${item.unitPrice.toFixed(2)}`, 350, y)
             .text(`$${item.amount.toFixed(2)}`, 450, y);
          y += 20;
        });
        
        // Totals
        const totalsY = y + 20;
        doc.text('Subtotal:', 350, totalsY)
           .text(`$${invoice.subtotal.toFixed(2)}`, 450, totalsY);
        
        if (invoice.discount > 0) {
          const discountLabel = invoice.discountType === 'percentage' 
            ? `Discount (${invoice.discount}%):` 
            : 'Discount:';
          doc.text(discountLabel, 350, totalsY + 20)
             .text(`-$${((invoice.discountType === 'percentage' ? (invoice.subtotal * invoice.discount / 100) : invoice.discount)).toFixed(2)}`, 450, totalsY + 20);
        }
        
        if (invoice.taxRate > 0) {
          doc.text(`Tax (${invoice.taxRate}%):`, 350, totalsY + 40)
             .text(`$${invoice.tax.toFixed(2)}`, 450, totalsY + 40);
        }
        
        doc.fontSize(12)
           .text('Total:', 350, totalsY + 60)
           .text(`$${invoice.total.toFixed(2)}`, 450, totalsY + 60);
        
        if (invoice.amountPaid > 0) {
          doc.fontSize(10)
             .text('Amount Paid:', 350, totalsY + 80)
             .text(`$${invoice.amountPaid.toFixed(2)}`, 450, totalsY + 80);
        }
        
        doc.fontSize(12)
           .text('Amount Due:', 350, totalsY + 100)
           .text(`$${invoice.amountDue.toFixed(2)}`, 450, totalsY + 100);
        
        // Notes
        if (invoice.notes) {
          doc.fontSize(10)
             .text('Notes:', 50, totalsY + 140)
             .fontSize(9)
             .text(invoice.notes, 50, totalsY + 155, { width: 500 });
        }
        
        // Terms
        if (invoice.terms) {
          const termsY = invoice.notes ? totalsY + 200 : totalsY + 140;
          doc.fontSize(10)
             .text('Terms:', 50, termsY)
             .fontSize(9)
             .text(invoice.terms, 50, termsY + 15, { width: 500 });
        }
        
        // Footer
        if (invoice.footer) {
          doc.fontSize(8)
             .text(invoice.footer, 50, 700, { align: 'center', width: 500 });
        }
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PDFGenerator;