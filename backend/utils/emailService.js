const nodemailer = require('nodemailer');

// Create reusable transporter
let transporter = null;

/**
 * Get email transporter (lazy initialization)
 */
function getTransporter() {
  if (!transporter && process.env.MAIL_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      },
      // Performance optimizations
      pool: true, // Use pooled connections
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 10 // 10 messages per second max
    });
  }
  return transporter;
}

/**
 * Verify email connection
 */
async function verifyConnection() {
  try {
    const transport = getTransporter();
    if (!transport) {
      return { connected: false, error: 'Email not configured' };
    }
    
    await transport.verify();
    console.log('✅ Email Service Connected Successfully');
    return { connected: true };
  } catch (error) {
    console.error('❌ Email Service Connection Error:', error.message);
    return { connected: false, error: error.message };
  }
}

/**
 * Send email
 */
async function sendEmail({ to, subject, html, text }) {
  try {
    const transport = getTransporter();
    if (!transport) {
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME || 'Movia'}" <${process.env.MAIL_FROM_ADDRESS || 'no-reply@movia.club'}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const result = await transport.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${result.messageId}`);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email to new user
 */
async function sendWelcomeEmail(user) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Movia!</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name || 'there'}!</h2>
          <p>Thank you for joining Movia! We're excited to have you on board.</p>
          <p>With your account, you can:</p>
          <ul>
            <li>✅ Create professional CVs with beautiful templates</li>
            <li>✅ Upload and share wallpapers</li>
            <li>✅ Access stock photos for your projects</li>
            <li>✅ Create stunning presentations</li>
          </ul>
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/cv-builder" class="button">
              Start Creating
            </a>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Movia. All rights reserved.</p>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🎉 Welcome to Movia - Your Creative Journey Begins!',
    html
  });
}

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(user, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name || 'there'}!</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">
              Reset Password
            </a>
          </p>
          <div class="warning">
            <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
          </div>
          <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Movia. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🔐 Reset Your Movia Password',
    html
  });
}

/**
 * Send CV download notification
 */
async function sendCVDownloadEmail(user, cvName) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .success-box { background: #d1fae5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📄 CV Downloaded Successfully!</h1>
        </div>
        <div class="content">
          <div class="success-box">
            <h2 style="color: #059669; margin: 0;">✅ Your CV is Ready!</h2>
            <p style="margin: 10px 0 0 0;">"${cvName}" has been downloaded.</p>
          </div>
          <p>Thank you for using Movia to create your professional CV. Good luck with your job search!</p>
          <p><strong>Pro Tips:</strong></p>
          <ul>
            <li>Keep your CV updated with your latest achievements</li>
            <li>Customize it for each job application</li>
            <li>Try different templates to stand out</li>
          </ul>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Movia. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '📄 Your CV Has Been Downloaded - Movia',
    html
  });
}

module.exports = {
  getTransporter,
  verifyConnection,
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendCVDownloadEmail
};
