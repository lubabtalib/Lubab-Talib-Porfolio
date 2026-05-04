/* ============================================
   Admin Dashboard — CRUD Operations
   ============================================ */

(function () {
  'use strict';

  const API = '';
  let currentTab = 'overview';

  // Wait for auth to load
  setTimeout(init, 100);

  function init() {
    if (!window.AdminAuth || !AdminAuth.getToken()) return;

    // Set username
    const usernameEl = document.getElementById('admin-username');
    if (usernameEl) usernameEl.textContent = AdminAuth.getUser() || 'admin';

    setupNavigation();
    setupMobileMenu();
    setupModal();
    setupPasswordForm();
    loadDashboard();

    // Poll for new messages every 30 seconds
    setInterval(checkNewMessages, 30000);
  }

  // ========== NAVIGATION ==========
  function setupNavigation() {
    document.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        switchTab(tab);
        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');
      });
    });
  }

  function switchTab(tab) {
    currentTab = tab;
    // Update sidebar active state
    document.querySelectorAll('.sidebar-link[data-tab]').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.sidebar-link[data-tab="${tab}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Show correct panel
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`tab-${tab}`);
    if (panel) panel.classList.add('active');

    // Load data for this tab
    loadTabData(tab);
  }

  function loadTabData(tab) {
    switch (tab) {
      case 'overview': loadStats(); loadRecentMessages(); break;
      case 'projects': loadProjects(); break;
      case 'skills': loadSkills(); break;
      case 'experience': loadExperience(); break;
      case 'content': loadContent(); break;
      case 'messages': loadMessages(); break;
    }
  }

  // ========== MOBILE MENU ==========
  function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (btn) {
      btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
  }

  // ========== API HELPER ==========
  async function api(endpoint, options = {}) {
    const res = await fetch(`${API}${endpoint}`, {
      ...options,
      headers: AdminAuth.authHeaders()
    });
    if (res.status === 401) {
      AdminAuth.logout();
      return null;
    }
    return res.json();
  }

  // ========== LOAD DASHBOARD ==========
  function loadDashboard() {
    loadStats();
    loadRecentMessages();
    setupAddButtons();
  }

  // ========== STATS ==========
  async function loadStats() {
    const data = await api('/api/admin/stats');
    if (!data) return;
    document.getElementById('stat-projects').textContent = data.totalProjects;
    document.getElementById('stat-skills').textContent = data.totalSkills;
    document.getElementById('stat-messages').textContent = data.totalMessages;
    document.getElementById('stat-unread').textContent = data.unreadMessages;

    // Update unread badge
    const badge = document.getElementById('unread-badge');
    if (data.unreadMessages > 0) {
      badge.style.display = 'inline';
      badge.textContent = data.unreadMessages;
      const mobileNotif = document.getElementById('mobile-notification');
      if (mobileNotif) mobileNotif.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }

  // ========== CHECK NEW MESSAGES ==========
  let lastMessageCount = 0;
  async function checkNewMessages() {
    const data = await api('/api/admin/stats');
    if (!data) return;
    if (lastMessageCount > 0 && data.totalMessages > lastMessageCount) {
      showToast(`New message received!`, 'info');
      // Update badge
      const badge = document.getElementById('unread-badge');
      badge.style.display = 'inline';
      badge.textContent = data.unreadMessages;
      document.getElementById('stat-unread').textContent = data.unreadMessages;
    }
    lastMessageCount = data.totalMessages;

    document.getElementById('stat-messages').textContent = data.totalMessages;
    document.getElementById('stat-unread').textContent = data.unreadMessages;
  }

  // ========== RECENT MESSAGES ==========
  async function loadRecentMessages() {
    const messages = await api('/api/admin/messages');
    if (!messages) return;
    lastMessageCount = messages.length;

    const tbody = document.getElementById('recent-messages-body');
    const recent = messages.slice(0, 5);
    if (recent.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No messages yet</td></tr>';
      return;
    }
    tbody.innerHTML = recent.map(m => `
      <tr>
        <td>${esc(m.name)}</td>
        <td>${esc(m.email)}</td>
        <td>${esc(m.message)}</td>
        <td>${formatDate(m.created_at)}</td>
        <td><span class="status-badge ${m.is_read ? 'read' : 'unread'}">${m.is_read ? 'Read' : 'Unread'}</span></td>
      </tr>
    `).join('');
  }

  // ========== PROJECTS ==========
  async function loadProjects() {
    const projects = await api('/api/admin/projects');
    if (!projects) return;
    const tbody = document.getElementById('projects-body');
    if (projects.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No projects yet</td></tr>';
      return;
    }
    tbody.innerHTML = projects.map(p => `
      <tr>
        <td><strong>${esc(p.title)}</strong></td>
        <td>${esc(p.technologies)}</td>
        <td>${p.sort_order}</td>
        <td class="actions">
          <button class="btn btn-secondary btn-sm" onclick="Dashboard.editProject(${p.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="Dashboard.deleteProject(${p.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  function showProjectModal(project = null) {
    const isEdit = !!project;
    openModal(isEdit ? 'Edit Project' : 'Add Project', `
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="m-project-title" value="${esc(project?.title || '')}" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="m-project-desc" rows="4">${esc(project?.description || '')}</textarea>
      </div>
      <div class="form-group">
        <label>Technologies (comma-separated)</label>
        <input type="text" id="m-project-tech" value="${esc(project?.technologies || '')}">
      </div>
      <div class="form-group">
        <label>Key Achievements (period-separated sentences)</label>
        <textarea id="m-project-achieve" rows="3">${esc(project?.achievements || '')}</textarea>
      </div>
      <div class="form-group">
        <label>Sort Order</label>
        <input type="number" id="m-project-order" value="${project?.sort_order || 0}">
      </div>
    `, async () => {
      const body = {
        title: document.getElementById('m-project-title').value,
        description: document.getElementById('m-project-desc').value,
        technologies: document.getElementById('m-project-tech').value,
        achievements: document.getElementById('m-project-achieve').value,
        sort_order: parseInt(document.getElementById('m-project-order').value) || 0
      };
      if (!body.title || !body.description || !body.technologies) {
        showToast('Title, description, and technologies are required', 'error');
        return;
      }
      if (isEdit) {
        await api(`/api/admin/projects/${project.id}`, { method: 'PUT', body: JSON.stringify(body) });
        showToast('Project updated', 'success');
      } else {
        await api('/api/admin/projects', { method: 'POST', body: JSON.stringify(body) });
        showToast('Project created', 'success');
      }
      closeModal();
      loadProjects();
      loadStats();
    });
  }

  // ========== SKILLS ==========
  async function loadSkills() {
    const skills = await api('/api/admin/skills');
    if (!skills) return;
    const tbody = document.getElementById('skills-body');
    if (skills.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No skills yet</td></tr>';
      return;
    }
    tbody.innerHTML = skills.map(s => `
      <tr>
        <td>${esc(s.name)}</td>
        <td>${esc(s.category)}</td>
        <td>${s.level}%</td>
        <td>${s.sort_order}</td>
        <td class="actions">
          <button class="btn btn-secondary btn-sm" onclick="Dashboard.editSkill(${s.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="Dashboard.deleteSkill(${s.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  function showSkillModal(skill = null) {
    const isEdit = !!skill;
    openModal(isEdit ? 'Edit Skill' : 'Add Skill', `
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="m-skill-name" value="${esc(skill?.name || '')}">
      </div>
      <div class="form-group">
        <label>Category</label>
        <select id="m-skill-category">
          <option value="Frontend" ${skill?.category === 'Frontend' ? 'selected' : ''}>Frontend</option>
          <option value="Backend" ${skill?.category === 'Backend' ? 'selected' : ''}>Backend</option>
          <option value="Tools" ${skill?.category === 'Tools' ? 'selected' : ''}>Tools</option>
          <option value="Other" ${skill?.category === 'Other' ? 'selected' : ''}>Other</option>
        </select>
      </div>
      <div class="form-group">
        <label>Level (1-100)</label>
        <input type="number" id="m-skill-level" value="${skill?.level || 80}" min="1" max="100">
      </div>
      <div class="form-group">
        <label>Sort Order</label>
        <input type="number" id="m-skill-order" value="${skill?.sort_order || 0}">
      </div>
    `, async () => {
      const body = {
        name: document.getElementById('m-skill-name').value,
        category: document.getElementById('m-skill-category').value,
        level: parseInt(document.getElementById('m-skill-level').value) || 80,
        sort_order: parseInt(document.getElementById('m-skill-order').value) || 0
      };
      if (!body.name) {
        showToast('Skill name is required', 'error');
        return;
      }
      if (isEdit) {
        await api(`/api/admin/skills/${skill.id}`, { method: 'PUT', body: JSON.stringify(body) });
        showToast('Skill updated', 'success');
      } else {
        await api('/api/admin/skills', { method: 'POST', body: JSON.stringify(body) });
        showToast('Skill created', 'success');
      }
      closeModal();
      loadSkills();
      loadStats();
    });
  }

  // ========== EXPERIENCE ==========
  async function loadExperience() {
    const exp = await api('/api/admin/experience');
    if (!exp) return;
    const tbody = document.getElementById('experience-body');
    if (exp.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No experience yet</td></tr>';
      return;
    }
    tbody.innerHTML = exp.map(e => `
      <tr>
        <td><strong>${esc(e.title)}</strong></td>
        <td>${esc(e.company)}</td>
        <td>${esc(e.period)}</td>
        <td>${e.sort_order}</td>
        <td class="actions">
          <button class="btn btn-secondary btn-sm" onclick="Dashboard.editExperience(${e.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="Dashboard.deleteExperience(${e.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  function showExperienceModal(exp = null) {
    const isEdit = !!exp;
    openModal(isEdit ? 'Edit Experience' : 'Add Experience', `
      <div class="form-group">
        <label>Job Title</label>
        <input type="text" id="m-exp-title" value="${esc(exp?.title || '')}">
      </div>
      <div class="form-group">
        <label>Company</label>
        <input type="text" id="m-exp-company" value="${esc(exp?.company || '')}">
      </div>
      <div class="form-group">
        <label>Period</label>
        <input type="text" id="m-exp-period" value="${esc(exp?.period || '')}" placeholder="e.g., 2022 — Present">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="m-exp-desc" rows="4">${esc(exp?.description || '')}</textarea>
      </div>
      <div class="form-group">
        <label>Sort Order</label>
        <input type="number" id="m-exp-order" value="${exp?.sort_order || 0}">
      </div>
    `, async () => {
      const body = {
        title: document.getElementById('m-exp-title').value,
        company: document.getElementById('m-exp-company').value,
        period: document.getElementById('m-exp-period').value,
        description: document.getElementById('m-exp-desc').value,
        sort_order: parseInt(document.getElementById('m-exp-order').value) || 0
      };
      if (!body.title || !body.company || !body.period || !body.description) {
        showToast('All fields are required', 'error');
        return;
      }
      if (isEdit) {
        await api(`/api/admin/experience/${exp.id}`, { method: 'PUT', body: JSON.stringify(body) });
        showToast('Experience updated', 'success');
      } else {
        await api('/api/admin/experience', { method: 'POST', body: JSON.stringify(body) });
        showToast('Experience created', 'success');
      }
      closeModal();
      loadExperience();
    });
  }

  // ========== CONTENT ==========
  async function loadContent() {
    const content = await api('/api/admin/content');
    if (!content) return;
    const container = document.getElementById('content-list');
    if (content.length === 0) {
      container.innerHTML = '<p class="empty-state">No content sections found</p>';
      return;
    }
    container.innerHTML = content.map(c => `
      <div class="content-item">
        <div class="content-item-header">
          <span class="content-item-key">${esc(c.section)}</span>
          <button class="btn btn-primary btn-sm" onclick="Dashboard.saveContent('${esc(c.section)}')">Save</button>
        </div>
        <textarea id="content-${c.section}" rows="${(c.value || '').split('\n').length + 1}">${esc(c.value)}</textarea>
      </div>
    `).join('');
  }

  // ========== MESSAGES ==========
  async function loadMessages() {
    const messages = await api('/api/admin/messages');
    if (!messages) return;
    const tbody = document.getElementById('messages-body');
    if (messages.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No messages yet</td></tr>';
      return;
    }
    tbody.innerHTML = messages.map(m => `
      <tr>
        <td>${esc(m.name)}</td>
        <td>${esc(m.email)}</td>
        <td title="${esc(m.message)}">${esc(m.message)}</td>
        <td>${formatDate(m.created_at)}</td>
        <td><span class="status-badge ${m.is_read ? 'read' : 'unread'}">${m.is_read ? 'Read' : 'Unread'}</span></td>
        <td class="actions">
          ${!m.is_read ? `<button class="btn btn-secondary btn-sm" onclick="Dashboard.markRead(${m.id})">Mark Read</button>` : ''}
          <button class="btn btn-danger btn-sm" onclick="Dashboard.deleteMessage(${m.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  // ========== ADD BUTTONS ==========
  function setupAddButtons() {
    document.getElementById('add-project-btn')?.addEventListener('click', () => showProjectModal());
    document.getElementById('add-skill-btn')?.addEventListener('click', () => showSkillModal());
    document.getElementById('add-experience-btn')?.addEventListener('click', () => showExperienceModal());
  }

  // ========== MODAL ==========
  let modalCallback = null;

  function setupModal() {
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
  }

  function openModal(title, bodyHtml, onSave) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-footer').innerHTML = `
      <button class="btn btn-secondary" onclick="Dashboard.closeModal()">Cancel</button>
      <button class="btn btn-primary" id="modal-save-btn">Save</button>
    `;
    modalCallback = onSave;
    document.getElementById('modal-save-btn').addEventListener('click', () => {
      if (modalCallback) modalCallback();
    });
    document.getElementById('modal-overlay').classList.add('open');
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    modalCallback = null;
  }

  // ========== PASSWORD ==========
  function setupPasswordForm() {
    const form = document.getElementById('password-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('password-status');
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirm = document.getElementById('confirm-password').value;

      if (newPassword !== confirm) {
        status.textContent = 'Passwords do not match';
        status.className = 'form-status error';
        return;
      }

      const data = await api('/api/admin/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (data?.success) {
        status.textContent = 'Password updated successfully!';
        status.className = 'form-status success';
        form.reset();
      } else {
        status.textContent = data?.error || 'Failed to update password';
        status.className = 'form-status error';
      }
    });
  }

  // ========== TOAST ==========
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ========== HELPERS ==========
  function esc(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  // ========== EXPOSE GLOBAL API ==========
  window.Dashboard = {
    closeModal,

    // Projects
    editProject: async (id) => {
      const projects = await api('/api/admin/projects');
      const p = projects?.find(x => x.id === id);
      if (p) showProjectModal(p);
    },
    deleteProject: async (id) => {
      if (!confirm('Delete this project?')) return;
      await api(`/api/admin/projects/${id}`, { method: 'DELETE' });
      showToast('Project deleted', 'success');
      loadProjects();
      loadStats();
    },

    // Skills
    editSkill: async (id) => {
      const skills = await api('/api/admin/skills');
      const s = skills?.find(x => x.id === id);
      if (s) showSkillModal(s);
    },
    deleteSkill: async (id) => {
      if (!confirm('Delete this skill?')) return;
      await api(`/api/admin/skills/${id}`, { method: 'DELETE' });
      showToast('Skill deleted', 'success');
      loadSkills();
      loadStats();
    },

    // Experience
    editExperience: async (id) => {
      const exp = await api('/api/admin/experience');
      const e = exp?.find(x => x.id === id);
      if (e) showExperienceModal(e);
    },
    deleteExperience: async (id) => {
      if (!confirm('Delete this experience entry?')) return;
      await api(`/api/admin/experience/${id}`, { method: 'DELETE' });
      showToast('Experience deleted', 'success');
      loadExperience();
    },

    // Content
    saveContent: async (section) => {
      const textarea = document.getElementById(`content-${section}`);
      if (!textarea) return;
      await api(`/api/admin/content/${section}`, {
        method: 'PUT',
        body: JSON.stringify({ value: textarea.value })
      });
      showToast(`"${section}" updated`, 'success');
    },

    // Messages
    markRead: async (id) => {
      await api(`/api/admin/messages/${id}/read`, { method: 'PATCH' });
      showToast('Message marked as read', 'success');
      loadMessages();
      loadStats();
    },
    deleteMessage: async (id) => {
      if (!confirm('Delete this message?')) return;
      await api(`/api/admin/messages/${id}`, { method: 'DELETE' });
      showToast('Message deleted', 'success');
      loadMessages();
      loadStats();
    }
  };

})();
