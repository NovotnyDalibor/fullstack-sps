const express = require('express');
const db = require('../database/db');

const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM subjects', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM subjects WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Záznam nenalezen' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Jmeno predmetu je povinné.' });

  db.run('INSERT INTO subjects (name) VALUES (?)', [name], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name });
  });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: 'Jmeno predmetu je povinne.' });

  db.run('UPDATE subjects SET name = ? WHERE id = ?', [name, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Zaznam nenalezen' });
    res.json({ updated: this.changes });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM subjects WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Zaznam nenalezen' });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;