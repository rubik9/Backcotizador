const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
   // --- CORS manual ---
  const allowedOrigins = [
    'http://localhost:3000',
    'https://cotizador-albapesa.vercel.app'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  const { id, token } = req.query;
  const expectedToken = Buffer.from(`${id}-mi-clave`).toString('base64');

  if (token !== expectedToken) {
    console.log(`❌ Intento de aprobar cotización ${id} con token inválido`);
    return res.status(400).send('<h1>❌ Token inválido</h1>');
  }

  // Aquí podrías actualizar la base de datos → estado = Aprobada
  console.log(`✅ Cotización ${id} aprobada por revisor`);

  res.send(`
    <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
      <h1 style="color: green;">✅ Cotización ${id} aprobada.</h1>
      <p>Gracias por su revisión.</p>
    </div>
  `);
});

module.exports = router;
