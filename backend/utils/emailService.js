const nodemailer = require('nodemailer');

// Site configuration
const SITE_CONFIG = {
  name: 'Ezy CV',
  email: 'ezycv22@gmail.com',
  location: 'Rambukkana, Sri Lanka',
  url: process.env.FRONTEND_URL || 'http://localhost:3000'
};

// Create reusable transporter (configured for Brevo/Sendinblue)
let transporter = null;

/**
 * Get email transporter (lazy initialization)
 * Configured for Brevo SMTP relay
 */
function getTransporter() {
  if (!transporter && process.env.MAIL_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // smtp-relay.brevo.com
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
      from: `"${process.env.MAIL_FROM_NAME || 'Ezy CV'}" <${process.env.MAIL_FROM_ADDRESS || 'ezycv22@gmail.com'}>`,
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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 32px; }
        .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .welcome-box { background: linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 100%); border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center; }
        .welcome-box h2 { color: #6366f1; margin: 0 0 10px 0; }
        .feature-list { list-style: none; padding: 0; margin: 25px 0; }
        .feature-list li { padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; }
        .feature-list li:last-child { border-bottom: none; }
        .feature-icon { width: 24px; height: 24px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 12px; }
        .button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
        .button:hover { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); }
        .footer { text-align: center; padding: 25px; color: #64748b; font-size: 12px; }
        .social-links { margin: 15px 0; }
        .social-links a { color: #6366f1; text-decoration: none; margin: 0 10px; }
        .emoji { font-size: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1><span class="emoji">🎉</span> Welcome to Ezy CV!</h1>
          <p>Your creative journey starts now</p>
        </div>
        <div class="content">
          <div class="welcome-box">
            <h2>Hi ${user.name || 'there'}! 💜</h2>
            <p style="color: #64748b; margin: 0;">We're absolutely thrilled to have you join our family!</p>
          </div>
          
          <p style="font-size: 16px; color: #374151;">Thank you for choosing <strong>Ezy CV</strong>! You now have access to all our amazing features - completely <strong>FREE</strong>!</p>
          
          <ul class="feature-list">
            <li>
              <span class="feature-icon">✓</span>
              <span><strong>Professional CV Builder</strong> - Create stunning CVs in minutes</span>
            </li>
            <li>
              <span class="feature-icon">✓</span>
              <span><strong>10+ Beautiful Templates</strong> - From modern to classic designs</span>
            </li>
            <li>
              <span class="feature-icon">✓</span>
              <span><strong>HD Wallpapers</strong> - Thousands of free wallpapers</span>
            </li>
            <li>
              <span class="feature-icon">✓</span>
              <span><strong>Stock Photos</strong> - High-quality images for your projects</span>
            </li>
            <li>
              <span class="feature-icon">✓</span>
              <span><strong>Instant PDF Download</strong> - No watermarks, no limits</span>
            </li>
          </ul>
          
          <p style="text-align: center; margin-top: 35px;">
            <a href="${SITE_CONFIG.url}/cv-builder" class="button">
              🚀 Start Creating Your CV
            </a>
          </p>
          
          <p style="text-align: center; color: #64748b; margin-top: 25px; font-size: 14px;">
            Got questions? Just reply to this email - we're here to help!
          </p>
        </div>
        <div class="footer">
          <p><strong>Ezy CV</strong> - Free Professional CV Builder</p>
          <p>📍 ${SITE_CONFIG.location}</p>
          <p>© ${new Date().getFullYear()} Ezy CV. Made with 💜 for job seekers everywhere.</p>
          <p style="margin-top: 15px;">You received this email because you signed up for Ezy CV.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🎉 Welcome to Ezy CV - Your Creative Journey Begins!',
    html
  });
}

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(user, resetToken) {
  const resetUrl = `${SITE_CONFIG.url}/reset-password?token=${resetToken}`;
  
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
          <p>We received a request to reset your Ezy CV password. Click the button below to create a new password:</p>
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
          <p>© ${new Date().getFullYear()} Ezy CV. All rights reserved.</p>
          <p>📍 ${SITE_CONFIG.location}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🔐 Reset Your Ezy CV Password',
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
          <p>Thank you for using Ezy CV to create your professional CV. Good luck with your job search!</p>
          <p><strong>Pro Tips:</strong></p>
          <ul>
            <li>Keep your CV updated with your latest achievements</li>
            <li>Customize it for each job application</li>
            <li>Try different templates to stand out</li>
          </ul>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Ezy CV. All rights reserved.</p>
          <p>📍 ${SITE_CONFIG.location}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '📄 Your CV Has Been Downloaded - Ezy CV',
    html
  });
}

