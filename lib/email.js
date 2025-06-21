const nodemailer = require('nodemailer');
const { logger } = require('../api/middleware/security');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.init();
  }

  init() {
    // Check if email configuration is present
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn('Email service disabled - SMTP configuration missing');
      this.isConfigured = false;
      return;
    }

    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Verify configuration
      this.transporter.verify((error) => {
        if (error) {
          logger.error('Email configuration error:', error);
          this.isConfigured = false;
        } else {
          logger.info('Email service configured successfully');
          this.isConfigured = true;
        }
      });
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
      this.isConfigured = false;
    }
  }

  async sendEmail(options) {
    if (!this.isConfigured) {
      logger.warn('Email not sent - service not configured', {
        to: options.to,
        subject: options.subject
      });
      return { sent: false, reason: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: options.from || process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject
      });

      return { sent: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Failed to send email:', error);
      return { sent: false, error: error.message };
    }
  }

  async sendInvoiceEmail(invoice, pdfBuffer) {
    const subject = `Invoice ${invoice.number} from Axis Thorn LLC`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3F72AF;">Invoice ${invoice.number}</h2>
        <p>Dear ${invoice.customerName},</p>
        <p>Please find attached invoice ${invoice.number} for the amount of $${invoice.totalAmount.toFixed(2)}.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Invoice Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(invoice.date).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Due Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(invoice.dueDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Total Amount:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${invoice.totalAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Payment Status:</strong></td>
            <td style="padding: 8px; color: ${invoice.paymentStatus === 'paid' ? '#22C55E' : '#EF4444'};">
              ${invoice.paymentStatus.toUpperCase()}
            </td>
          </tr>
        </table>
        
        ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
        
        <p>Thank you for your business!</p>
        
        <hr style="border: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          <strong>Axis Thorn LLC</strong><br>
          AI & Automation Solutions<br>
          <a href="https://axisthorn.com" style="color: #3F72AF;">axisthorn.com</a>
        </p>
      </div>
    `;

    const attachments = pdfBuffer ? [{
      filename: `invoice-${invoice.number}.pdf`,
      content: pdfBuffer
    }] : [];

    return this.sendEmail({
      to: invoice.customerEmail,
      subject,
      html,
      attachments
    });
  }

  async sendPaymentConfirmation(payment, invoice) {
    const subject = `Payment Received - Invoice ${invoice.number}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22C55E;">Payment Confirmation</h2>
        <p>Dear ${invoice.customerName},</p>
        <p>We have received your payment for invoice ${invoice.number}. Thank you!</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Invoice Number:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${invoice.number}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Payment Amount:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${payment.amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Payment Method:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payment.method}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Payment Date:</strong></td>
            <td style="padding: 8px;">${new Date(payment.date).toLocaleDateString()}</td>
          </tr>
        </table>
        
        ${payment.receiptUrl ? `
          <p><a href="${payment.receiptUrl}" style="color: #3F72AF;">View Receipt</a></p>
        ` : ''}
        
        <p>Thank you for your prompt payment!</p>
        
        <hr style="border: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          <strong>Axis Thorn LLC</strong><br>
          AI & Automation Solutions<br>
          <a href="https://axisthorn.com" style="color: #3F72AF;">axisthorn.com</a>
        </p>
      </div>
    `;

    return this.sendEmail({
      to: invoice.customerEmail,
      subject,
      html
    });
  }

  async sendPasswordReset(email, resetToken) {
    const resetUrl = `${process.env.VERCEL_URL || 'https://axisthorn.com'}/reset-password?token=${resetToken}`;
    
    const subject = 'Password Reset Request - Axis Thorn Portal';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3F72AF;">Password Reset Request</h2>
        <p>You requested a password reset for your Axis Thorn Portal account.</p>
        
        <p>Click the link below to reset your password:</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" style="background: #3F72AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </p>
        
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
        
        <hr style="border: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          <strong>Axis Thorn LLC</strong><br>
          <a href="https://axisthorn.com" style="color: #3F72AF;">axisthorn.com</a>
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html
    });
  }
}

// Export singleton instance
module.exports = new EmailService();