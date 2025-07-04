import { Context } from 'hono'

// Replace with your Resend API Key (store in env for production)
const RESEND_API_KEY = 're_hq79DdKz_JDTajoqXJZkV5MugV15BsavC'

// Default sender identity from Resend verified domain
const FROM = 'Acme <onboarding@resend.dev>'

// Optional default audienceId (you can override it via body if needed)
const DEFAULT_AUDIENCE_ID = '78261eea-8f8b-4381-83c6-79fa7120f1cf'

export const mail_server_2 = async (c: Context) => {
  try {
    const body = await c.req.json()
    const {
      subject,
      html,
      audienceId = DEFAULT_AUDIENCE_ID,
      from = FROM
    } = body

    if (!subject || !html || !audienceId) {
      return c.json(
        {
          success: false,
          error: 'Missing required fields: subject, html, or audienceId'
        },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.resend.com/emails/broadcasts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audience_id: audienceId,
        from,
        subject,
        html
      })
    })

    const result = await response.json()

    if (!response.ok) {
      return c.json({ success: false, error: result })
    }

    return c.json({ success: true, result }, { status: 200 })
  } catch (err: any) {
    return c.json({ success: false, error: err.toString() }, { status: 500 })
  }
}
