/* ============================================
   Admin Auth — Login & Session Management
   ============================================ */

(function () {
  'use strict';

  const TOKEN_KEY = 'lubab_admin_token';
  const API = '';

  // Check if on login page
  const isLoginPage = document.getElementById('login-form');
  const isDashboard = document.getElementById('sidebar');

  // ===== Login Page Logic =====
  if (isLoginPage) {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      verifyToken(token).then(valid => {
        if (valid) window.location.href = '/admin/dashboard.html';
      });
    }

    isLoginPage.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorEl = document.getElementById('login-error');
      const btn = document.getElementById('login-btn');
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (!username || !password) {
        errorEl.textContent = 'Please fill in all fields.';
        return;
      }

      btn.disabled = true;
      btn.querySelector('span').textContent = 'Signing in...';
      errorEl.textContent = '';

      try {
        const res = await fetch(`${API}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (res.ok && data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem('lubab_admin_user', data.username);
          window.location.href = '/admin/dashboard.html';
        } else {
          errorEl.textContent = data.error || 'Invalid credentials';
        }
      } catch (err) {
        errorEl.textContent = 'Connection error. Please try again.';
      } finally {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Sign In';
      }
    });
  }

  // ===== Dashboard Auth Guard =====
  if (isDashboard) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      window.location.href = '/admin/';
    } else {
      verifyToken(token).then(valid => {
        if (!valid) {
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = '/admin/';
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('lubab_admin_user');
        window.location.href = '/admin/';
      });
    }
  }

  async function verifyToken(token) {
    try {
      const res = await fetch(`${API}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      return data.valid === true;
    } catch {
      return false;
    }
  }

  // Expose helpers globally
  window.AdminAuth = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    getUser: () => localStorage.getItem('lubab_admin_user'),
    authHeaders: () => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
    }),
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('lubab_admin_user');
      window.location.href = '/admin/';
    }
  };
})();
