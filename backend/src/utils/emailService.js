import nodemailer from "nodemailer";

let transporter;

const ensureTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = String(process.env.SMTP_SECURE).toLowerCase() === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error("SMTP is not configured");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  return transporter;
};

export const sendMail = async ({ to, subject, html }) => {
  const activeTransporter = ensureTransporter();

  const from = process.env.SMTP_FROM || process.env.FROM_EMAIL || process.env.SMTP_USER;
  const mailOptions = {
    from,
    to,
    subject,
    html,
  };

  await activeTransporter.sendMail(mailOptions);
};

export default sendMail;
