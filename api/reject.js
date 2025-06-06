import { allowCors } from '../cors';

async function handler(req, res) {
  const { id, token } = req.query;
  const expectedToken = Buffer.from(`${id}-mi-clave`).toString('base64');

  if (token !== expectedToken) {
    return res.status(400).send('<h1>❌ Token inválido.</h1>');
  }

  // Aquí actualizarías la cotización en DB (pendiente → rechazada)

  res.send('<h1>❌ Cotización rechazada.</h1>');
}

export default allowCors(handler);
