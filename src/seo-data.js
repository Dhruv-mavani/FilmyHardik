// Single source of truth for everything search engines, answer engines and AI agents read.
// Used by the FAQ section, the JSON-LD/robots/sitemap/llms.txt generated in vite.config.js, and the agent tools.

export const SITE = {
  name: 'Filmy Hardik',
  handle: '@filmyhardik',
  title: 'Filmyhardik | Funny content creator, 350M+ views',
  tagline: 'Brands pay me to be funny. Millions watch for free.',
  description:
    'Filmy Hardik is a funny content creator with 350M+ views across Instagram, YouTube, Snapchat and Facebook. Brands like Head & Shoulders, Red Label Chai and Rapido hire him to turn ads into content people finish watching.',
  email: 'filmyyhardik@gmail.com',
  phone: '+91 87330 64171',
  phoneTel: '+918733064171',
  socials: [
    { name: 'Instagram', url: 'https://www.instagram.com/filmyhardik/', handle: '@filmyhardik', audience: '50k+ followers' },
    { name: 'YouTube', url: 'https://www.youtube.com/@filmyyhardik', handle: '@filmyyhardik', audience: '25k+ subscribers' },
    { name: 'Snapchat', url: 'https://www.snapchat.com/@filmyhardik', handle: '@filmyhardik', audience: '11k+ followers' },
    { name: 'Facebook', url: 'https://www.facebook.com/Filmyhardik/', handle: 'Filmyhardik', audience: 'Reels page' },
  ],
  stats: { totalViews: '350M+', instagramViews: '300M+', otherViews: '50M+', brands: 19 },
  // [brand, result]
  brands: [
    ['Head & Shoulders', '9M+ views'], ['Red Label Chai', '4M+ views'], ['Rapido', '450k+ views'], ['Mamaearth', '100k+ views'],
    ['Jio Hotstar', '100k+ views'], ['The Solved Skin', '80k+ views'], ['BruGold Coffee', '80k+ views'], ['Hajmola', '70k+ views'],
    ['Atomberg', '70k+ views'], ['Garnier Men', '50k+ views'], ['Bigboss Season 18', '50k+ views'], ['The Bear House', '20k+ views'],
    ['Loyka', '20k+ views'], ['DTDC Courier', '20k+ views'], ['Zouk', '20k+ views'], ['ChatGPT', '15k+ story views'],
    ['UP Warriorz', 'event'], ['Realme', 'story'], ['Myntra Creator School', 'event'],
  ],
};

const brandNames = SITE.brands.map((b) => b[0]);

// Written as direct, self-contained answers: this is the text answer engines quote.
export const FAQ = [
  {
    q: 'Who is Filmy Hardik?',
    a: `Filmy Hardik (${SITE.handle}) is a funny content creator who turns brand ads into short videos people actually finish watching. He has ${SITE.stats.totalViews} total views across Instagram, YouTube, Snapchat and Facebook.`,
  },
  {
    q: 'How many views and followers does Filmy Hardik have?',
    a: `${SITE.stats.totalViews} total views: ${SITE.stats.instagramViews} on Instagram and ${SITE.stats.otherViews} on other platforms. Audience: ${SITE.socials.slice(0, 3).map((s) => `${s.audience} on ${s.name}`).join(', ')}, plus a Facebook Reels page.`,
  },
  {
    q: 'Which brands has Filmy Hardik worked with?',
    a: `${SITE.stats.brands} brands and events, including ${brandNames.join(', ')}.`,
  },
  {
    q: 'What was his biggest brand campaign?',
    a: 'The Head & Shoulders campaign is the biggest so far with 9M+ views and still counting. Red Label Chai reached 4M+ views on one campaign.',
  },
  {
    q: 'How can a brand collaborate with Filmy Hardik?',
    a: `Send the brief by email to ${SITE.email} or call ${SITE.phone}. The contact form on this page opens your email app with the brief filled in.`,
  },
  {
    q: 'What kind of content does Filmy Hardik make?',
    a: 'Funny, entertainment-first branded content: ads reworked into skits and short videos made to be shared, published on Instagram Reels, YouTube, Snapchat and Facebook Reels.',
  },
];

export const siteUrlFromEnv = (env = {}) => {
  const u = env.SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
  return u ? u.replace(/\/$/, '') : '';
};

/** JSON-LD graph: Person + WebSite + ProfilePage + FAQPage (URLs only when the site URL is known). */
export function buildJsonLd(url = '') {
  const id = (frag) => (url ? `${url}/#${frag}` : `#${frag}`);
  const person = {
    '@type': 'Person',
    '@id': id('person'),
    name: SITE.name,
    alternateName: ['Filmyhardik', 'filmyyhardik'],
    jobTitle: 'Content creator',
    description: SITE.description,
    email: `mailto:${SITE.email}`,
    telephone: SITE.phoneTel,
    knowsAbout: ['Comedy content', 'Short-form video', 'Brand collaborations', 'Influencer marketing', 'Instagram Reels'],
    sameAs: SITE.socials.map((s) => s.url),
    ...(url && { url, image: `${url}/og-image.png` }),
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'WebSite',
        '@id': id('website'),
        name: 'Filmyhardik',
        description: SITE.description,
        inLanguage: 'en',
        publisher: { '@id': id('person') },
        ...(url && { url }),
      },
      {
        '@type': 'ProfilePage',
        '@id': id('profile'),
        name: SITE.title,
        about: { '@id': id('person') },
        mainEntity: { '@id': id('person') },
        isPartOf: { '@id': id('website') },
        ...(url && { url }),
      },
      {
        '@type': 'FAQPage',
        '@id': id('faq'),
        mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };
}

export function buildLlmsTxt(url = '', full = false) {
  const L = [];
  L.push(`# ${SITE.name} (${SITE.handle})`, '', `> ${SITE.description}`, '');
  L.push('## Key facts', '');
  L.push(`- Total views: ${SITE.stats.totalViews} (${SITE.stats.instagramViews} Instagram, ${SITE.stats.otherViews} other platforms)`);
  SITE.socials.forEach((s) => L.push(`- ${s.name}: ${s.url} (${s.handle}, ${s.audience})`));
  L.push(`- Brands and events: ${SITE.stats.brands}`);
  L.push(`- Collaboration contact: ${SITE.email}, ${SITE.phone}`, '');
  if (url) L.push('## Pages', '', `- [Home](${url}/): profile, numbers, platforms, brand results, FAQ and contact form`, '');
  if (full) {
    L.push('## Brand results', '');
    SITE.brands.forEach(([b, r]) => L.push(`- ${b}: ${r}`));
    L.push('', '## FAQ', '');
    FAQ.forEach((f) => L.push(`### ${f.q}`, '', f.a, ''));
  } else if (url) {
    L.push('## Optional', '', `- [Full details for language models](${url}/llms-full.txt)`, '');
  }
  return L.join('\n');
}

export function buildRobots(url = '') {
  const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider', 'Meta-ExternalAgent'];
  const out = ['User-agent: *', 'Allow: /', ''];
  bots.forEach((b) => out.push(`User-agent: ${b}`, 'Allow: /', ''));
  if (url) out.push(`Sitemap: ${url}/sitemap.xml`, '');
  return out.join('\n');
}

export function buildSitemap(url) {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`;
}
