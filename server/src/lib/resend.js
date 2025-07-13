import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @returns {Promise<object>} - Resend API response
 */
export async function sendEmail({ to, subject, html }) {
  try {
    const data = await resend.emails.send({
      from: "Janardan <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error("Error sending email with Resend:", error);
    throw error;
  }
}

export default resend;
