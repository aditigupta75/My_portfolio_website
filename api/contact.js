// Vercel Serverless Function — POST /api/contact
// Receives { name, email, message } from the portfolio's contact form
// and forwards it as an email using the Resend API (https://resend.com).
//
// SETUP REQUIRED before this works:
//   1. Create a free Resend account and verify a sending domain (or use
//      their onboarding@resend.dev sender for testing).
//   2. In your Vercel project settings → Environment Variables, add:
//        RESEND_API_KEY   = re_xxxxxxxxxxxx
//        CONTACT_TO_EMAIL = ag0484363@gmail.com
//   3. Redeploy. Until RESEND_API_KEY is set, this function will return
//      a 500 error — the frontend already handles that gracefully by
//      telling the visitor to email you directly instead.
//
// Swap-out note: any transactional email provider works the same way
// (SendGrid, Postmark, Mailgun, AWS SES) — just change the fetch call
// below to that provider's send-email endpoint.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, company } = req.body || {};

  // Honeypot: if this hidden field is filled, it's almost certainly a bot.
  if (company) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: 'Input too long' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    console.error('Missing RESEND_API_KEY or CONTACT_TO_EMAIL env vars');
    return res.status(500).json({ error: 'Contact form is not configured yet' });
  }

  try {
    const escapeHtml = (str) =>
      str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact Form <onboarding@resend.dev>',
        to: [toEmail],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        html: `
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('Resend API error:', errText);
      return res.status(502).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
