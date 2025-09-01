// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Huesped = require('./models/Huesped');

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  await Huesped.deleteMany({});
  await Huesped.insertMany([
    { dni: 'H001', nombre: 'María López', email: 'maria@mail.com'},
    { dni: 'H002', nombre: 'Carlos Medina', email: 'carlos@mail.com'}
  ]);
  console.log('Seed completado');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
