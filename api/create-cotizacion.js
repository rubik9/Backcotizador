import { Resend } from 'resend';
import { allowCors } from '../cors';

const resend = new Resend(process.env.RESEND_API_KEY);

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { cotizacionId, pdfBase64, revisoresEmails } = req.body;

  const token = Buffer.from(`${cotizacionId}-mi-clave`).toString('base64');

  const approveLink = `https://backcotizador.vercel.app/api/approve?id=${cotizacionId}&token=${token}`;
  const rejectLink = `https://backcotizador.vercel.app/api/reject?id=${cotizacionId}&token=${token}`;

  try {
    await resend.emails.send({
      from: 'Cotizaciones <onboarding@resend.dev>',
      to: revisoresEmails,
      subject: `Cotización #${cotizacionId} pendiente de aprobación`,
      html: `
        <p>Revisa la cotización:</p>
        <a href="${approveLink}">✅ Aprobar</a> |
        <a href="${rejectLink}">❌ Rechazar</a>
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

export default allowCors(handler);
