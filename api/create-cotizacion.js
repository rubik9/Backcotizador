const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  const { cotizacionId, pdfBase64, revisoresEmails } = req.body;

  // // Asegurarse que Resend recibe un array
  // console.log('Recibido en backend:', req.body);

const to = Array.isArray(revisoresEmails) ? revisoresEmails : [revisoresEmails];
console.log('Correos que se mandan a Resend:', to);

  const token = Buffer.from(`${cotizacionId}-mi-clave`).toString('base64');

  const approveLink = `${process.env.BACKEND_URL}/api/approve?id=${cotizacionId}&token=${token}`;
  const rejectLink = `${process.env.BACKEND_URL}/api/reject?id=${cotizacionId}&token=${token}`;

  try {
    await resend.emails.send({
      from: 'cotizaciones@albapesa.com.mx',
      to: revisoresEmails, // siempre array
      subject: `Cotización #${cotizacionId} pendiente de aprobación`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">Cotización #${cotizacionId}</h2>
          <p>Por favor revise la cotización y seleccione una acción:</p>
          <div style="margin: 20px 0;">
            <a href="${approveLink}" style="display: inline-block; padding: 12px 20px; color: white; background-color: green; text-decoration: none; border-radius: 5px;">✅ Aprobar Cotización</a>
          </div>
          <div style="margin: 10px 0;">
            <a href="${rejectLink}" style="display: inline-block; padding: 12px 20px; color: white; background-color: red; text-decoration: none; border-radius: 5px;">❌ Rechazar Cotización</a>
          </div>
          <p style="color: #888; font-size: 12px;">Este es un correo automático. No responda a este correo.</p>
        </div>
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

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
