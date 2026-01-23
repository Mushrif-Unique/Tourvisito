import nodemailer from "nodemailer";

let transporter = null;

// Create transporter lazily (after env is loaded)
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // Mailtrap & most SMTP use false
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
};

// Email template for booking confirmation
const bookingConfirmationTemplate = (booking) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Booking Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hi ${booking.contactName},</p>
      <p>Your booking for <strong>${booking.trip.title}</strong> is confirmed.</p>
      <p><strong>Total:</strong> $${booking.totalAmount}</p>
      <p>Booking ID: ${booking._id}</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Send booking confirmation
export const sendBookingConfirmation = async (booking) => {
  const mailOptions = {
    from: `"Travel App" <${process.env.EMAIL_USER}>`,
    to: booking.contactEmail,
    subject: `Booking Confirmed - ${booking.trip.title}`,
    html: bookingConfirmationTemplate(booking),
  };

  return await getTransporter().sendMail(mailOptions);
};

// Send cancellation email
export const sendCancellationEmail = async (booking) => {
  const mailOptions = {
    from: `"Travel App" <${process.env.EMAIL_USER}>`,
    to: booking.contactEmail,
    subject: `Booking Cancelled - ${booking.trip.title}`,
    html: `<p>Your booking has been cancelled.</p>`,
  };

  return await getTransporter().sendMail(mailOptions);
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    await getTransporter().verify();
    console.log("✅ Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("❌ Email configuration error:", error);
    return false;
  }
};
