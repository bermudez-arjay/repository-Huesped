// routes/huesped.js
const express = require('express');
const router = express.Router();
const Huesped = require('../models/Huesped');

// Listar todos
router.get('/', async (req, res) => {
  try {
    const list = await Huesped.find().sort({ nombre: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener uno por id
router.get('/:id', async (req, res) => {
  try {
    const h = await Huesped.findById(req.params.id);
    if (!h) return res.status(404).json({ error: 'Huésped no encontrado' });
    res.json(h);
  } catch (err) {
    res.status(400).json({ error: 'Id inválido' });
  }
});

// Crear
router.post('/', async (req, res) => {
  try {
    const { dni, nombre, email} = req.body;
    if (!dni || !nombre || !email) return res.status(400).json({ error: 'dni y nombre son requeridos' });

    const exists = await Huesped.findOne({ dni });
    if (exists) return res.status(409).json({ error: 'DNI ya registrado' });

    const h = new Huesped({ dni, nombre, email});
    const saved = await h.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar
router.put('/:id', async (req, res) => {
  try {
    const updated = await Huesped.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Huésped no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Huesped.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Huésped no encontrado' });
    res.json({ message: 'Huésped eliminado' });
  } catch (err) {
    res.status(400).json({ error: 'Id inválido' });
  }
});

module.exports = router;

