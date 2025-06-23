// Email Service Configuration
// Supports SendGrid and AWS SES

let emailClient = null;
let isEmailConfigured = false;

// Initialize email service based on available configuration
async function initializeEmail() {
    // Try SendGrid first
    if (process.env.SENDGRID_API_KEY) {
        try {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            
            emailClient = {
                type: 'sendgrid',
                send: async (options) => {
                    const msg = {
                        to: options.to,
                        from: options.from || process.env.EMAIL_FROM || 'noreply@axisthorn.com',
                        subject: options.subject,
                        text: options.text,
                        html: options.html
                    };
                    
                    if (options.replyTo) {
                        msg.replyTo = options.replyTo;
                    }
                    
                    await sgMail.send(msg);
                    return { success: true, messageId: msg.trackingSettings?.messageId };
                }
            };
            
            console.log('✅ Email configured with SendGrid');
            isEmailConfigured = true;
            return;
        } catch (error) {
            console.error('❌ SendGrid initialization failed:', error.message);
        }
    }
    
    // Try AWS SES
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        try {
            const AWS = require('aws-sdk');
            const ses = new AWS.SES({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION || 'us-east-1'
            });
            
            emailClient = {
                type: 'aws-ses',
                send: async (options) => {
                    const params = {
                        Destination: {
                            ToAddresses: [options.to]
                        },
                        Message: {
                            Body: {
                                Html: {
                                    Charset: 'UTF-8',
                                    Data: options.html || options.text
                                },
                                Text: {
                                    Charset: 'UTF-8',
                                    Data: options.text || ''
                                }
                            },
                            Subject: {
                                Charset: 'UTF-8',
                                Data: options.subject
                            }
                        },
                        Source: options.from || process.env.EMAIL_FROM || 'noreply@axisthorn.com',
                        ReplyToAddresses: options.replyTo ? [options.replyTo] : []
                    };
                    
                    const result = await ses.sendEmail(params).promise();
                    return { success: true, messageId: result.MessageId };
                }
            };
            
            console.log('✅ Email configured with AWS SES');
            isEmailConfigured = true;
            return;
        } catch (error) {
            console.error('❌ AWS SES initialization failed:', error.message);
        }
    }
    
    // Fallback to console logging
    console.log('⚠️  No email service configured. Emails will be logged to console.');
    emailClient = {
        type: 'console',
        send: async (options) => {
            console.log('📧 Email (not sent - no service configured):');
            console.log('To:', options.to);
            console.log('From:', options.from || process.env.EMAIL_FROM || 'noreply@axisthorn.com');
            console.log('Subject:', options.subject);
            console.log('Body:', options.text || 'See HTML version');
            return { success: true, messageId: 'console-' + Date.now() };
        }
    };
}

// Initialize on module load
initializeEmail().catch(console.error);

// Send email function
export async function sendEmail(options) {
    if (!emailClient) {
        await initializeEmail();
    }
    
    try {
        const result = await emailClient.send(options);
        console.log(`📧 Email sent via ${emailClient.type} to ${options.to}`);
        return result;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}

// Email templates
export const emailTemplates = {
    // Welcome email for new users
    welcome: (user) => ({
        subject: 'Welcome to Axis Thorn',
        html: `
            <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #000; margin-bottom: 24px;">Welcome to Axis Thorn</h1>
                <p style="color: #333; line-height: 1.6;">Hi ${user.name},</p>
                <p style="color: #333; line-height: 1.6;">
                    Thank you for creating an account with Axis Thorn. We're excited to help you 
                    transform your financial architecture through AI.
                </p>
                <p style="color: #333; line-height: 1.6;">
                    To get started, please verify your email address by clicking the link below:
                </p>
                <a href="${process.env.APP_URL || 'https://axisthorn.com'}/verify-email?token=${user.verificationToken}" 
                   style="display: inline-block; background: #0066ff; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; margin: 24px 0;">
                    Verify Email Address
                </a>
                <p style="color: #666; font-size: 14px; margin-top: 32px;">
                    If you didn't create an account, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                <p style="color: #999; font-size: 12px;">
                    Axis Thorn LLC<br>
                    AI-Powered Financial Intelligence
                </p>
            </div>
        `,
        text: `
Welcome to Axis Thorn

Hi ${user.name},

Thank you for creating an account with Axis Thorn. We're excited to help you transform your financial architecture through AI.

To get started, please verify your email address by visiting:
${process.env.APP_URL || 'https://axisthorn.com'}/verify-email?token=${user.verificationToken}

If you didn't create an account, please ignore this email.

Best regards,
Axis Thorn LLC
        `
    }),
    
    // Password reset email
    passwordReset: (user, resetToken) => ({
        subject: 'Password Reset Request - Axis Thorn',
        html: `
            <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #000; margin-bottom: 24px;">Password Reset Request</h1>
                <p style="color: #333; line-height: 1.6;">Hi ${user.name},</p>
                <p style="color: #333; line-height: 1.6;">
                    We received a request to reset your password. Click the link below to create a new password:
                </p>
                <a href="${process.env.APP_URL || 'https://axisthorn.com'}/reset-password?token=${resetToken}" 
                   style="display: inline-block; background: #0066ff; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; margin: 24px 0;">
                    Reset Password
                </a>
                <p style="color: #666; font-size: 14px;">
                    This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                <p style="color: #999; font-size: 12px;">
                    Axis Thorn LLC<br>
                    AI-Powered Financial Intelligence
                </p>
            </div>
        `,
        text: `
Password Reset Request

Hi ${user.name},

We received a request to reset your password. Visit the link below to create a new password:

${process.env.APP_URL || 'https://axisthorn.com'}/reset-password?token=${resetToken}

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.

Best regards,
Axis Thorn LLC
        `
    }),
    
    // Contact form submission
    contactForm: (data) => ({
        to: process.env.EMAIL_REPLY_TO || 'AI.info@axisthorn.com',
        subject: `Contact Form: ${data.type} - ${data.name}`,
        html: `
            <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #000; margin-bottom: 24px;">New Contact Form Submission</h1>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                    <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
                    <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
                    <p style="margin: 8px 0;"><strong>Company:</strong> ${data.company || 'Not provided'}</p>
                    <p style="margin: 8px 0;"><strong>Type:</strong> ${data.type}</p>
                </div>
                
                <h2 style="color: #000; margin-bottom: 16px;">Message</h2>
                <div style="background: #fff; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
                    <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                <p style="color: #999; font-size: 12px;">
                    Submitted on ${new Date().toLocaleString()}<br>
                    From: ${data.email}
                </p>
            </div>
        `,
        text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not provided'}
Type: ${data.type}

Message:
${data.message}

Submitted on ${new Date().toLocaleString()}
        `,
        replyTo: data.email
    })
};

// Export utility functions
export function isConfigured() {
    return isEmailConfigured;
}

export default {
    sendEmail,
    emailTemplates,
    isConfigured
};