/**
 * Send contact form message to support email
 */
async function sendContactFormEmail({ name, email, subject, message }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .label { font-weight: 600; color: #6366f1; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { margin-top: 5px; color: #1e293b; }
        .message-box { background: white; border-left: 4px solid #6366f1; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 New Contact Form Message</h1>
        </div>
        <div class="content">
          <p style="color: #64748b;">You have received a new message from the Ezy CV contact form:</p>
          
          <div class="info-box">
            <div style="margin-bottom: 15px;">
              <div class="label">From</div>
              <div class="value">${name}</div>
            </div>
            <div style="margin-bottom: 15px;">
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></div>
            </div>
            <div>
              <div class="label">Subject</div>
              <div class="value">${subject}</div>
            </div>
          </div>
          
          <div class="message-box">
            <div class="label" style="margin-bottom: 10px;">Message</div>
            <div style="white-space: pre-wrap;">${message}</div>
          </div>
          
          <p style="text-align: center; margin-top: 25px;">
            <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Reply to ${name}
            </a>
          </p>
        </div>
        <div class="footer">
          <p>This message was sent via Ezy CV Contact Form</p>
          <p>📍 ${SITE_CONFIG.location}</p>
          <p>© ${new Date().getFullYear()} Ezy CV</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send to support email
  return sendEmail({
    to: SITE_CONFIG.email,
    subject: `📬 Contact Form: ${subject}`,
    html
  });
}

/**
 * Send confirmation email to user who submitted contact form
 */
async function sendContactConfirmationEmail({ name, email, subject }) {
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
          <h1>✅ Message Received!</h1>
        </div>
        <div class="content">
          <div class="success-box">
            <h2 style="color: #059669; margin: 0;">Thank you, ${name}!</h2>
            <p style="margin: 10px 0 0 0;">We've received your message.</p>
          </div>
          <p>We appreciate you reaching out to us! Our team will review your message regarding:</p>
          <p style="background: #f1f5f9; padding: 15px; border-radius: 8px; font-style: italic;">"${subject}"</p>
          <p>We typically respond within <strong>24-48 hours</strong>. In the meantime, feel free to explore our features:</p>
          <ul>
            <li>Create a professional CV with our free builder</li>
            <li>Browse our HD wallpaper collection</li>
            <li>Download stock photos for your projects</li>
          </ul>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Ezy CV. All rights reserved.</p>
          <p>📍 ${SITE_CONFIG.location}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '✅ We received your message - Ezy CV',
    html
  });
}

/**
 * Send newsletter subscription confirmation email
 */
