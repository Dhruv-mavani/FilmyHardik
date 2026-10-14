// Agentic browsing: expose the site's actions as structured tools to browser agents.
// Uses the WebMCP draft API (navigator.modelContext) when the browser provides it; a no-op everywhere else.
import { FAQ, SITE } from './seo-data';

const json = (data) => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] });

export function registerAgentTools() {
  const mc = typeof navigator !== 'undefined' && navigator.modelContext;
  if (!mc || !mc.registerTool) return () => {};

  const tools = [
    {
      name: 'get_creator_profile',
      description: 'Facts about Filmy Hardik: what he does, total views, audience per platform, social links and contact details.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () =>
        json({ name: SITE.name, description: SITE.description, stats: SITE.stats, platforms: SITE.socials, contact: { email: SITE.email, phone: SITE.phone } }),
    },
    {
      name: 'list_brand_collaborations',
      description: 'Brands and events Filmy Hardik has worked with, with the result of each campaign.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => json(SITE.brands.map(([brand, result]) => ({ brand, result }))),
    },
    {
      name: 'answer_faq',
      description: 'Frequently asked questions about Filmy Hardik and how to collaborate with him.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => json(FAQ),
    },
    {
      name: 'prepare_collab_brief',
      description: 'Fill the collaboration brief form on the page and return the ready-to-send mailto link. Does not send anything.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Sender name' },
          brand: { type: 'string', description: 'Brand or company' },
          brief: { type: 'string', description: 'Product, timeline and platforms' },
        },
        required: ['brief'],
      },
      execute: async ({ name = '', brand = '', brief = '' }) => {
        const set = (id, value) => {
          const el = document.getElementById(id);
          if (!el) return;
          const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
          Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value); // lets React see the change
          el.dispatchEvent(new Event('input', { bubbles: true }));
        };
        set('f-name', name); set('f-brand', brand); set('f-brief', brief);
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        await new Promise((r) => setTimeout(r, 50));
        return json({ mailto: document.getElementById('send-brief')?.getAttribute('href') || null, note: 'Form filled. The user must press "Email my brief" to send.' });
      },
    },
  ];

  const handles = tools.map((t) => { try { return mc.registerTool(t); } catch { return null; } });
  return () => handles.forEach((h) => { try { h?.unregister?.(); } catch { /* ignore */ } });
}
