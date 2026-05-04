const express = require('express');
const router = express.Router();
const { queryAll, queryOne, runStmt } = require('../db');

// GET all content sections
router.get('/content', async (req, res) => {
  try {
    const rows = await queryAll('SELECT section, value FROM content');
    const content = {};
    rows.forEach(r => { content[r.section] = r.value; });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// GET all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await queryAll('SELECT * FROM projects ORDER BY sort_order ASC');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET all skills
router.get('/skills', async (req, res) => {
  try {
    const skills = await queryAll('SELECT * FROM skills ORDER BY sort_order ASC');
    const grouped = {};
    skills.forEach(s => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// GET all experience
router.get('/experience', async (req, res) => {
  try {
    const experience = await queryAll('SELECT * FROM experience ORDER BY sort_order ASC');
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// POST contact message
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    await runStmt('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
