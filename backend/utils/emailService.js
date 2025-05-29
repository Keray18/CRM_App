require('dotenv').config(); // Ensure environment variables are loaded

const nodemailer = require('nodemailer');

// Verify that environment variables are loaded
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ EMAIL_USER or EMAIL_PASSWORD not set in .env file');
  process.exit(1); // Stop the app if credentials are missing
}

// Create transporter using Gmail and App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
const emailTemplates = {
  policyCreated: (policy) => ({
    subject: `Your Insurance Policy ${policy.policyNumber} has been created`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Policy Creation Confirmation</h2>
        <p>Dear ${policy.insuredName},</p>
        <p>We are pleased to inform you that your insurance policy has been successfully created.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Policy Details:</h3>
          <p><strong>Policy Number:</strong> ${policy.policyNumber}</p>
          <p><strong>Policy Type:</strong> ${policy.type}</p>
          <p><strong>Start Date:</strong> ${policy.startDate}</p>
          <p><strong>End Date:</strong> ${policy.endDate}</p>
          <p><strong>Insurance Company:</strong> ${policy.company}</p>
          <p><strong>Total Premium:</strong> ₹${policy.totalPremium}</p>
        </div>

        <p>Please keep this policy number for your records. You can use it for any future correspondence with us.</p>
        <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>

        <p>Best regards,<br>Your Insurance Team</p>
      </div>
    `
  }),
  
  // Add new template for renewal reminder
  renewalReminder: (policy) => ({
    subject: `Reminder: Your Insurance Policy ${policy.policyNumber} is Due for Renewal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Policy Renewal Reminder</h2>
        <p>Dear ${policy.insuredName},</p>
        <p>This is a friendly reminder that your insurance policy is approaching its end date and will need to be renewed soon.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Policy Details:</h3>
          <p><strong>Policy Number:</strong> ${policy.policyNumber}</p>
          <p><strong>Policy Type:</strong> ${policy.type}</p>
          <p><strong>End Date:</strong> ${policy.endDate}</p>
          <p><strong>Insurance Company:</strong> ${policy.company}</p>
        </div>

        <p style="color: #e74c3c; font-weight: bold;">To ensure continuous coverage, please renew your policy before the end date.</p>
        
        <p>Benefits of timely renewal:</p>
        <ul>
          <li>Continuous insurance coverage</li>
          <li>No break in policy benefits</li>
          <li>Maintain your No Claim Bonus (if applicable)</li>
        </ul>

        <p>If you have any questions about the renewal process or need assistance, please don't hesitate to contact us.</p>

        <p>Best regards,<br>Your Insurance Team</p>
      </div>
    `
  })
};

// Function to send email using selected template
const sendEmail = async (to, templateKey, data) => {
  try {
    console.log('📧 Attempting to send email:', {
      to,
      templateKey,
      policyNumber: data.policyNumber
    });

    if (!emailTemplates[templateKey]) {
      throw new Error(`Template "${templateKey}" not found.`);
    }

    const { subject, html } = emailTemplates[templateKey](data);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    console.log('📧 Mail options configured:', {
      from: process.env.EMAIL_USER,
      to,
      subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      to,
      subject
    });
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', {
      error: error.message,
      stack: error.stack,
      to,
      templateKey
    });
    return false;
  }
};

module.exports = { sendEmail };
