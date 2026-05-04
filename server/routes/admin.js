const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { queryAll, queryOne, queryCount, runStmt } = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// ========== DASHBOARD STATS ==========
router.get('/stats', async (req, res) => {
  try {
    const totalProjects = await queryCount('SELECT COUNT(*) as count FROM projects');
    const totalMessages = await queryCount('SELECT COUNT(*) as count FROM messages');
    const unreadMessages = await queryCount('SELECT COUNT(*) as count FROM messages WHERE is_read = 0');
    const totalSkills = await queryCount('SELECT COUNT(*) as count FROM skills');
    res.json({ totalProjects, totalMessages, unreadMessages, totalSkills });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ========== CONTENT MANAGEMENT ==========
router.get('/content', async (req, res) => {
  try {
    const rows = await queryAll('SELECT * FROM content ORDER BY section ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.put('/content/:section', async (req, res) => {
  try {
    const { value } = req.body;
    const { section } = req.params;
    await runStmt('UPDATE content SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE section = ?', [value, section]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// ========== PROJECTS CRUD ==========
router.get('/projects', async (req, res) => {
  try {
    const projects = await queryAll('SELECT * FROM projects ORDER BY sort_order ASC');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const { title, description, technologies, achievements, image_url, sort_order } = req.body;
    if (!title || !description || !technologies) {
      return res.status(400).json({ error: 'Title, description, and technologies are required' });
    }
    const result = await runStmt(
      'INSERT INTO projects (title, description, technologies, achievements, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, technologies, achievements || '', image_url || '', sort_order || 0]
    );
    res.json({ success: true, id: result.lastId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const { title, description, technologies, achievements, image_url, sort_order } = req.body;
    await runStmt(
      'UPDATE projects SET title=?, description=?, technologies=?, achievements=?, image_url=?, sort_order=? WHERE id=?',
      [title, description, technologies, achievements || '', image_url || '', sort_order || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    await runStmt('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ========== SKILLS CRUD ==========
router.get('/skills', async (req, res) => {
  try {
    const skills = await queryAll('SELECT * FROM skills ORDER BY sort_order ASC');
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

router.post('/skills', async (req, res) => {
  try {
    const { category, name, level, sort_order } = req.body;
    if (!category || !name) {
      return res.status(400).json({ error: 'Category and name are required' });
    }
    const result = await runStmt(
      'INSERT INTO skills (category, name, level, sort_order) VALUES (?, ?, ?, ?)',
      [category, name, level || 80, sort_order || 0]
    );
    res.json({ success: true, id: result.lastId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

router.put('/skills/:id', async (req, res) => {
  try {
    const { category, name, level, sort_order } = req.body;
    await runStmt(
      'UPDATE skills SET category=?, name=?, level=?, sort_order=? WHERE id=?',
      [category, name, level || 80, sort_order || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

router.delete('/skills/:id', async (req, res) => {
  try {
    await runStmt('DELETE FROM skills WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// ========== EXPERIENCE CRUD ==========
router.get('/experience', async (req, res) => {
  try {
    const experience = await queryAll('SELECT * FROM experience ORDER BY sort_order ASC');
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

router.post('/experience', async (req, res) => {
  try {
    const { title, company, period, description, sort_order } = req.body;
    if (!title || !company || !period || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const result = await runStmt(
      'INSERT INTO experience (title, company, period, description, sort_order) VALUES (?, ?, ?, ?, ?)',
      [title, company, period, description, sort_order || 0]
    );
    res.json({ success: true, id: result.lastId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

router.put('/experience/:id', async (req, res) => {
  try {
    const { title, company, period, description, sort_order } = req.body;
    await runStmt(
      'UPDATE experience SET title=?, company=?, period=?, description=?, sort_order=? WHERE id=?',
      [title, company, period, description, sort_order || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/experience/:id', async (req, res) => {
  try {
    await runStmt('DELETE FROM experience WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// ========== MESSAGES ==========
router.get('/messages', async (req, res) => {
  try {
    const messages = await queryAll('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.patch('/messages/:id/read', async (req, res) => {
  try {
    await runStmt('UPDATE messages SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    await runStmt('DELETE FROM messages WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ========== PASSWORD CHANGE ==========
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await queryOne('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const valid = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hash = bcrypt.hashSync(newPassword, 10);
    await runStmt('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

module.exports = router;
