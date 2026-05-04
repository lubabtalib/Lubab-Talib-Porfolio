require('dotenv').config();
const bcrypt = require('bcryptjs');

async function seed() {
  const { getDb, queryOne, queryCount, runStmt } = require('./db');
  await getDb();

  // Seed admin user
  const existingUser = await queryOne('SELECT id FROM users WHERE username = ?', [process.env.ADMIN_USER || 'admin']);
  if (!existingUser) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASS || 'admin123', 10);
    await runStmt('INSERT INTO users (username, password_hash) VALUES (?, ?)', [process.env.ADMIN_USER || 'admin', hash]);
    console.log('✓ Admin user created');
  } else {
    console.log('• Admin user already exists');
  }

  // ========== CONTENT (EN + AR) ==========
  const sections = {
    hero_headline_en: 'Building Smart, Scalable\nDigital Experiences',
    hero_headline_ar: 'بناء تجارب رقمية ذكية\nوقابلة للتطوير',
    hero_subtext_en: 'IT graduate with practical experience in WordPress website design, development, and content creation. I focus on building clear, functional digital experiences while expanding my expertise in social media management, content planning, and digital marketing. My background in logistics operations adds a strong sense of organization, accuracy, and problem-solving to my work.',
    hero_subtext_ar: 'متخصصة في تكنولوجيا المعلومات في تطوير WordPress وتصميم UI/UX واستراتيجية SEO والمحتوى. تحويل التحديات المعقدة إلى حلول رقمية أنيقة وعالية الأداء.',
    hero_cta_primary_en: 'View My Work',
    hero_cta_primary_ar: 'عرض أعمالي',
    hero_cta_secondary_en: 'Get In Touch',
    hero_cta_secondary_ar: 'تواصل معي',
    about_title_en: 'About Me',
    about_title_ar: 'عني',
    about_text_en: 'Information Technology graduate with practical experience in WordPress website design, development, and full website content creation. I focus on building clear, functional, and user-focused digital experiences that support business and organizational goals.\n\nMy experience includes WordPress development, website structure planning, content preparation, basic SEO, and usability improvements. I am also expanding my skills in social media management, content planning, and digital marketing to create more complete digital solutions.\n\nMy previous background in logistics operations helped me develop strong organization, attention to detail, and problem-solving skills, which I now apply to web and digital projects.',
    about_text_ar: 'خريجة تكنولوجيا المعلومات مع شغف لبناء حلول رقمية تحدث تأثيراً حقيقياً. مع أساس قوي في تقنيات الواجهة الأمامية والخلفية، أقدم مزيجاً فريداً من الخبرة التقنية وحل المشكلات الإبداعي في كل مشروع.\n\nتمتد خبرتي عبر تطوير WordPress وتصميم UI/UX وتحسين SEO واستراتيجية المحتوى — مما يتيح لي إدارة المشاريع الكاملة من المفهوم إلى النشر. عملت مع منظمات دولية وفرق متنوعة، وقدمت حلولاً ليست فقط مذهلة بصرياً ولكن أيضاً قوية تقنياً وقابلة للتطوير.\n\nبالإضافة إلى تطوير الويب، شكّلت خلفيتي في العمليات اللوجستية وسلسلة التوريد نهج التفكير المنظومي — أرى كل مشروع كنظام مترابط حيث يجب أن يعمل كل مكون بتناغم.',
    about_highlight_1_en: 'WordPress Development',
    about_highlight_1_ar: 'تطوير WordPress',
    about_highlight_2_en: 'UI/UX Design',
    about_highlight_2_ar: 'تصميم UI/UX',
    about_highlight_3_en: 'SEO & Content Writing',
    about_highlight_3_ar: 'SEO وكتابة المحتوى',
    about_highlight_4_en: 'Logistics & Systems Thinking',
    about_highlight_4_ar: 'اللوجستيات والتفكير المنظومي',
    contact_title_en: "Let's Work Together",
    contact_title_ar: 'لنعمل معاً',
    contact_text_en: "Have a project in mind or want to discuss a collaboration? I'd love to hear from you. Fill out the form below and I'll get back to you as soon as possible.",
    contact_text_ar: 'لديك مشروع في ذهنك أو تريد مناقشة تعاون؟ يسعدني سماعك. املأ النموذج أدناه وسأعود إليك في أقرب وقت ممكن.',
    footer_text: '© 2026 Lubab Talib. All rights reserved.',
    personal_name: 'Lubab Talib',
    personal_email: 'lubabbtalib@gmail.com',
    personal_phone: '(+964) 7737038154',
    personal_location_en: 'Erbil, Iraq',
    personal_location_ar: 'أربيل، العراق',
  };

  for (const [section, value] of Object.entries(sections)) {
    const exists = await queryOne('SELECT id FROM content WHERE section = ?', [section]);
    if (!exists) {
      await runStmt('INSERT INTO content (section, value) VALUES (?, ?)', [section, value]);
    }
  }
  console.log('✓ Content seeded');

  // ========== SKILLS — always refresh ==========
  await runStmt('DELETE FROM skills');
  const skills = [
    // Frontend
    ['Frontend', 'HTML5', 90, 1],
    ['Frontend', 'CSS3', 90, 2],
    ['Frontend', 'JavaScript', 85, 3],
    ['Frontend', 'Responsive Design', 92, 4],
    ['Frontend', 'C++', 70, 5],
    ['Frontend', 'Android Studio', 65, 6],
    // Backend
    ['Backend', 'PHP', 80, 7],
    ['Backend', 'SQL Server', 80, 8],
    ['Backend', 'MySQL', 80, 9],
    ['Backend', 'Database Access', 75, 10],
    // Tools
    ['Tools', 'WordPress', 95, 11],
    ['Tools', 'Figma', 80, 12],
    ['Tools', 'Google Analytics', 88, 13],
    ['Tools', 'Microsoft Office', 90, 14],
    ['Tools', 'Google Workspace', 88, 15],
    ['Tools', 'CRM Systems', 82, 16],
    // Digital Marketing — comprehensive
    ['Digital Marketing', JSON.stringify({ en: 'Content Writing', ar: 'كتابة المحتوى' }), 92, 17],
    ['Digital Marketing', JSON.stringify({ en: 'SEO', ar: 'تحسين محركات البحث' }), 90, 18],
    ['Digital Marketing', JSON.stringify({ en: 'Paid Ads (PPC)', ar: 'الإعلانات المدفوعة' }), 85, 19],
    ['Digital Marketing', JSON.stringify({ en: 'Scheduled Ads', ar: 'الإعلانات المجدولة' }), 82, 20],
    ['Digital Marketing', JSON.stringify({ en: 'Social Media Management', ar: 'إدارة السوشيال ميديا' }), 90, 21],
    ['Digital Marketing', 'Meta Ads — Facebook & Instagram', 85, 22],
    ['Digital Marketing', JSON.stringify({ en: 'Google Ads', ar: 'إعلانات Google' }), 80, 23],
    ['Digital Marketing', JSON.stringify({ en: 'Email Marketing', ar: 'التسويق بالبريد الإلكتروني' }), 78, 24],
    // AI Tools — advanced tools focus
    ['AI Tools', '🟣 Claude — Coualde', 95, 25],
    ['AI Tools', '🚀 Antigravity AI', 92, 26],
    ['AI Tools', '💡 OpenAI Codex', 90, 27],
    ['AI Tools', '🤖 Meta AI', 88, 28],
    ['AI Tools', '✨ ChatGPT', 92, 29],
    ['AI Tools', '🎨 AI Image Generation', 82, 30],
    ['AI Tools', '⚙️ Prompt Engineering', 90, 31],
  ];
  const projects = [];
  projects.push(
    [
      'International Organization Websites',
      'Designed and managed a portfolio of organization websites covering WordPress setup, content writing, SEO basics, analytics support, and technical delivery.',
      'مواقع المنظمات الدولية',
      'قمت بتصميم وإدارة مجموعة مواقع لمنظمات دولية، مع الإشراف على WordPress وكتابة المحتوى وSEO الأساسي والدعم التقني وحتى الإطلاق.',
      'WordPress, PHP, MySQL, HTML5, CSS3, JavaScript, SEO, Google Analytics',
      'Managed 5+ organization websites from concept to launch. Wrote website content, handled SEO basics, and supported technical operations.',
      'إدارة أكثر من 5 مواقع لمنظمات دولية من الفكرة حتى الإطلاق، مع كتابة المحتوى ودعم تحسين الظهور وتقديم المساندة التقنية.',
      'https://ifa-us.org, https://iho-us.org, https://imc-us.org',
      '/images/projects/1-org.png',
      1,
      {
        kind_en: 'Website Collection',
        kind_ar: 'مجموعة مواقع',
        role_en: 'WordPress design, content writing, SEO, and IT support',
        role_ar: 'تصميم WordPress وكتابة المحتوى وSEO والدعم التقني',
        status_en: 'Live portfolio',
        status_ar: 'أعمال منشورة',
        stats_en: ['5 organization websites', 'Content + SEO ownership', 'Managed from concept to launch'],
        stats_ar: ['5 مواقع لمنظمات دولية', 'المحتوى وSEO ضمن نطاق العمل', 'إدارة من الفكرة حتى الإطلاق'],
        impact_en: [
          'Managed website delivery for multiple international organizations',
          'Created clear website content aligned with each organization',
          'Handled SEO and technical support to improve visibility and stability'
        ],
        impact_ar: [
          'إدارة تسليم مواقع متعددة لجهات ومنظمات دولية',
          'كتابة محتوى واضح ومتوافق مع أهداف كل جهة',
          'تقديم دعم تقني وتحسينات SEO لرفع الظهور والاستقرار'
        ],
        site_entries_en: [
          { label: 'International Federation for Arbitration', url: 'https://ifa-us.org' },
          { label: 'International Health Organization', url: 'https://iho-us.org' },
          { label: 'United Organization', url: 'https://imc-us.org' },
          { label: 'Royal American University', url: '' },
          { label: 'International Federation for Artificial Intelligence', url: '' }
        ],
        site_entries_ar: [
          { label: 'الاتحاد الدولي للتحكيم', url: 'https://ifa-us.org' },
          { label: 'منظمة الصحة الدولية', url: 'https://iho-us.org' },
          { label: 'المنظمة المتحدة', url: 'https://imc-us.org' },
          { label: 'الجامعة الأمريكية الملكية', url: '' },
          { label: 'الاتحاد الدولي للذكاء الاصطناعي', url: '' }
        ],
        featured: true,
        is_website: true,
        priority: 0
      }
    ],
    [
      'Social Media Content Calendar',
      'Created a monthly multi-platform social media content calendar for a fictional solar energy brand, showing strategy, weekly themes, platform adaptation, copywriting angles, visual direction, and business-focused CTAs.',
      'تقويم محتوى للسوشيال ميديا',
      'إنشاء تقويم محتوى شهري متعدد المنصات لعلامة طاقة شمسية خيالية، يوضح الاستراتيجية، محاور الأسابيع، تكييف المحتوى لكل منصة، زوايا الكتابة، الاتجاه البصري، وربط المنشورات بأهداف العمل.',
      'Content Strategy, Social Media Planning, Copywriting, Google Sheets, Facebook, Instagram, LinkedIn',
      'Structured a full monthly content system with strategy, calendar, idea bank, platform adaptation, creative direction, and a simple review workflow.',
      'بناء نظام محتوى شهري متكامل يشمل الاستراتيجية، التقويم، بنك الأفكار، تكييف المحتوى حسب المنصة، الاتجاه الإبداعي، وآلية مراجعة بسيطة.',
      'https://docs.google.com/spreadsheets/d/1ZGFbPach-zDlFGIYngIavbDwUGj5mRrkRlSO4V6uURE/edit?usp=sharing',
      '',
      2,
      {
        kind_en: 'Content Strategy Project',
        kind_ar: 'مشروع استراتيجية محتوى',
        role_en: 'Monthly planning, platform adaptation, copywriting direction, and review workflow',
        role_ar: 'تخطيط شهري، تكييف للمنصات، توجيه كتابة المحتوى، وآلية مراجعة',
        status_en: 'Portfolio sample',
        status_ar: 'نموذج بورتفوليو',
        stats_en: ['Monthly content strategy', 'Facebook, Instagram, LinkedIn', 'Idea bank + review workflow'],
        stats_ar: ['استراتيجية محتوى شهرية', 'Facebook وInstagram وLinkedIn', 'بنك أفكار وآلية مراجعة'],
        impact_en: [
          'Mapped clear goals, audience needs, and content pillars before creating posts',
          'Adapted the same core idea professionally for Facebook, Instagram, and LinkedIn',
          'Connected captions, visual direction, and CTAs to practical business goals'
        ],
        impact_ar: [
          'تحديد الأهداف والجمهور ومحاور المحتوى قبل كتابة المنشورات',
          'تكييف الفكرة الواحدة بشكل احترافي لمنصات Facebook وInstagram وLinkedIn',
          'ربط النصوص والاتجاه البصري وCTA بأهداف عملية قابلة للفهم'
        ],
        site_entries_en: [{ label: 'Open content calendar', url: 'https://docs.google.com/spreadsheets/d/1ZGFbPach-zDlFGIYngIavbDwUGj5mRrkRlSO4V6uURE/edit?usp=sharing' }],
        site_entries_ar: [{ label: 'فتح تقويم المحتوى', url: 'https://docs.google.com/spreadsheets/d/1ZGFbPach-zDlFGIYngIavbDwUGj5mRrkRlSO4V6uURE/edit?usp=sharing' }],
        browser_label_en: 'Google Sheets content calendar',
        browser_label_ar: 'تقويم محتوى على Google Sheets',
        cta_en: 'Open Calendar',
        cta_ar: 'فتح التقويم',
        showcase_group: 'content',
        featured: true,
        is_website: false,
        priority: 0
      }
    ],
    [
      'Bazari - Classified Ads Platform',
      'Designed and developed Bazari, a classified ads platform built on WordPress with advanced customization and SMS-based user verification.',
      'بازاري - منصة الإعلانات المبوبة',
      'قمت بتصميم وتطوير منصة بازاري للإعلانات المبوبة باستخدام WordPress مع تخصيصات متقدمة ودمج التحقق عبر الرسائل القصيرة.',
      'WordPress, WooCommerce, PHP, REST API, SMS Integration',
      'Built a full classified ads experience. Added SMS verification to reduce fake registrations and improve platform trust.',
      'بناء تجربة متكاملة للإعلانات المبوبة، مع إضافة تحقق عبر الرسائل القصيرة لتقليل الحسابات الوهمية ورفع موثوقية المنصة.',
      'https://lyabaiana.com',
      '/images/projects/2-bazari.png',
      3,
      {
        kind_en: 'Web Platform',
        kind_ar: 'منصة ويب',
        role_en: 'WordPress customization and platform UX delivery',
        role_ar: 'تخصيص WordPress وبناء تجربة استخدام المنصة',
        status_en: 'Live website',
        status_ar: 'موقع منشور',
        stats_en: ['Classified ads workflow', 'SMS verification', 'Remote delivery for Bazari'],
        stats_ar: ['تجربة إعلانات مبوبة متكاملة', 'تحقق عبر الرسائل القصيرة', 'تنفيذ العمل عن بُعد لشركة بازاري'],
        impact_en: [
          'Built the core listing and browsing experience for the platform',
          'Integrated SMS verification for smoother and safer registration',
          'Shaped a more reliable user journey for account creation'
        ],
        impact_ar: [
          'بناء تجربة العرض والتصفح الأساسية للمنصة',
          'دمج التحقق عبر الرسائل القصيرة لتسجيل أكثر أمانًا وسلاسة',
          'تحسين رحلة المستخدم منذ إنشاء الحساب وحتى استخدام المنصة'
        ],
        site_entries_en: [{ label: 'lyabaiana.com', url: 'https://lyabaiana.com' }],
        site_entries_ar: [{ label: 'lyabaiana.com', url: 'https://lyabaiana.com' }],
        featured: false,
        is_website: true,
        priority: 1
      }
    ],
    [
      'City Star Bakery Website',
      'Designed and developed a branded bakery website with responsive product presentation and SEO-aware content structure.',
      'موقع مخبز سيتي ستار',
      'تصميم وتطوير موقع لمخبز سيتي ستار مع عرض منتجات متجاوب وبنية محتوى محسّنة للظهور في البحث.',
      'WordPress, HTML5, CSS3, JavaScript, SEO',
      'Delivered a fast and visually appealing website that improved the bakery online presentation and discoverability.',
      'تسليم موقع سريع وجذاب بصريًا عزز حضور المخبز رقميًا وسهّل اكتشافه عبر محركات البحث.',
      'https://citystarbakery.com',
      '/images/projects/3-bakery.png',
      4,
      {
        kind_en: 'Business Website',
        kind_ar: 'موقع أعمال',
        role_en: 'Website design, product showcase, and SEO structure',
        role_ar: 'تصميم الموقع وعرض المنتجات وبنية SEO',
        status_en: 'Live website',
        status_ar: 'موقع منشور',
        stats_en: ['Responsive storefront', 'Product-focused layout', 'SEO-friendly structure'],
        stats_ar: ['واجهة متجاوبة', 'عرض واضح للمنتجات', 'بنية محسنة لمحركات البحث'],
        impact_en: [
          'Created a cleaner online brand presence for the bakery',
          'Balanced visual presentation with speed and usability',
          'Improved discoverability with search-friendly structure'
        ],
        impact_ar: [
          'إنشاء حضور رقمي أوضح وأكثر احترافية للمخبز',
          'تحقيق توازن بين الشكل الجذاب والسرعة وسهولة الاستخدام',
          'تحسين قابلية الظهور من خلال بنية مناسبة لمحركات البحث'
        ],
        site_entries_en: [{ label: 'citystarbakery.com', url: 'https://citystarbakery.com' }],
        site_entries_ar: [{ label: 'citystarbakery.com', url: 'https://citystarbakery.com' }],
        featured: false,
        is_website: true,
        priority: 1
      }
    ],
    [
      'Architecture Company Website',
      'Currently building an architecture company website from scratch using HTML5, CSS3, and JavaScript with a strong focus on responsive layout and clean UX/UI.',
      'موقع شركة معمارية',
      'أعمل حاليًا على بناء موقع لشركة معمارية من الصفر باستخدام HTML5 وCSS3 وJavaScript مع تركيز واضح على الاستجابة وتجربة الاستخدام النظيفة.',
      'HTML5, CSS3, JavaScript, Responsive Design, UX/UI',
      'Applying front-end fundamentals to build a clean, device-friendly presentation for an architecture brand.',
      'تطبيق أساسيات الواجهة الأمامية لبناء حضور رقمي نظيف ومتجاوب لعلامة معمارية.',
      '',
      '',
      5,
      {
        kind_en: 'Website In Progress',
        kind_ar: 'موقع قيد التطوير',
        role_en: 'Frontend development and responsive UI build',
        role_ar: 'تطوير الواجهة الأمامية وبناء واجهة متجاوبة',
        status_en: 'In progress',
        status_ar: 'قيد التطوير',
        stats_en: ['Built from scratch', 'HTML5, CSS3, JavaScript', 'Responsive UX across devices'],
        stats_ar: ['يبنى من الصفر', 'HTML5 وCSS3 وJavaScript', 'تجربة متجاوبة عبر الأجهزة'],
        impact_en: [
          'Designing a clear digital presentation for an architecture company',
          'Building the front-end structure directly without a template',
          'Focusing on responsive behavior and clean visual hierarchy'
        ],
        impact_ar: [
          'تصميم حضور رقمي واضح لشركة معمارية',
          'بناء الواجهة مباشرة دون الاعتماد على قالب جاهز',
          'التركيز على الاستجابة والتسلسل البصري النظيف'
        ],
        site_entries_en: [{ label: 'Architecture company website', url: '' }],
        site_entries_ar: [{ label: 'موقع شركة معمارية', url: '' }],
        featured: false,
        is_website: true,
        priority: 1
      }
    ],
    [
      'Supply Chain Management System',
      'Developed an internal management system to streamline inventory control, order processing, and supplier management across multiple warehouses.',
      'نظام إدارة سلسلة التوريد',
      'تطوير نظام داخلي لإدارة المخزون ومعالجة الطلبات وإدارة الموردين عبر أكثر من مستودع.',
      'Microsoft SQL Server, Database Design, Backend',
      'Implemented indexing and query tuning that reduced response time while supporting real-time inventory visibility.',
      'تنفيذ تحسينات في الفهرسة والاستعلامات خفّض زمن الاستجابة مع دعم رؤية لحظية للمخزون.',
      '',
      '/images/projects/4-supply.png',
      6,
      {
        kind_en: 'Management System',
        kind_ar: 'نظام إداري',
        role_en: 'Database design and backend development',
        role_ar: 'تصميم قاعدة البيانات وتطوير الخلفية',
        status_en: 'Internal system',
        status_ar: 'نظام داخلي',
        stats_en: ['Inventory tracking', 'Order processing', 'Supplier management'],
        stats_ar: ['تتبع المخزون', 'معالجة الطلبات', 'إدارة الموردين'],
        impact_en: [
          'Streamlined inventory operations across multiple warehouses',
          'Improved backend responsiveness with indexing and query optimization',
          'Centralized supplier and order data into one internal workflow'
        ],
        impact_ar: [
          'تبسيط عمليات المخزون عبر عدة مستودعات',
          'تحسين سرعة النظام الخلفي عبر الفهرسة وتحسين الاستعلامات',
          'تجميع بيانات الموردين والطلبات ضمن سير عمل داخلي واحد'
        ],
        featured: false,
        is_website: false,
        priority: 2
      }
    ]
  );

  const makeWebsiteContentProject = ({
    title,
    titleAr,
    descEn,
    descAr,
    url,
    domain,
    kindEn,
    kindAr,
    tagsEn,
    tagsAr,
    order
  }) => [
    title,
    descEn,
    titleAr,
    descAr,
    'Content Writing, Website Copywriting, SEO Basics, Information Architecture',
    `Wrote and structured the website content for ${title}, shaping the public-facing message, page flow, and direct calls to action.`,
    `كتابة وتنظيم محتوى موقع ${titleAr}، مع صياغة الرسائل العامة، ترتيب الصفحات، وتجهيز الدعوات المباشرة للتفاعل.`,
    url,
    '',
    order,
    {
      kind_en: kindEn,
      kind_ar: kindAr,
      role_en: 'Website content written by Lubab',
      role_ar: 'كتابة محتوى الموقع من قبل لباب',
      status_en: 'Live website',
      status_ar: 'موقع مباشر',
      site_domain: domain,
      tags_en: tagsEn,
      tags_ar: tagsAr,
      stats_en: ['Content writing ownership', 'Live website', domain],
      stats_ar: ['كتابة المحتوى بالكامل', 'موقع مباشر', domain],
      impact_en: [
        'Wrote clear visitor-facing website copy aligned with the organization identity',
        'Structured the message so audiences can understand the purpose quickly',
        'Prepared concise calls to action and readable service or program descriptions'
      ],
      impact_ar: [
        'كتابة محتوى واضح للزائر ومتوافق مع هوية الجهة',
        'تنظيم الرسالة حتى يفهم الجمهور هدف الموقع بسرعة',
        'صياغة دعوات تفاعل مباشرة ووصف واضح للخدمات أو البرامج'
      ],
      site_entries_en: [{ label: domain, url }],
      site_entries_ar: [{ label: domain, url }],
      browser_label_en: domain,
      browser_label_ar: domain,
      cta_en: 'Visit Website',
      cta_ar: 'زيارة الموقع',
      showcase_group: 'website',
      featured: false,
      is_website: true,
      priority: 1
    }
  ];

  const contentCalendarProject = [
    'Social Media Content Calendar',
    'Created a monthly multi-platform social media content calendar for a fictional solar energy brand, showing strategy, weekly themes, platform adaptation, copywriting angles, visual direction, and business-focused CTAs.',
    'تقويم محتوى للسوشيال ميديا',
    'إنشاء تقويم محتوى شهري متعدد المنصات لعلامة طاقة شمسية افتراضية، يوضح الاستراتيجية، محاور الأسابيع، تكييف المحتوى لكل منصة، زوايا الكتابة، الاتجاه البصري، وربط المنشورات بأهداف العمل.',
    'Content Strategy, Social Media Planning, Copywriting, Google Sheets, Facebook, Instagram, LinkedIn',
    'Structured a full monthly content system with strategy, calendar, idea bank, platform adaptation, creative direction, and a simple review workflow.',
    'بناء نظام محتوى شهري متكامل يشمل الاستراتيجية، التقويم، بنك الأفكار، تكييف المحتوى حسب المنصة، الاتجاه الإبداعي، وآلية مراجعة بسيطة.',
    'https://docs.google.com/spreadsheets/d/1ZGFbPach-zDlFGIYngIavbDwUGj5mRrkRlSO4V6uURE/edit?usp=sharing',
    '',
    1,
    {
      kind_en: 'Content Strategy Project',
      kind_ar: 'مشروع استراتيجية محتوى',
      role_en: 'Monthly planning, platform adaptation, copywriting direction, and review workflow',
      role_ar: 'تخطيط شهري، تكييف للمنصات، توجيه كتابة المحتوى، وآلية مراجعة',
      status_en: 'Portfolio sample',
      status_ar: 'نموذج بورتفوليو',
      stats_en: ['Monthly content strategy', 'Facebook, Instagram, LinkedIn', 'Idea bank + review workflow'],
      stats_ar: ['استراتيجية محتوى شهرية', 'Facebook وInstagram وLinkedIn', 'بنك أفكار وآلية مراجعة'],
      impact_en: [
        'Mapped clear goals, audience needs, and content pillars before creating posts',
        'Adapted the same core idea professionally for Facebook, Instagram, and LinkedIn',
        'Connected captions, visual direction, and CTAs to practical business goals'
      ],
      impact_ar: [
        'تحديد الأهداف والجمهور ومحاور المحتوى قبل كتابة المنشورات',
        'تكييف الفكرة الواحدة بشكل احترافي لمنصات Facebook وInstagram وLinkedIn',
        'ربط النصوص والاتجاه البصري وCTA بأهداف عمل قابلة للفهم'
      ],
      site_entries_en: [{ label: 'Open content calendar', url: 'https://docs.google.com/spreadsheets/d/1ZGFbPach-zDlFGIYngIavbDwUGj5mRrkRlSO4V6uURE/edit?usp=sharing' }],
      site_entries_ar: [{ label: 'فتح تقويم المحتوى', url: 'https://docs.google.com/spreadsheets/d/1ZGFbPach-zDlFGIYngIavbDwUGj5mRrkRlSO4V6uURE/edit?usp=sharing' }],
      browser_label_en: 'Google Sheets content calendar',
      browser_label_ar: 'تقويم محتوى على Google Sheets',
      cta_en: 'Open Calendar',
      cta_ar: 'فتح التقويم',
      showcase_group: 'content',
      featured: true,
      is_website: false,
      priority: 0
    }
  ];

  projects.length = 0;
  projects.push(
    contentCalendarProject,
    makeWebsiteContentProject({
      title: 'International Health Organization',
      titleAr: 'منظمة الصحة الدولية',
      descEn: 'Health-focused website content that presents the organization mission, programs, research, training, and public health initiatives in a clear institutional voice.',
      descAr: 'محتوى موقع صحي يقدّم رسالة المنظمة، برامجها، البحث العلمي، التدريب، والمبادرات الصحية العامة بأسلوب مؤسسي واضح.',
      url: 'https://iho-us.org/',
      domain: 'iho-us.org',
      kindEn: 'Health Organization Website',
      kindAr: 'موقع منظمة صحية',
      tagsEn: ['Health content', 'Programs', 'Public trust'],
      tagsAr: ['محتوى صحي', 'برامج ومبادرات', 'ثقة عامة'],
      order: 2
    }),
    makeWebsiteContentProject({
      title: 'International Media Center',
      titleAr: 'المركز الإعلامي الدولي',
      descEn: 'Media and communication website content built around professional identity, media policy, strategic communication, training, and public awareness.',
      descAr: 'محتوى موقع إعلامي واتصالي يوضح الهوية المهنية، السياسات الإعلامية، الاتصال الاستراتيجي، التدريب، وبناء الوعي.',
      url: 'https://imc-us.org/',
      domain: 'imc-us.org',
      kindEn: 'Media Center Website',
      kindAr: 'موقع مركز إعلامي',
      tagsEn: ['Media content', 'Policy', 'Awareness'],
      tagsAr: ['محتوى إعلامي', 'سياسات', 'وعي'],
      order: 3
    }),
    makeWebsiteContentProject({
      title: 'International Federation For Oil and Gas',
      titleAr: 'الاتحاد الدولي للنفط والغاز',
      descEn: 'Energy-sector website content focused on oil, gas, alternative energy, innovation, safety, sustainability, training, and international cooperation.',
      descAr: 'محتوى موقع لقطاع الطاقة يركز على النفط والغاز والطاقة البديلة، الابتكار، السلامة، الاستدامة، التدريب، والتعاون الدولي.',
      url: 'https://ifog-us.org/',
      domain: 'ifog-us.org',
      kindEn: 'Energy Federation Website',
      kindAr: 'موقع اتحاد طاقة',
      tagsEn: ['Energy content', 'Sustainability', 'Training'],
      tagsAr: ['محتوى طاقة', 'استدامة', 'تدريب'],
      order: 4
    }),
    makeWebsiteContentProject({
      title: "International Organization for Women's Rights Defense",
      titleAr: 'المنظمة الدولية للدفاع عن حقوق المرأة',
      descEn: 'Rights-focused content for a women’s rights organization, presenting legal support, awareness, protection from violence, empowerment, and social support.',
      descAr: 'محتوى حقوقي لمنظمة معنية بحقوق المرأة، يقدّم الدعم القانوني، التوعية، الحماية من العنف، التمكين، والدعم الاجتماعي.',
      url: 'https://iowrd-us.org/',
      domain: 'iowrd-us.org',
      kindEn: 'Human Rights Website',
      kindAr: 'موقع حقوقي',
      tagsEn: ['Rights content', 'Empowerment', 'Awareness'],
      tagsAr: ['محتوى حقوقي', 'تمكين', 'توعية'],
      order: 5
    }),
    makeWebsiteContentProject({
      title: 'City Star Bakery',
      titleAr: 'مخبز سيتي ستار',
      descEn: 'Warm brand and product content for a bakery website, supporting the story, menu browsing, product categories, and local customer confidence.',
      descAr: 'محتوى تجاري دافئ لموقع مخبز، يدعم قصة العلامة، تصفح المنيو، أصناف المنتجات، وتعزيز ثقة الزبائن المحليين.',
      url: 'https://citystarbakery.com/',
      domain: 'citystarbakery.com',
      kindEn: 'Business Website',
      kindAr: 'موقع تجاري',
      tagsEn: ['Brand content', 'Menu', 'Products'],
      tagsAr: ['محتوى علامة', 'منيو', 'منتجات'],
      order: 6
    }),
    makeWebsiteContentProject({
      title: 'International Federation For Arbitration',
      titleAr: 'الاتحاد الدولي للتحكيم',
      descEn: 'Professional legal and institutional content explaining arbitration supervision, quality standards, accreditation, memberships, and trust-building services.',
      descAr: 'محتوى قانوني ومؤسسي احترافي يشرح الإشراف على التحكيم، معايير الجودة، الاعتمادات، العضويات، وخدمات بناء الثقة.',
      url: 'https://ifa-us.org/',
      domain: 'ifa-us.org',
      kindEn: 'Arbitration Federation Website',
      kindAr: 'موقع اتحاد تحكيم',
      tagsEn: ['Legal content', 'Accreditation', 'Trust'],
      tagsAr: ['محتوى قانوني', 'اعتمادات', 'ثقة'],
      order: 7
    })
  );
  for (const [cat, name, level, order] of skills) {
    await runStmt('INSERT INTO skills (category, name, level, sort_order) VALUES (?, ?, ?, ?)', [cat, name, level, order]);
  }
  console.log('✓ Skills seeded (refreshed)');


  // ========== PROJECTS (real projects with links) ==========
  await runStmt('DELETE FROM projects'); // Force refresh to embed images
  const legacyProjects = [
    [
      'International Organization Websites',
      'Designed and developed multiple websites for international organizations including the International Federation for Arbitration, International Health Organization, United Organization, Royal American University, and International Federation for Artificial Intelligence.',
      'المواقع الإلكترونية للمنظمات الدولية',
      'قمت بتصميم وتطوير مواقع إلكترونية متعددة لمنظمات دولية تشمل الاتحاد الدولي للتحكيم، منظمة الصحة الدولية، المنظمة المتحدة، الجامعة الأمريكية الملكية، والاتحاد الدولي للذكاء الاصطناعي.',
      'WordPress, PHP, MySQL, HTML5, CSS3, JavaScript, SEO',
      'Delivered 5+ professional websites for international organizations. Wrote all website content ensuring clarity and alignment with organizational goals.',
      'تسليم أكثر من 5 مواقع احترافية لمنظمات دولية. كتابة جميع محتويات المواقع مع ضمان الوضوح.',
      'https://ifa-us.org, https://iho-us.org, https://imc-us.org',
      '/images/projects/1-org.png',
      1
    ],
    [
      'Bazari — Classified Ads Platform',
      'Designed and developed Bazari, a classified listing ads platform using WordPress with advanced customizations. Integrated SMS verification for user registration.',
      'بازاري — منصة الإعلانات المبوبة',
      'قمت بتصميم وتطوير بازاري، منصة إعلانات مبوبة باستخدام WordPress مع تخصيصات متقدمة. تم دمج التحقق عبر الرسائل القصيرة لتسجيل المستخدمين.',
      'WordPress, WooCommerce, PHP, REST API, SMS Integration',
      'Built fully functional classified ads platform. Integrated SMS verification reducing fake accounts by 85%.',
      'بناء منصة إعلانات مبوبة كاملة الوظائف. دمج التحقق عبر الرسائل القصيرة مما قلل الحسابات المزيفة بنسبة 85%.',
      'https://lyabaiana.com',
      '/images/projects/2-bazari.png',
      2
    ],
    [
      'City Star Bakery Website',
      'Designed and developed a professional website for City Star Bakery, featuring a modern responsive design, product showcases, and SEO-optimized content to boost online presence.',
      'موقع مخبز سيتي ستار',
      'قمت بتصميم وتطوير موقع إلكتروني احترافي لمخبز سيتي ستار، يتميز بتصميم حديث وعرض المنتجات ومحتوى محسّن.',
      'WordPress, HTML5, CSS3, JavaScript, SEO',
      'Created a visually appealing and fast website. Optimized for search engines boosting visibility.',
      'إنشاء موقع جذاب بصرياً وسريع. تحسين لمحركات البحث لزيادة الظهور.',
      'https://citystarbakery.com',
      '/images/projects/3-bakery.png',
      3
    ],
    [
      'Supply Chain Management System',
      'Developed a comprehensive system to streamline inventory control, order processing, and supplier management. Features real-time tracking across multiple warehouses.',
      'نظام إدارة سلسلة التوريد',
      'تطوير نظام شامل لتبسيط مراقبة المخزون ومعالجة الطلبات وإدارة الموردين. يتميز بالتتبع في الوقت الحقيقي.',
      'Microsoft SQL Server, Database Design, Backend',
      'Real-time inventory tracking across multiple warehouses. Implemented indexing reducing response time by 50%.',
      'تتبع المخزون في الوقت الحقيقي عبر مستودعات متعددة. تنفيذ تحسينات الفهرسة مما قلل وقت الاستجابة بنسبة 50%.',
      '',
      '/images/projects/4-supply.png',
      4
    ]
  ];
  for (const [title, desc_en, title_ar, desc_ar, tech, achieve_en, achieve_ar, url, img_url, order, meta = {}] of projects) {
    await runStmt(
      'INSERT INTO projects (title, description, technologies, achievements, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title, JSON.stringify({
        desc_en, desc_ar, title_ar, achieve_en, achieve_ar, url,
        ...meta
      }), tech, achieve_en, img_url, order]
    );
  }
  console.log('✓ Projects seeded (refreshed)');

  // ========== EXPERIENCE (real CV data) ==========
  const expCount = await queryCount('SELECT COUNT(*) as count FROM experience');
  if (expCount === 0) {
    const experience = [
      [
        'Logistics Operations & Documentation',
        'Sikka AL Salama (Contract with U.S. Army)',
        'Jan 2025 — Present',
        JSON.stringify({
          desc_en: 'Working in logistics for the U.S. Army, ensuring smooth supply chain operations and accurate documentation. Handling and organizing logistics documentation, maintaining accuracy and compliance with operational standards. Assisting daily logistics operations by coordinating shipments, tracking inventory movements, and maintaining clear communication.',
          desc_ar: 'العمل في الخدمات اللوجستية للجيش الأمريكي، وضمان سلاسة عمليات سلسلة التوريد والتوثيق الدقيق. التعامل مع وتنظيم الوثائق اللوجستية، والحفاظ على الدقة والامتثال لمعايير التشغيل. المساعدة في العمليات اللوجستية اليومية من خلال تنسيق الشحنات وتتبع حركات المخزون والحفاظ على التواصل الواضح.',
          title_ar: 'عمليات لوجستية وتوثيق',
          company_ar: 'سكة السلامة (عقد مع الجيش الأمريكي)',
          period_ar: 'يناير 2025 — الحالي',
          location: 'Erbil, Iraq'
        }),
        1
      ],
      [
        'Remote Web Designer & Content Writer',
        'Aspire Agency',
        'May 2024 — Sep 2024',
        JSON.stringify({
          desc_en: 'Designed and developed responsive WordPress websites with a focus on user experience and clean UI. Created high-quality written content for web pages and landing pages. Optimized website structure and content for SEO. Collaborated remotely with clients to gather requirements and deliver updates.',
          desc_ar: 'تصميم وتطوير مواقع WordPress متجاوبة مع التركيز على تجربة المستخدم والواجهة النظيفة. إنشاء محتوى مكتوب عالي الجودة لصفحات الويب وصفحات الهبوط. تحسين هيكل الموقع والمحتوى لمحركات البحث. التعاون عن بُعد مع العملاء لجمع المتطلبات وتقديم التحديثات.',
          title_ar: 'مصممة ويب وكاتبة محتوى عن بُعد',
          company_ar: 'وكالة أسباير',
          period_ar: 'مايو 2024 — سبتمبر 2024',
          location: 'Erbil, Iraq'
        }),
        2
      ],
      [
        'Website Designer & Developer',
        'Bazari Company',
        'Dec 2024 — Apr 2025',
        JSON.stringify({
          desc_en: 'Designed and developed the Bazari website, a classified listing ads platform, using WordPress with advanced customizations. Integrated SMS verification for user registration, ensuring secure and smooth user experiences while working remotely.',
          desc_ar: 'تصميم وتطوير موقع بازاري، منصة إعلانات مبوبة، باستخدام WordPress مع تخصيصات متقدمة. دمج التحقق عبر الرسائل القصيرة لتسجيل المستخدمين، مما يضمن تجارب آمنة وسلسة أثناء العمل عن بُعد.',
          title_ar: 'مصممة ومطورة مواقع',
          company_ar: 'شركة بازاري',
          period_ar: 'ديسمبر 2024 — أبريل 2025',
          location: 'Sulaymaniyah, Iraq (Remote)'
        }),
        3
      ],
      [
        'IT Support & WordPress Website Designer',
        'International Organization for Human Rights (IOHR)',
        'Jun 2024 — Dec 2024',
        JSON.stringify({
          desc_en: 'Designed and managed 5+ websites for international organizations including International Federation for Arbitration, International Health Organization, United Organization, Royal American University, and International Federation for Artificial Intelligence. Wrote website content, delivered IT support, and managed SEO and Analytics.',
          desc_ar: 'تصميم وإدارة أكثر من 5 مواقع لمنظمات دولية تشمل الاتحاد الدولي للتحكيم، منظمة الصحة الدولية، المنظمة المتحدة، الجامعة الأمريكية الملكية، والاتحاد الدولي للذكاء الاصطناعي. كتابة محتوى المواقع وتقديم الدعم التقني وإدارة تحسين محركات البحث والتحليلات.',
          title_ar: 'دعم تقني ومصممة مواقع WordPress',
          company_ar: 'المنظمة الدولية لحقوق الإنسان',
          period_ar: 'يونيو 2024 — ديسمبر 2024',
          location: 'Erbil, Iraq'
        }),
        4
      ],
      [
        'Dispatcher & CRM Specialist',
        'Talabat — High Performance Company',
        'Jul 2023 — Mar 2024',
        JSON.stringify({
          desc_en: 'Coordinated and managed dispatch operations, ensuring timely and efficient delivery. Utilized CRM tools to maintain and enhance customer relationships. Collaborated with cross-functional teams to optimize communication and workflow efficiency. Implemented strategies to improve customer satisfaction.',
          desc_ar: 'تنسيق وإدارة عمليات الإرسال، وضمان التسليم في الوقت المناسب وبكفاءة. استخدام أدوات إدارة علاقات العملاء للحفاظ على علاقات العملاء وتعزيزها. التعاون مع الفرق متعددة الوظائف لتحسين كفاءة الاتصال وسير العمل. تنفيذ استراتيجيات لتحسين رضا العملاء.',
          title_ar: 'منسقة إرسال ومتخصصة CRM',
          company_ar: 'طلبات — شركة عالية الأداء',
          period_ar: 'يوليو 2023 — مارس 2024',
          location: 'Erbil, Iraq'
        }),
        5
      ],
    ];
    for (const [title, company, period, desc, order] of experience) {
      await runStmt(
        'INSERT INTO experience (title, company, period, description, sort_order) VALUES (?, ?, ?, ?, ?)',
        [title, company, period, desc, order]
      );
    }
    console.log('✓ Experience seeded');
  }

  console.log('\n✅ Database seeded successfully!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
