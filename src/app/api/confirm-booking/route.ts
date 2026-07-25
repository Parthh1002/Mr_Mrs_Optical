import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const bookingDetails = await req.json();
    const { name, email, date, time, referenceId } = bookingDetails;

    if (!name || !email || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const API_KEY = process.env.BREVO_API_KEY;
    const SENDER_EMAIL = process.env.SENDER_EMAIL || 'info@mrandmrsoptical.com';

    if (!API_KEY) {
      return NextResponse.json({ error: 'Brevo API key not configured' }, { status: 500 });
    }

    // Professional HTML Template for Customer Confirmation
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fcfbf8; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #133524; padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-family: Georgia, serif; letter-spacing: 2px;">Mr. & Mrs. Optical</h1>
          <p style="color: #e8efea; margin-top: 10px; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Premium Eyewear Boutique</p>
        </div>
        
        <div style="padding: 40px;">
          <h2 style="color: #133524; font-size: 22px; margin-bottom: 20px; font-family: Georgia, serif;">Appointment Confirmed!</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Dear <strong>${name}</strong>,<br><br>
            Your eye-test appointment has been successfully confirmed. We look forward to welcoming you to our boutique. Please find your appointment voucher details below.
          </p>
          
          <!-- Voucher Card -->
          <div style="background-color: #ffffff; border: 2px dashed #c45c43; border-radius: 12px; padding: 25px; margin-bottom: 30px; position: relative;">
            <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background-color: #c45c43; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
              Booking Voucher
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px; width: 40%;">Reference ID</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: bold; font-size: 16px;">${referenceId || '#BKG-101'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Date</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #133524; font-weight: bold; font-size: 16px;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Time</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #133524; font-weight: bold; font-size: 16px;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Location</td>
                <td style="padding: 10px 0; color: #111827; font-weight: bold; font-size: 14px;">Dahegam Main Branch<br><span style="font-weight: normal; font-size: 12px; color: #6b7280;">G-14, Dev Complex, Dahegam, Gujarat 382305</span></td>
              </tr>
            </table>
          </div>

          <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin-bottom: 30px;">
            <strong>Preparation Tips:</strong><br>
            • Please arrive 5 minutes prior to your scheduled time.<br>
            • If you wear contact lenses, please bring your lens case and glasses.<br>
            • Bring any previous prescriptions if available.
          </p>
          
          <div style="text-align: center;">
            <p style="color: #9ca3af; font-size: 12px;">This email serves as your official confirmation voucher. You can show this at the front desk upon arrival.</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #111827; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Mr. & Mrs. Optical. All rights reserved.</p>
          <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">Need help? Call us at +91 98765 43210</p>
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
        sender: { name: 'Mr & Mrs Optical', email: SENDER_EMAIL },
        to: [{ email: email }],
        subject: `Appointment Confirmed - Mr & Mrs Optical`,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo user confirm error:', errorData);
      return NextResponse.json({ error: 'Failed to notify user' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Confirm Booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
