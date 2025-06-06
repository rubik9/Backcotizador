import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { cotizacionId, pdfBase64, revisoresEmails } = req.body;

  const token = Buffer.from(`${cotizacionId}-mi-clave-secreta`).toString('base64');

  const approveLink = `https://your-vercel-app.vercel.app/api/approve?id=${cotizacionId}&token=${token}`;
  const rejectLink = `https://your-vercel-app.vercel.app/api/reject?id=${cotizacionId}&token=${token}`;

  try {
    await resend.emails.send({
      from: 'Cotizaciones <cotizaciones@yourdomain.com>',
      to: revisoresEmails,
      subject: `Revisión de Cotización #${cotizacionId}`,
      html: `
        <p>Se ha generado una nueva cotización. Puedes verla y aprobarla o rechazarla:</p>
        <p><a href="${approveLink}" style="padding:10px; background-color:green; color:white; text-decoration:none;">✅ Aprobar</a></p>
        <p><a href="${rejectLink}" style="padding:10px; background-color:red; color:white; text-decoration:none;">❌ Rechazar</a></p>
      `,
      attachments: [
        {
          content: pdfBase64,
          filename: `cotizacion-${cotizacionId}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
