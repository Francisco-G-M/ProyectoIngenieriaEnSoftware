const express = require('express');
const cors = require('cors');
const path = require('path');
const PrestamoController = require('./src/controllers/PrestamoController');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/public')));

app.post('/api/prestamos', PrestamoController.crearSolicitud);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});