// models/Huesped.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HuespedSchema = new Schema({
  dni: { type: String, required: true, unique: true, trim: true },
  nombre: { type: String, required: true, trim: true },
  email: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Huesped', HuespedSchema);
