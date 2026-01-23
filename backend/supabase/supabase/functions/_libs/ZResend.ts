export class ZResend {

  constructor() { }

  public async sendEmail(email: string, subject: string, html: string) {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization header is critical
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Onboarding <hello@blog.gentleroad.com>',
        to: [email],
        subject: subject,
        html: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // 4xx or 5xx status code (e.g., 401 Unauthorized, 403 Forbidden, 422 Unprocessable Entity)
      console.error(`Resend API Error (Status ${res.status}):`, data);
      return { success: false, error: data };
    }

    // Successful response (should have a 'id' property)
    console.log("Resend Success:", data);
    return { success: true, data: data };
  }

}