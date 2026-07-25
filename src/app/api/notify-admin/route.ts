import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const bookingDetails = await req.json();
    const { name, phone, email, date, time } = bookingDetails;

    if (!name || !phone || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const API_KEY = process.env.BREVO_API_KEY;
    const SENDER_EMAIL = process.env.SENDER_EMAIL || 'info@mrandmrsoptical.com';
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'nijant24@gmail.com'; // Defaulting to the account owner

    if (!API_KEY) {
      return NextResponse.json({ error: 'Brevo API key not configured' }, { status: 500 });
    }

    // Professional HTML Template for Admin Notification
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px;">
        <h1 style="color: #064e3b; font-size: 24px; margin-bottom: 24px; font-family: Georgia, serif; text-align: center; border-bottom: 2px solid #064e3b; padding-bottom: 16px;">New Appointment Request</h1>
        
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 24px;">You have received a new eye-test appointment request from your website.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151; width: 30%;">Name</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${email || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Date</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Time</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: bold;">${time}</td>
          </tr>
        </table>

        <div style="text-align: center;">
          <a href="http://localhost:3000/admin/bookings" style="background-color: #064e3b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View in Dashboard</a>
        </div>
      </div>
    `;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Mr & Mrs Optical Website', email: SENDER_EMAIL },
        to: [{ email: ADMIN_EMAIL }],
        subject: `New Appointment: ${name} on ${date}`,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo admin notify error:', errorData);
      return NextResponse.json({ error: 'Failed to notify admin' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notify Admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
