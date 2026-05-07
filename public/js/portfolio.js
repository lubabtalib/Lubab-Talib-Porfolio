/* ============================================
   LUBAB PORTFOLIO — Main JavaScript
   Bilingual (EN/AR), Theme Toggle, Tag Skills
   ============================================ */

(function () {
  'use strict';

  const API = '';
  let currentLang = localStorage.getItem('lubab_lang') || 'en';
  let currentTheme = localStorage.getItem('lubab_theme') || 'dark';
  let portfolioData = {};

  // ========== Translations (static UI text) ==========
  const i18n = {
    en: {
      nav_about: 'About',
      nav_skills: 'Skills',
      nav_content: 'Content',
      nav_projects: 'Websites',
      nav_experience: 'Experience',
      nav_contact: 'Contact',
      nav_home: 'Home',
      hero_badge: 'Available for Projects',
      hero_cta_view: 'View My Work',
      hero_cta_contact: 'Get In Touch',
      hero_cta_cv: 'View / Download CV',
      stat_projects: 'Projects Delivered',
      stat_years: 'Years Experience',
      stat_orgs: 'Organizations Served',
      scroll: 'Scroll',
      tag_about: '01 — Who I Am',
      tag_skills: '02 — What I Know',
      tag_content: '03 — Content Thinking',
      tag_projects: '04 — Website Work',
      tag_experience: '05 — Where I\'ve Been',
      tag_education: '06 — Education',
      tag_contact: '07 — Say Hello',
      skills_title: 'Technical Skills',
      content_title: 'Content Strategy & Social Media',
      content_intro: 'Planning work gets its own space here: calendars, platform thinking, copy direction, and review loops.',
      content_cta: 'Open Calendar',
      content_plan_strategy: 'Strategy',
      content_plan_calendar: 'Monthly Calendar',
      content_plan_ideas: 'Ideas Bank',
      content_plan_review: 'Review',
      content_week: 'Week',
      content_focus: 'Focus',
      content_channel: 'Channel',
      content_output: 'Output',
      content_focus_awareness: 'Awareness',
      content_focus_trust: 'Trust',
      content_focus_engagement: 'Engagement',
      content_focus_conversion: 'Conversion',
      content_output_caption: 'Caption + CTA',
      content_output_visual: 'Visual brief',
      content_output_angle: 'Post angle',
      content_output_review: 'Review notes',
      content_channel_multi: 'Multi-platform',
      projects_title: 'Selected Website Work',
      experience_title: 'Experience',
      education_title: 'Education & Training',
      contact_title: "Let's Work Together",
      form_name: 'Name',
      form_email: 'Email',
      form_message: 'Message',
      form_send: 'Send Message',
      form_name_ph: 'Your full name',
      form_message_ph: 'Tell me about your project...',
      location_available: 'Erbil, Iraq — Available Worldwide',
      achievements_title: 'Key Achievements',
      visit_site: 'Open Website',
      project_sites: 'Linked websites',
      edu_degree: 'Bachelor of Science in Information Technology (B.Sc. IT)',
      edu_location: 'Erbil, Iraq',
      languages_title: 'Languages',
      lang_arabic: 'Arabic',
      lang_english: 'English',
      lang_kurdish: 'Kurdish',
      lang_native: 'Native',
      about_section_title: 'About Me',
      lang_toggle_label: 'عربي',
      form_success: '✓ Message sent successfully! I\'ll get back to you soon.',
      form_error: 'Failed to send message. Please try again.',
      form_fill: 'Please fill in all fields.',
    },
    ar: {
      nav_about: 'من نحن',
      nav_skills: 'المهارات',
      nav_content: 'المحتوى',
      nav_projects: 'المواقع',
      nav_experience: 'الخبرات',
      nav_contact: 'تواصل',
      nav_home: 'الرئيسية',
      hero_badge: 'متاحة للمشاريع',
      hero_cta_view: 'عرض أعمالي',
      hero_cta_contact: 'تواصل معي',
      hero_cta_cv: 'السيرة الذاتية',
      stat_projects: 'مشروع مُنجز',
      stat_years: 'سنوات خبرة',
      stat_orgs: 'منظمات خُدمت',
      scroll: 'مرر للأسفل',
      tag_about: '01 — من أنا',
      tag_skills: '02 — ما أتقنه',
      tag_content: '03 — تفكير المحتوى',
      tag_projects: '04 — أعمال المواقع',
      tag_experience: '05 — خبرتي المهنية',
      tag_education: '06 — التعليم',
      tag_contact: '07 — ابدأ المحادثة',
      skills_title: 'المهارات',
      content_title: 'استراتيجية المحتوى والسوشيال ميديا',
      content_intro: 'هنا تظهر أعمال التخطيط بشكل مستقل: تقاويم المحتوى، التفكير حسب المنصة، توجيه الكتابة، وآلية المراجعة.',
      content_cta: 'فتح التقويم',
      content_plan_strategy: 'الاستراتيجية',
      content_plan_calendar: 'التقويم الشهري',
      content_plan_ideas: 'بنك الأفكار',
      content_plan_review: 'المراجعة',
      content_week: 'الأسبوع',
      content_focus: 'التركيز',
      content_channel: 'المنصة',
      content_output: 'المخرج',
      content_focus_awareness: 'الوعي',
      content_focus_trust: 'الثقة',
      content_focus_engagement: 'التفاعل',
      content_focus_conversion: 'التحويل',
      content_output_caption: 'نص + CTA',
      content_output_visual: 'توجيه بصري',
      content_output_angle: 'زاوية المنشور',
      content_output_review: 'ملاحظات مراجعة',
      content_channel_multi: 'عدة منصات',
      projects_title: 'أبرز مواقع الويب',
      experience_title: 'الخبرات المهنية',
      education_title: 'التعليم والتدريب',
      contact_title: 'لنعمل معاً',
      form_name: 'الاسم',
      form_email: 'البريد الإلكتروني',
      form_message: 'الرسالة',
      form_send: 'إرسال الرسالة',
      form_name_ph: 'اسمك الكامل',
      form_message_ph: 'أخبرني عن مشروعك...',
      location_available: 'أربيل، العراق — متاحة للعمل عالمياً',
      achievements_title: 'أبرز الإنجازات',
      visit_site: 'فتح الموقع',
      edu_degree: 'بكالوريوس علوم في تكنولوجيا المعلومات',
      edu_location: 'أربيل، العراق',
      languages_title: 'اللغات',
      lang_arabic: 'العربية',
      lang_english: 'الإنجليزية',
      lang_kurdish: 'الكردية',
      lang_native: 'اللغة الأم',
      about_section_title: 'من أنا',
      lang_toggle_label: 'EN',
      form_success: '✓ تم إرسال رسالتك بنجاح! سأرد عليك قريباً.',
      form_error: 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.',
      form_fill: 'يرجى ملء جميع الحقول.',
    }
  };

  i18n.ar.projects_title = 'أبرز مواقع الويب';
  i18n.ar.visit_site = 'فتح الموقع';
  i18n.ar.project_sites = 'المواقع المرتبطة';

  Object.assign(i18n.en, {
    tag_projects: '04 — Website Content',
    projects_title: 'Website Content Portfolio',
    projects_intro: 'A focused collection of live websites where the page content, message structure, and visitor-facing copy were written by Lubab.',
    website_summary_count: 'Live websites',
    website_summary_role: 'Content ownership',
    website_summary_links: 'Direct links',
    website_content_label: 'Content role',
    website_content_role: 'Website content written by Lubab',
    website_visit: 'Visit Website',
    website_status: 'Live website',
    website_empty: 'No website content projects are available yet.'
  });

  Object.assign(i18n.ar, {
    tag_projects: '04 — محتوى المواقع',
    projects_title: 'محفظة محتوى المواقع',
    projects_intro: 'مجموعة مختارة من مواقع مباشرة كتبت لباب محتواها، ونظمت رسائلها، وجهزت النصوص التي يقرأها الزائر داخل الموقع.',
    website_summary_count: 'مواقع مباشرة',
    website_summary_role: 'ملكية المحتوى',
    website_summary_links: 'روابط مباشرة',
    website_content_label: 'دور المحتوى',
    website_content_role: 'كتابة محتوى الموقع من قبل لباب',
    website_visit: 'زيارة الموقع',
    website_status: 'موقع مباشر',
    website_empty: 'لا توجد مواقع محتوى معروضة حالياً.'
  });

  // ========== Page Loader ==========
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('page-loader').classList.add('hidden');
      initAnimations();
      animateCounters();
    }, 1600);
  });

  // ========== Init Theme & Language ==========
  applyTheme(currentTheme);
  applyLanguage(currentLang);

  // ========== Theme Toggle ==========
  document.getElementById('theme-toggle').addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('lubab_theme', currentTheme);
    applyTheme(currentTheme);
  });

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    window.dispatchEvent(new CustomEvent('themechanged'));
  }

  // ========== Language Toggle ==========
  document.getElementById('lang-toggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('lubab_lang', currentLang);
    applyLanguage(currentLang);
    // Re-render dynamic content
    if (portfolioData.content) renderContent(portfolioData.content);
    if (portfolioData.projects) {
      renderContentStrategy(portfolioData.projects);
      renderProjects(portfolioData.projects);
    }
    if (portfolioData.skills) renderSkills(portfolioData.skills);
    if (portfolioData.experience) renderExperience(portfolioData.experience);
  });

  function applyLanguage(lang) {
    const html = document.documentElement;
    if (lang === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
    }
    // Update label
    document.getElementById('lang-label').textContent = i18n[lang].lang_toggle_label;

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang][key]) {
        el.textContent = i18n[lang][key];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-placeholder-i18n]').forEach(el => {
      const key = el.getAttribute('data-placeholder-i18n');
      if (i18n[lang][key]) {
        el.placeholder = i18n[lang][key];
      }
    });
  }

  // ========== Load Portfolio Data ==========
  async function loadData() {
    const [content, projects, skills, experience] = await Promise.all([
      fetchJsonWithRetry('/api/content', {}),
      fetchJsonWithRetry('/api/projects', []),
      fetchJsonWithRetry('/api/skills', {}),
      fetchJsonWithRetry('/api/experience', [])
    ]);

    portfolioData = { content, projects, skills, experience };

    try {
      renderContent(portfolioData.content);
    } catch (err) {
      console.error('Failed to render content:', err);
    }

    try {
      renderContentStrategy(portfolioData.projects);
      renderProjects(portfolioData.projects);
    } catch (err) {
      console.error('Failed to render projects:', err);
    }

    try {
      renderSkills(portfolioData.skills);
    } catch (err) {
      console.error('Failed to render skills:', err);
    }

    try {
      renderExperience(portfolioData.experience);
    } catch (err) {
      console.error('Failed to render experience:', err);
    }
  }

  async function fetchJsonWithRetry(endpoint, fallback, options = {}, retries = 2) {
    const url = `${API}${endpoint}`;
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const res = await fetch(url, options);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || `Request failed with status ${res.status}`);
        }
        return data;
      } catch (err) {
        lastError = err;
        if (attempt < retries) {
          await delay(650 * (attempt + 1));
        }
      }
    }

    console.error(`Failed to load ${endpoint}:`, lastError);
    return fallback;
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ========== Render Content ==========
  function renderContent(c) {
    const lang = currentLang;
    const get = (key) => c[`${key}_${lang}`] || c[`${key}_en`] || c[key] || '';

    const headline = get('hero_headline');
    if (headline) {
      document.getElementById('hero-headline').innerHTML = headline.replace(/\n/g, '<br>');
    }
    const subtext = get('hero_subtext');
    if (subtext) {
      document.getElementById('hero-subtext').textContent = subtext;
    }

    const aboutText = get('about_text');
    if (aboutText) {
      const paragraphs = aboutText.split('\n\n');
      document.getElementById('about-text').innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    ['highlight-1', 'highlight-2', 'highlight-3', 'highlight-4'].forEach((id, i) => {
      const val = get(`about_highlight_${i + 1}`);
      if (val) {
        const el = document.getElementById(id);
        if (el) el.querySelector('h3').textContent = val;
      }
    });

    const contactText = get('contact_text');
    if (contactText) document.getElementById('contact-text').textContent = contactText;

    // Location
    const loc = get('personal_location');
    if (loc) {
      const locEl = document.getElementById('personal-location');
      if (locEl) locEl.textContent = loc;
    }
  }

  // ========== Render Content Strategy ==========
  function renderContentStrategy(projects) {
    const section = document.getElementById('content-strategy');
    const container = document.getElementById('content-showcase');
    if (!section || !container) return;

    const showcases = normalizeProjects(projects, currentLang);
    const contentProject = showcases.find(project => project.isShowcase !== false && project.showcaseGroup === 'content');
    if (!contentProject) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    const langText = i18n[currentLang];
    const planSteps = [
      langText.content_plan_strategy,
      langText.content_plan_calendar,
      langText.content_plan_ideas,
      langText.content_plan_review
    ];
    const focusRows = [
      { week: '01', focus: langText.content_focus_awareness, channel: 'Facebook', output: langText.content_output_caption },
      { week: '02', focus: langText.content_focus_trust, channel: 'Instagram', output: langText.content_output_visual },
      { week: '03', focus: langText.content_focus_engagement, channel: 'LinkedIn', output: langText.content_output_angle }
    ];
    const points = contentProject.achievementList.slice(0, 2);
    const visibleTechs = contentProject.techs.slice(0, 4);

    container.innerHTML = `
      <article class="content-showcase-card glass-card animate-in">
        <div class="content-copy">
          <div class="content-meta">
            <span class="content-badge">${escapeHtml(contentProject.kind)}</span>
            <span class="content-status">${escapeHtml(contentProject.status)}</span>
          </div>
          <div class="content-heading">
            <h3>${escapeHtml(contentProject.title)}</h3>
            ${contentProject.role ? `<p>${escapeHtml(contentProject.role)}</p>` : ''}
          </div>
          <p class="content-description">${escapeHtml(contentProject.desc)}</p>
          ${points.length ? `
            <div class="content-points">
              ${points.map(point => `<span class="content-point">${escapeHtml(point)}</span>`).join('')}
            </div>
          ` : ''}
          ${visibleTechs.length ? `
            <div class="content-tags">
              ${visibleTechs.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}
            </div>
          ` : ''}
          ${contentProject.primaryUrl ? `
            <a href="${contentProject.primaryUrl}" target="_blank" rel="noopener" class="btn btn-primary content-cta">
              <span>${escapeHtml(contentProject.cta || langText.content_cta)}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          ` : ''}
        </div>
        <div class="content-plan-preview" aria-hidden="true">
          <div class="plan-tabs">
            ${planSteps.map((step, index) => `<span class="${index === 1 ? 'active' : ''}">${escapeHtml(step)}</span>`).join('')}
          </div>
          <div class="calendar-surface">
            <div class="calendar-row calendar-head">
              <span>${escapeHtml(langText.content_week)}</span>
              <span>${escapeHtml(langText.content_focus)}</span>
              <span>${escapeHtml(langText.content_channel)}</span>
              <span>${escapeHtml(langText.content_output)}</span>
            </div>
            ${focusRows.map(row => `
              <div class="calendar-row">
                <span class="calendar-week">${escapeHtml(row.week)}</span>
                <span>${escapeHtml(row.focus)}</span>
                <span class="calendar-channel">${escapeHtml(row.channel)}</span>
                <span>${escapeHtml(row.output)}</span>
              </div>
            `).join('')}
          </div>
          <div class="platform-lanes">
            <span>Facebook</span>
            <span>Instagram</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </article>
    `;

    observeElements();
  }

  // ========== Render Website Projects ==========
  function renderProjects(projects) {
    const container = document.getElementById('projects-list');
    if (!container) return;

    container.classList.add('site-showcase');
    const showcases = normalizeProjects(projects, currentLang);
    const displayProjects = showcases.filter(project => project.isShowcase !== false && project.isWebsite);
    const langText = i18n[currentLang];

    if (!displayProjects.length) {
      container.innerHTML = `<p class="website-empty">${escapeHtml(langText.website_empty)}</p>`;
      observeElements();
      return;
    }

    const siteCards = displayProjects.map((project, i) => {
      const projectNumber = `0${i + 1}`.slice(-2);
      const visibleTags = (project.contentTags.length ? project.contentTags : project.techs).slice(0, 3);
      const url = project.primaryUrl || project.siteEntries.find(site => site.url)?.url || '';
      const domain = project.siteDomain || project.browserLabel;
      const role = project.role || langText.website_content_role;
      const status = project.status || langText.website_status;

      return `
        <article class="site-card glass-card animate-in">
          <div class="site-card-top">
            <span class="site-index">${projectNumber}</span>
            <span class="site-kind">${escapeHtml(project.kind)}</span>
          </div>

          ${url
            ? `<a href="${url}" target="_blank" rel="noopener" class="site-domain">${escapeHtml(domain)}</a>`
            : `<span class="site-domain">${escapeHtml(domain)}</span>`
          }

          <h3 class="site-title">${escapeHtml(project.title)}</h3>
          <p class="site-desc">${escapeHtml(project.desc)}</p>

          <div class="site-role">
            <span>${escapeHtml(langText.website_content_label)}</span>
            <strong>${escapeHtml(role)}</strong>
          </div>

          ${visibleTags.length ? `
            <div class="site-tags">
              ${visibleTags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}
            </div>
          ` : ''}

          <div class="site-actions">
            <span class="site-status">${escapeHtml(status)}</span>
            ${url ? `
              <a href="${url}" target="_blank" rel="noopener" class="site-direct-link" aria-label="${escapeHtml(`${langText.website_visit}: ${project.title}`)}">
                <span>${escapeHtml(project.cta || langText.website_visit)}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    container.innerHTML = `
      <div class="website-overview animate-in">
        <div class="website-overview-item">
          <strong>${String(displayProjects.length).padStart(2, '0')}</strong>
          <span>${escapeHtml(langText.website_summary_count)}</span>
        </div>
        <div class="website-overview-item">
          <strong>${currentLang === 'ar' ? '100%' : 'Own'}</strong>
          <span>${escapeHtml(langText.website_summary_role)}</span>
        </div>
        <div class="website-overview-item">
          <strong>${String(displayProjects.filter(project => project.primaryUrl).length).padStart(2, '0')}</strong>
          <span>${escapeHtml(langText.website_summary_links)}</span>
        </div>
      </div>
      <div class="site-directory">
        ${siteCards}
      </div>
    `;
    observeElements();
  }

  function buildProjectSitePreview(project) {
    const entries = Array.isArray(project.siteEntries)
      ? project.siteEntries.filter(site => site && site.label)
      : [];

    if (entries.length === 0) {
      return project.status ? [{ label: project.status, url: '', count: false }] : [];
    }

    const preview = entries.slice(0, 2).map(site => ({
      label: site.label,
      url: site.url || '',
      count: false
    }));

    if (entries.length > 2) {
      preview.push({
        label: `+${entries.length - 2}`,
        url: '',
        count: true
      });
    }

    return preview;
  }

  function normalizeProjects(projects, lang) {
    return projects
      .map(project => parseProjectRecord(project, lang))
      .sort((a, b) => a.priority - b.priority || a.sort_order - b.sort_order);
  }

  function parseProjectRecord(project, lang) {
    let data = {};

    try {
      data = JSON.parse(project.description);
    } catch {
      data = {};
    }

    const title = getLocalizedValue(data, 'title', lang, project.title) || project.title;
    const desc = getLocalizedValue(data, 'desc', lang, project.description) || project.description;
    const achievements = getLocalizedValue(data, 'achieve', lang, project.achievements) || project.achievements || '';
    const role = getLocalizedValue(data, 'role', lang, '');
    const kind = getLocalizedValue(data, 'kind', lang, inferProjectKind(title, lang, data));
    const status = getLocalizedValue(data, 'status', lang, '');
    const cta = getLocalizedValue(data, 'cta', lang, i18n[lang].visit_site);

    const techs = String(project.technologies || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    const urlList = normalizeUrlList(data.url || '');
    const localizedSiteEntries = getLocalizedArray(data, 'site_entries', lang);
    const siteEntries = normalizeSiteEntries(localizedSiteEntries, urlList);
    const normalizedSiteEntries = siteEntries.length
      ? siteEntries
      : urlList.map(url => ({ label: formatUrlLabel(url), url }));
    const impactList = getLocalizedArray(data, 'impact', lang);
    const achievementList = impactList.length ? impactList : splitSentences(achievements);
    const stats = getLocalizedArray(data, 'stats', lang);
    const contentTags = getLocalizedArray(data, 'tags', lang);
    const primaryUrl = urlList[0] || normalizedSiteEntries.find(site => site.url)?.url || '';
    const isWebsite = typeof data.is_website === 'boolean'
      ? data.is_website
      : inferWebsiteProject(title, techs, normalizedSiteEntries, primaryUrl);
    const featured = Boolean(data.featured || normalizedSiteEntries.length >= 3);
    const priority = Number.isFinite(Number(data.priority))
      ? Number(data.priority)
      : featured ? 0 : isWebsite ? 1 : 2;
    const browserLabel = getLocalizedValue(data, 'browser_label', lang, '')
      || normalizedSiteEntries.find(site => site.url)?.url?.replace(/^https?:\/\//, '')
      || normalizedSiteEntries[0]?.label
      || title;
    const siteDomain = data.site_domain || getHostname(primaryUrl) || browserLabel;

    return {
      ...project,
      desc,
      title,
      role,
      kind,
      status,
      techs,
      achievementList,
      urlList,
      siteEntries: normalizedSiteEntries,
      metrics: stats.length ? stats : buildProjectMetrics(isWebsite, normalizedSiteEntries, techs),
      primaryUrl,
      browserLabel,
      siteDomain,
      contentTags,
      cta,
      featured,
      isWebsite,
      showcaseGroup: data.showcase_group || data.group || inferProjectGroup(title, techs, data, isWebsite),
      isShowcase: data.showcase !== false,
      priority,
    };
  }

  function getLocalizedValue(data, key, lang, fallback = '') {
    return data[`${key}_${lang}`] || data[key] || fallback;
  }

  function getLocalizedArray(data, key, lang) {
    const localized = data[`${key}_${lang}`];
    if (Array.isArray(localized)) return localized;
    if (Array.isArray(data[key])) return data[key];
    return [];
  }

  function normalizeUrlList(rawValue) {
    return String(rawValue || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  function normalizeSiteEntries(entries, urlList) {
    if (!Array.isArray(entries)) return [];

    return entries
      .map((entry, index) => {
        if (typeof entry === 'string') {
          return {
            label: entry,
            url: urlList[index] || ''
          };
        }

        if (!entry || typeof entry !== 'object') {
          return null;
        }

        return {
          label: entry.label || entry.name || formatUrlLabel(entry.url || ''),
          url: entry.url || ''
        };
      })
      .filter(entry => entry && entry.label);
  }

  function splitSentences(value) {
    return String(value || '')
      .split('.')
      .map(item => item.trim())
      .filter(Boolean);
  }

  function inferWebsiteProject(title, techs, siteEntries, primaryUrl) {
    if (primaryUrl || siteEntries.length) return true;

    const signature = `${title} ${techs.join(' ')}`.toLowerCase();
    return /website|wordpress|seo|html|css|javascript|landing|ui\/ux|web/.test(signature);
  }

  function inferProjectGroup(title, techs, data, isWebsite) {
    if (isWebsite) return 'website';

    const signature = `${title} ${techs.join(' ')} ${JSON.stringify(data)}`.toLowerCase();
    if (/content|social media|copywriting|calendar|google sheets|facebook|instagram|linkedin/.test(signature)) {
      return 'content';
    }
    if (/system|inventory|supply chain|database/.test(signature)) {
      return 'system';
    }

    return 'other';
  }

  function inferProjectKind(title, lang, data) {
    if (data.featured || normalizeUrlList(data.url || '').length > 1) {
      return lang === 'ar' ? 'مجموعة مواقع' : 'Website Collection';
    }

    const signature = String(title || '').toLowerCase();
    if (/system|inventory|supply chain/.test(signature)) {
      return lang === 'ar' ? 'نظام إداري' : 'Management System';
    }
    if (/platform|bazari|classified/.test(signature)) {
      return lang === 'ar' ? 'منصة ويب' : 'Web Platform';
    }

    return lang === 'ar' ? 'موقع إلكتروني' : 'Website Project';
  }

  function buildProjectMetrics(isWebsite, siteEntries, techs) {
    const metrics = [];

    if (siteEntries.length > 1) {
      metrics.push(`${siteEntries.length} linked sites`);
    } else if (isWebsite) {
      metrics.push('Responsive web delivery');
    }

    techs.slice(0, 2).forEach(item => {
      metrics.push(item);
    });

    return metrics.slice(0, 3);
  }

  function formatUrlLabel(url) {
    const hostname = getHostname(url);
    if (!hostname) return url;

    return hostname
      .replace(/\.[^.]+$/, '')
      .split(/[.-]/)
      .filter(Boolean)
      .map(part => part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  function getHostname(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  // ========== Skill category name translations ==========
  const catNames = {
    en: {
      'Frontend': '💻 Frontend Development',
      'Backend': '⚙️ Backend & Databases',
      'Tools': '🛠️ Tools & Platforms',
      'Digital Marketing': '📣 Digital Marketing',
      'AI Tools': '🤖 AI Tools',
      'Other': 'Other Skills',
    },
    ar: {
      'Frontend': '💻 تطوير الواجهات الأمامية',
      'Backend': '⚙️ الخلفية وقواعد البيانات',
      'Tools': '🛠️ الأدوات والمنصات',
      'Digital Marketing': '📣 التسويق الرقمي',
      'AI Tools': '🤖 أدوات الذكاء الاصطناعي',
      'Other': 'مهارات أخرى',
    }
  };

  // ========== Render Skills (tag-based) ==========
  function renderSkills(skills) {
    const container = document.getElementById('skills-grid');
    const lang = currentLang;
    const categories = Object.keys(skills);
    container.innerHTML = categories.map(cat => {
      const label = (catNames[lang] && catNames[lang][cat]) || cat;
      return `
        <div class="skill-category glass-card animate-in">
          <h3 class="skill-category-title">${escapeHtml(label)}</h3>
          <div class="skill-tags">
            ${skills[cat].map(s => `<span class="skill-tag">${escapeHtml(getLocalizedSkillName(s.name, lang))}</span>`).join('')}
          </div>
        </div>
      `;
    }).join('');
    observeElements();
  }

  function getLocalizedSkillName(value, lang) {
    const raw = String(value || '').trim();
    if (!raw) return '';

    try {
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        return data[lang] || data.en || data.ar || raw;
      }
    } catch {
      // Legacy bilingual skill labels use "Arabic — English".
    }

    if (raw.includes('—')) {
      const parts = raw.split('—').map(part => part.trim()).filter(Boolean);
      if (parts.length >= 2) {
        return lang === 'ar' ? parts[0] : parts[parts.length - 1];
      }
    }

    return raw;
  }

  // ========== Render Experience ==========
  function renderExperience(experience) {
    const container = document.getElementById('timeline');
    const lang = currentLang;

    container.innerHTML = experience.map(e => {
      let desc, title, company, period;
      try {
        const data = JSON.parse(e.description);
        desc = lang === 'ar' ? data.desc_ar : data.desc_en;
        title = lang === 'ar' ? data.title_ar : e.title;
        company = lang === 'ar' ? data.company_ar : e.company;
        period = lang === 'ar' ? data.period_ar : e.period;
      } catch {
        desc = e.description;
        title = e.title;
        company = e.company;
        period = e.period;
      }

      return `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <span class="timeline-period">${escapeHtml(period)}</span>
          <h3 class="timeline-title">${escapeHtml(title)}</h3>
          <p class="timeline-company">${escapeHtml(company)}</p>
          <p class="timeline-description">${escapeHtml(desc)}</p>
        </div>
      `;
    }).join('');
    observeElements();
  }

  // ========== Intersection Observer ==========
  let observer;

  function observeElements() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-in, .slide-left, .slide-right, .scale-in, .timeline-item').forEach(el => {
      observer.observe(el);
    });
  }

  function initAnimations() { observeElements(); }

  // ========== Counter Animation ==========
  function animateCounters() {
    document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const start = performance.now();
      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // ========== Navigation ==========
  const nav = document.getElementById('main-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  function handleScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  // ========== Contact Form ==========
  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const btn = document.getElementById('contact-submit');
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      status.textContent = i18n[currentLang].form_fill;
      status.className = 'form-status error';
      return;
    }

    btn.disabled = true;
    try {
      const data = await fetchJsonWithRetry('/api/contact', { success: false }, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      }, 1);

      if (data.success) {
        status.textContent = i18n[currentLang].form_success;
        status.className = 'form-status success';
        e.target.reset();
      } else {
        throw new Error(data.error);
      }
    } catch {
      status.textContent = i18n[currentLang].form_error;
      status.className = 'form-status error';
    } finally {
      btn.disabled = false;
    }
  });

  // ========== Interactive Star Particles ==========
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height, dpr;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    let mouse = { x: -1000, y: -1000, radius: 130 };
    let targetMouse = { x: -1000, y: -1000 };

    function resetTargetMouse() {
      targetMouse.x = -1000; 
      targetMouse.y = -1000;
    }

    window.addEventListener('pointermove', (e) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    });
    window.addEventListener('blur', resetTargetMouse);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) resetTargetMouse();
    });

    class Particle {
      constructor() {
        this.baseX = Math.random() * width;
        this.baseY = Math.random() * height;
        this.x = this.baseX;
        this.y = this.baseY;
        this.size = Math.random() * 0.8 + 0.2; // Extra tiny stars
        
        let isLight = document.body.classList.contains('light-mode');
        this.color = `rgba(${isLight ? '0,0,0' : '255,255,255'}, ${Math.random() * 0.5 + 0.2})`;
        
        // Slower and calmer drift
        this.vx = (Math.random() - 0.5) * 0.1;
        this.vy = Math.random() * -0.15 - 0.05; 
      }
      
      update() {
        // Drift the base anchor naturally
        this.baseX += this.vx;
        this.baseY += this.vy;
        
        // Wrap around seamlessly to keep infinite stars
        if (this.baseY < 0) { 
          this.baseY = height; 
          this.baseX = Math.random() * width; 
          this.x = this.baseX; 
          this.y = this.baseY; 
        }
        if (this.baseX < 0) { this.baseX = width; this.x = this.baseX; }
        if (this.baseX > width) { this.baseX = 0; this.x = this.baseX; }

        let dx = mouse.x - this.baseX;
        let dy = mouse.y - this.baseY;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        // Repulsion logic: ease away naturally to create a smooth gap/hole
        if (dist < mouse.radius && dist > 0.001) {
          let force = (mouse.radius - dist) / mouse.radius;
          let pushX = -(dx / dist) * force * 120; // The strength of the gap
          let pushY = -(dy / dist) * force * 120;
          
          this.x += (this.baseX + pushX - this.x) * 0.15;
          this.y += (this.baseY + pushY - this.y) * 0.15;
        } else {
          // Snap gracefully back to the drifting base position
          this.x += (this.baseX - this.x) * 0.05;
          this.y += (this.baseY - this.y) * 0.05;
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    let particlesArray = [];
    function init() {
      particlesArray = [];
      let numberOfParticles = Math.floor((width * height) / 2500); 
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    init();
    
    // Re-init if resize or theme changes
    let resizeTimer;
    window.addEventListener('resize', () => { 
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 200); 
    });
    window.addEventListener('themechanged', init);

    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      // Smoothly follow the target mouse
      mouse.x += (targetMouse.x - mouse.x) * 0.1;
      mouse.y += (targetMouse.y - mouse.y) * 0.1;

      for (let i = 0; i < particlesArray.length; ++i) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ========== Smooth Scroll ==========

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ========== Helpers ==========
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ========== Init ==========
  loadData();
  initParticles();

})();
