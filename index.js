require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // o tu dominio de React en producción
}));
app.use(bodyParser.json({ limit: '10mb' })); // o 20mb si tu PDF es más grande


// Rutas
app.use('/api/create-cotizacion', require('./api/create-cotizacion'));
app.use('/api/approve', require('./api/approve'));
app.use('/api/reject', require('./api/reject'));

app.listen(port, () => {
  console.log(`Servidor backend corriendo en puerto ${port}`);
});
