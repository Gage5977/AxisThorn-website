const nodemailer = require('nodemailer');

class EmailService {
  static getTransporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  static async sendInvoice(invoice, pdfBuffer) {
    const transporter = this.getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: invoice.customerEmail,
      subject: `Invoice ${invoice.number} from Your Company`,
      html: `
        <h2>Invoice ${invoice.number}</h2>
        <p>Dear ${invoice.customerName},</p>
        <p>Please find attached invoice ${invoice.number} for the amount of $${invoice.total.toFixed(2)}.</p>
        
        <h3>Invoice Details:</h3>
        <ul>
          <li>Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}</li>
          <li>Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Upon Receipt'}</li>
          <li>Total Amount: $${invoice.total.toFixed(2)}</li>
          <li>Amount Due: $${invoice.amountDue.toFixed(2)}</li>
        </ul>
        
        ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
        
        <p>Thank you for your business!</p>
        
        <p>Best regards,<br>Your Company</p>
      `,
      attachments: [
        {
          filename: `invoice-${invoice.number}.pdf`,
          content: pdfBuffer
        }
      ]
    };
    
    return transporter.sendMail(mailOptions);
  }

  static async sendPaymentReminder(invoice) {
    const transporter = this.getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: invoice.customerEmail,
      subject: `Payment Reminder - Invoice ${invoice.number}`,
      html: `
        <h2>Payment Reminder</h2>
        <p>Dear ${invoice.customerName},</p>
        <p>This is a friendly reminder that invoice ${invoice.number} has an outstanding balance.</p>
        
        <h3>Invoice Details:</h3>
        <ul>
          <li>Invoice Number: ${invoice.number}</li>
          <li>Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}</li>
          <li>Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Upon Receipt'}</li>
          <li>Total Amount: $${invoice.total.toFixed(2)}</li>
          <li>Amount Due: $${invoice.amountDue.toFixed(2)}</li>
        </ul>
        
        <p>Please remit payment at your earliest convenience.</p>
        
        <p>Thank you!</p>
        
        <p>Best regards,<br>Your Company</p>
      `
    };
    
    return transporter.sendMail(mailOptions);
  }

  static async sendPaymentConfirmation(invoice) {
    const transporter = this.getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: invoice.customerEmail,
      subject: `Payment Received - Invoice ${invoice.number}`,
      html: `
        <h2>Payment Confirmation</h2>
        <p>Dear ${invoice.customerName},</p>
        <p>We have received your payment for invoice ${invoice.number}. Thank you!</p>
        
        <h3>Payment Details:</h3>
        <ul>
          <li>Invoice Number: ${invoice.number}</li>
          <li>Total Amount: $${invoice.total.toFixed(2)}</li>
          <li>Amount Paid: $${invoice.amountPaid.toFixed(2)}</li>
          <li>Payment Date: ${new Date().toLocaleDateString()}</li>
        </ul>
        
        <p>Thank you for your prompt payment!</p>
        
        <p>Best regards,<br>Your Company</p>
      `
    };
    
    return transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService;