// import nodemailer from 'nodemailer';

// export default async function sendEmail({ to, subject, text, html }) {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_FROM,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     await transporter.sendMail({
//       from: `"FarmMate Support" <${process.env.EMAIL_FROM}>`,
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log("📩 Email sent successfully");
//   } catch (err) {
//     console.error("Email send error:", err);
//     throw new Error("Failed to send email");
//   }
// }
