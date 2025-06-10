const express = require('express');
const db = require('../database/db');
const router = express.Router();

// Get all subjects
router.get('/', (req, res) => {
  db.all('SELECT * FROM subjects', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get subject by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM subjects WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Předmět nenalezen' });
    res.json(row);
  });
});

// Create new subject
router.post('/', (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) return res.status(400).json({ error: 'Název a kód jsou povinné' });

  db.run('INSERT INTO subjects (name, code) VALUES (?, ?)', [name, code], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, code });
  });
});

// Update subject
router.put('/:id', (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) return res.status(400).json({ error: 'Název a kód jsou povinné' });

  db.run('UPDATE subjects SET name = ?, code = ? WHERE id = ?', [name, code, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Předmět nenalezen' });
    res.json({ updated: this.changes });
  });
});

// Delete subject
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM subjects WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Předmět nenalezen' });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
