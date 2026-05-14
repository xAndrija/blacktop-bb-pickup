import Mailjet from 'node-mailjet'

interface JoinNotificationParams {
  recipientEmails: string[]
  joinerName: string
  courtName: string
  courtLocation: string
  dateTime: string
  currentCount: number
  maxPlayers: number
}

export async function sendJoinNotification(params: JoinNotificationParams) {
  if (!params.recipientEmails.length) return
  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) return

  const mj = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_SECRET_KEY,
  })

  const date = new Date(params.dateTime)
  const timeStr = date.toLocaleTimeString('sr-Latn-RS', { hour: '2-digit', minute: '2-digit' })
  const dateStr = date.toLocaleDateString('sr-Latn-RS', { weekday: 'long', day: 'numeric', month: 'long' })

  await mj.post('send', { version: 'v3.1' }).request({
    Messages: params.recipientEmails.map(email => ({
      From: {
        Email: process.env.MAILJET_FROM_EMAIL ?? 'danube.works.sr@gmail.com',
        Name: 'BLKTOP',
      },
      To: [{ Email: email }],
      Subject: `${params.joinerName} se pridružio igri 🏀`,
      HTMLPart: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#08080f;color:#f0f0f5;border-radius:16px">
          <h2 style="color:#fb923c;margin:0 0 16px">🏀 BLKTOP</h2>
          <p style="font-size:16px;margin:0 0 20px">
            <strong style="color:white">${params.joinerName}</strong> se pridružio vašoj igri.
          </p>
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:12px;padding:16px;margin-bottom:20px">
            <p style="margin:0 0 4px;color:#fb923c;font-weight:700;font-size:15px">${params.courtName}</p>
            <p style="margin:0 0 10px;color:rgba(255,255,255,0.4);font-size:13px">${params.courtLocation}</p>
            <p style="margin:0 0 4px;font-size:14px;color:#f0f0f5">${dateStr} u <strong>${timeStr}</strong></p>
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.35)">${params.currentCount}/${params.maxPlayers} igrača</p>
          </div>
          <a href="https://blktop.it.com/games"
             style="display:inline-block;background:linear-gradient(135deg,#f97316,#f59e0b);color:white;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px">
            Vidi igru →
          </a>
          <p style="margin-top:28px;font-size:11px;color:rgba(255,255,255,0.18)">BLKTOP · pickup košarka Beograd</p>
        </div>
      `,
      TextPart: `${params.joinerName} se pridružio igri na ${params.courtName} (${params.courtLocation}) — ${dateStr} u ${timeStr}. Trenutno ${params.currentCount}/${params.maxPlayers} igrača.`,
    })),
  })
}
