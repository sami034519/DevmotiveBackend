import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Transporter setup (Hostinger SMTP, not Gmail)
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // Hostinger SMTP
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER, // e.g., info@yourdomain.com
        pass: process.env.EMAIL_PASS, // your email password
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.TO_EMAIL, // where you want to receive messages
      subject: `📩 Contact Form: ${subject}`,
      html: `
        <h2>📬 New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

export default router;
