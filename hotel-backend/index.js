// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB conectado'))
  .catch(err => { console.error('MongoDB error', err); process.exit(1); });

// Rutas
const huespedRoutes = require('./routes/huesped');
app.use('/api/huespedes', huespedRoutes);

// Health
app.get('/', (_, res) => res.send('API Hotel - Huéspedes'));

// Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server en puerto ${PORT}`));

