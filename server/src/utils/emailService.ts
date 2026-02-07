import nodemailer from 'nodemailer'

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use 'hotmail', 'yahoo', or SMTP settings
  auth: {
    user: process.env.EMAIL_USER, // ⚠️ REPLACE WITH YOUR EMAIL
    pass: process.env.EMAIL_PASS, // ⚠️ REPLACE WITH YOUR APP PASSWORD
  },
})

export const sendStatusEmail = async (
  toEmail: string,
  status: string,
  jobTitle: string,
  candidateName: string,
) => {
  const subject =
    status === 'SELECTED'
      ? '🎉 Congratulations! You are Shortlisted'
      : 'Update on your Application'

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2563eb;">PIMS Application Update</h2>
      <p>Hi <strong>${candidateName}</strong>,</p>
      <p>Your application status for the position of <strong>${jobTitle}</strong> has been updated.</p>
      
      <div style="padding: 15px; background-color: #f3f4f6; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px;">New Status: <strong style="color: ${status === 'SELECTED' ? '#16a34a' : '#dc2626'};">${status}</strong></p>
      </div>

      <p>Please login to your dashboard to view more details or accept the offer.</p>
      <br/>
      <p>Best Regards,<br/>PIMS Placement Cell</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: '"PIMS Notification" <no-reply@pims.com>',
      to: toEmail,
      subject: subject,
      html: htmlContent,
    })
    console.log(`✅ Email sent successfully to ${toEmail}`)
  } catch (error) {
    console.error('❌ Email failed to send:', error)
  }
}