async function sendNewsletterSubscriptionEmail(email) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); padding: 50px 30px; text-align: center; border-radius: 16px 16px 0 0; position: relative; overflow: hidden; }
        .header::before { content: '✨'; position: absolute; top: 20px; left: 30px; font-size: 40px; opacity: 0.3; }
        .header::after { content: '🚀'; position: absolute; bottom: 20px; right: 30px; font-size: 40px; opacity: 0.3; }
        .header h1 { color: white; margin: 0; font-size: 36px; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
        .header p { color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 18px; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .welcome-badge { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 25px; border-radius: 50px; display: inline-block; margin: 20px 0; font-weight: 600; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
        .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0; }
        .feature-card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #e2e8f0; }
        .feature-card .emoji { font-size: 32px; margin-bottom: 10px; }
        .feature-card h3 { margin: 0 0 5px 0; font-size: 16px; color: #1e293b; }
        .feature-card p { margin: 0; font-size: 13px; color: #64748b; }
        .highlight-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 25px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 20px 0; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
        .footer { text-align: center; padding: 30px; color: #64748b; font-size: 14px; }
        .footer p { margin: 5px 0; }
        .social-icons { margin: 15px 0; }
        .social-icons a { display: inline-block; margin: 0 10px; font-size: 24px; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to the Family!</h1>
          <p>You're now part of something amazing</p>
        </div>
        <div class="content">
          <div class="welcome-badge">
            🌟 Subscribed Successfully!
          </div>
          
          <h2 style="color: #1e293b; margin-top: 20px;">Hey there, Creative Soul! 💜</h2>
          
          <p style="font-size: 16px; color: #475569;">
            We're absolutely <strong>thrilled</strong> to have you join our growing community at <strong>Ezy CV</strong>! 
            You've just unlocked access to a world of creativity, professional growth, and endless possibilities.
          </p>

          <div class="highlight-box">
            <strong style="color: #b45309;">✨ What's in it for you?</strong>
            <p style="margin: 10px 0 0 0; color: #78350f;">
              You'll be the first to know about new CV templates, exclusive design tips, 
              HD wallpapers, and career-boosting resources - all 100% free!
            </p>
          </div>

          <div class="feature-grid">
            <div class="feature-card">
              <div class="emoji">📄</div>
              <h3>New Templates</h3>
              <p>Fresh CV designs weekly</p>
            </div>
            <div class="feature-card">
              <div class="emoji">🎨</div>
              <h3>Design Tips</h3>
              <p>Pro design secrets</p>
            </div>
            <div class="feature-card">
              <div class="emoji">🖼️</div>
              <h3>HD Wallpapers</h3>
              <p>Beautiful downloads</p>
            </div>
            <div class="feature-card">
              <div class="emoji">📸</div>
              <h3>Stock Photos</h3>
              <p>Free quality images</p>
            </div>
          </div>

          <p style="font-size: 16px; color: #475569; margin-top: 25px;">
            <strong>Ready to get started?</strong> Create your stunning professional CV today - it's completely free, 
            takes less than 10 minutes, and you'll have a job-winning resume ready to download!
          </p>

          <center>
            <a href="${SITE_CONFIG.url}/cv-builder" class="cta-button">
              🚀 Start Building Your CV
            </a>
          </center>

          <p style="font-size: 14px; color: #64748b; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
            <strong>Pro Tip:</strong> Save your CV progress by creating a free account. You can edit and update it anytime!
          </p>

          <p style="text-align: center; margin-top: 30px; color: #475569;">
            We're honored to be part of your journey! 🌟<br>
            <em>- The Ezy CV Team</em>
          </p>
        </div>
        
        <div class="footer">
          <div class="social-icons">
            <a href="${SITE_CONFIG.url}">🌐</a>
            <a href="mailto:${SITE_CONFIG.email}">📧</a>
          </div>
          <p><strong>Ezy CV</strong> - Your Career, Simplified</p>
          <p>© ${new Date().getFullYear()} Ezy CV. All rights reserved.</p>
          <p>📍 ${SITE_CONFIG.location}</p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 15px;">
            You're receiving this because you subscribed to updates at Ezy CV.<br>
            Want to unsubscribe? Reply to this email with "Unsubscribe"
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🎉 Welcome to Ezy CV - You\'re In! 💜',
    html
  });
}

module.exports = {
  getTransporter,
  verifyConnection,
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendCVDownloadEmail,
  sendContactFormEmail,
  sendContactConfirmationEmail,
  sendNewsletterSubscriptionEmail,
  SITE_CONFIG
};
