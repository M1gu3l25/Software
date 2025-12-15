const nodemailer = require("nodemailer");

function createTransporter() {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: String(process.env.MAIL_SECURE) === "true", // false para 587
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // 🔑 clave para Office365
    },
  });

  return transporter;
}

module.exports = { createTransporter };
