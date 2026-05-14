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
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#222">
          <p style="margin:0 0 12px;font-size:15px"><strong>${params.joinerName}</strong> se pridružio tvojoj igri 🏀</p>
          <p style="margin:0 0 4px;font-size:14px;color:#444"><strong>${params.courtName}</strong> — ${params.courtLocation}</p>
          <p style="margin:0 0 4px;font-size:14px;color:#444">${dateStr} u ${timeStr}</p>
          <p style="margin:0 0 16px;font-size:14px;color:#444">${params.currentCount}/${params.maxPlayers} igrača</p>
          <p style="margin:0 0 24px;font-size:14px"><a href="https://blktop.it.com/games" style="color:#f97316">Vidi igru →</a></p>
          <p style="margin:0;font-size:12px;color:#999">BLKTOP · pickup košarka Beograd</p>
        </div>
      `,
      TextPart: `${params.joinerName} se pridružio igri na ${params.courtName} (${params.courtLocation}) — ${dateStr} u ${timeStr}. Trenutno ${params.currentCount}/${params.maxPlayers} igrača.`,
    })),
  })
}
