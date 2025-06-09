const express = require('express');
const db = require('../database/db');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Vítejte v API');
});

router.get('/seating_plans', (req, res) => {
  db.all('SELECT * FROM seating_plans', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/seating_plans', (req, res) => {
  const { firstname, lastname, subject_id, place_id } = req.body;
  if (!firstname || !lastname || !subject_id || !place_id) {
    return res.status(400).json({ error: 'Chybí některé povinné údaje.' });
  }
  const sql = `
    INSERT INTO seating_plans (firstname, lastname, subject_id, place_id)
    VALUES (?, ?, ?, ?)
  `;
  db.run(sql, [firstname, lastname, subject_id, place_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      id: this.lastID,
      firstname,
      lastname,
      subject_id,
      place_id
    });
  });
});

router.get('/seating_plans/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM seating_plans WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Záznam nenalezen' });
    res.json(row);
  });
});

router.put('/seating_plans/:id', (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, subject_id, place_id } = req.body;

  if (!firstname || !lastname || !subject_id || !place_id) {
    return res.status(400).json({ error: 'Chybí některé povinné údaje.' });
  }

  const sql = `
    UPDATE seating_plans
    SET firstname = ?, lastname = ?, subject_id = ?, place_id = ?
    WHERE id = ?
  `;

  db.run(sql, [firstname, lastname, subject_id, place_id, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Záznam nenalezen' });
    res.json({ updated: this.changes });
  });
});


router.delete('/seating_plans/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM seating_plans WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Záznam nenalezen' });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;