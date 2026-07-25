import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const API_KEY = process.env.BREVO_API_KEY;
    const SENDER_EMAIL = process.env.SENDER_EMAIL || 'info@mrandmrsoptical.com';

    if (!API_KEY) {
      return NextResponse.json({ error: 'Brevo API key not configured' }, { status: 500 });
    }

    // Professional HTML Template for OTP
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; text-align: center;">
        <h1 style="color: #064e3b; font-size: 28px; margin-bottom: 24px; font-family: Georgia, serif;">Mr & Mrs Optical</h1>
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 32px; line-height: 1.5;">Please use the following verification code to access your account. Do not share this code with anyone.</p>
        <div style="background-color: #f3f7f4; padding: 24px; border-radius: 12px; display: inline-block; margin-bottom: 32px; border: 1px solid #d1fae5;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #064e3b;">${otp}</span>
        </div>
        <p style="color: #9ca3af; font-size: 14px;">This code will expire in 10 minutes.<br/>If you did not request this code, please ignore this email.</p>
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
        sender: { name: 'Mr & Mrs Optical', email: SENDER_EMAIL },
        to: [{ email: email }],
        subject: 'Your Login Code - Mr & Mrs Optical',
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo error:', errorData);
      return NextResponse.json({ error: 'Failed to send email' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
