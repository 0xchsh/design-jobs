export type Job = {
  title: string;
  company: string;
  location: string;
  url: string;
  department: string;
};

// Real listings scraped from company career pages — March 2026
export const jobs: Job[] = [
  // ── Anthropic ──────────────────────────────────────────────
  {
    title: "Product Designer",
    company: "Anthropic",
    location: "San Francisco | New York | Seattle",
    url: "https://job-boards.greenhouse.io/anthropic/jobs/5152817008",
    department: "Design",
  },
  {
    title: "Product Designer, Claude Code",
    company: "Anthropic",
    location: "San Francisco | New York",
    url: "https://job-boards.greenhouse.io/anthropic/jobs/5025976008",
    department: "Product",
  },
  {
    title: "Product Designer, Claude Experiences",
    company: "Anthropic",
    location: "San Francisco | New York",
    url: "https://job-boards.greenhouse.io/anthropic/jobs/4929512008",
    department: "Product",
  },
  {
    title: "Product Designer, Enterprise",
    company: "Anthropic",
    location: "San Francisco | New York",
    url: "https://job-boards.greenhouse.io/anthropic/jobs/5055600008",
    department: "Product",
  },
  {
    title: "Product Designer, Growth (B2B)",
    company: "Anthropic",
    location: "San Francisco | New York",
    url: "https://job-boards.greenhouse.io/anthropic/jobs/4504646008",
    department: "Product",
  },
  {
    title: "Product Designer, Growth",
    company: "Anthropic",
    location: "San Francisco | New York",
    url: "https://job-boards.greenhouse.io/anthropic/jobs/4963443008",
    department: "Product",
  },
  {
    title: "Founding Design Engineer, AI Capability Development",
    company: "Anthropic",
    location: "San Francisco | New York",
    url: "https://job-boards.greenhouse.io/anthropic/jobs/4957323008",
    department: "Research & Engineering",
  },
  {
    title: "Design Engineer, AI Capability Development (Education Labs)",
    company: "Anthropic",
    location: "San Francisco | New York",
    url: "https://job-boards.greenhouse.io/anthropic/jobs/5097186008",
    department: "Research & Engineering",
  },
  {
    title: "Design Engineer, Web",
    company: "Anthropic",
    location: "San Francisco",
    url: "https://job-boards.greenhouse.io/anthropic/jobs/5116525008",
    department: "Brand",
  },

  // ── OpenAI ─────────────────────────────────────────────────
  {
    title: "Product Designer, ChatGPT",
    company: "OpenAI",
    location: "San Francisco",
    url: "https://openai.com/careers/product-designer-chatgpt-san-francisco/",
    department: "Product Design",
  },
  {
    title: "Product Designer, Codex",
    company: "OpenAI",
    location: "San Francisco",
    url: "https://openai.com/careers/product-designer-codex-san-francisco/",
    department: "Product Design",
  },
  {
    title: "Product Designer, Growth",
    company: "OpenAI",
    location: "San Francisco",
    url: "https://openai.com/careers/product-designer-growth-san-francisco/",
    department: "Product Design",
  },
  {
    title: "Product Designer, Business Products",
    company: "OpenAI",
    location: "San Francisco",
    url: "https://openai.com/careers/product-designer-business-products-san-francisco/",
    department: "Product Design",
  },
  {
    title: "Product Designer, Monetization Platform",
    company: "OpenAI",
    location: "San Francisco",
    url: "https://openai.com/careers/product-designer-monetization-platform-san-francisco/",
    department: "Product Design",
  },
  {
    title: "Product Designer, Platform & Tools",
    company: "OpenAI",
    location: "San Francisco",
    url: "https://openai.com/careers/product-designer-platform-and-tools-san-francisco/",
    department: "Product Design",
  },
  {
    title: "Lead Product Designer, Health AI",
    company: "OpenAI",
    location: "San Francisco",
    url: "https://openai.com/careers/lead-product-designer-health-ai-san-francisco/",
    department: "Product Design",
  },
  {
    title: "Content Designer",
    company: "OpenAI",
    location: "San Francisco",
    url: "https://openai.com/careers/content-designer-san-francisco/",
    department: "Product Design",
  },
  {
    title: "Designer, Creative Studio",
    company: "OpenAI",
    location: "San Francisco",
    url: "https://openai.com/careers/designer-creative-studio-san-francisco/",
    department: "Creative",
  },
  {
    title: "Executive Producer, Design",
    company: "OpenAI",
    location: "San Francisco",
    url: "https://openai.com/careers/executive-producer-design-san-francisco/",
    department: "Production",
  },

  // ── Google DeepMind ────────────────────────────────────────
  {
    title: "AI Product Designer, Gemini App UX",
    company: "Google DeepMind",
    location: "Mountain View, CA",
    url: "https://job-boards.greenhouse.io/deepmind/jobs/7195591",
    department: "Gemini",
  },
  {
    title: "Staff UX Designer, Google Antigravity",
    company: "Google DeepMind",
    location: "United States",
    url: "https://job-boards.greenhouse.io/deepmind/jobs/7416685",
    department: "Gemini",
  },
  {
    title: "Senior Product Designer, AI Studio",
    company: "Google DeepMind",
    location: "United States",
    url: "https://job-boards.greenhouse.io/deepmind/jobs/7059256",
    department: "Gemini",
  },
  {
    title: "Senior AI Product Designer, Growth & Discovery",
    company: "Google DeepMind",
    location: "United States",
    url: "https://job-boards.greenhouse.io/deepmind/jobs/7120703",
    department: "Gemini",
  },

  // ── Meta ───────────────────────────────────────────────────
  {
    title: "Product Designer — Generative AI",
    company: "Meta",
    location: "Menlo Park, CA",
    url: "https://www.metacareers.com/v2/jobs/178106124661005/",
    department: "AI / Technology",
  },
  {
    title: "Product Designer, GenAI",
    company: "Meta",
    location: "Menlo Park, CA",
    url: "https://www.metacareers.com/jobs/1013739133430349",
    department: "AI / Technology",
  },
  {
    title: "Product Design Prototyper",
    company: "Meta",
    location: "Menlo Park, CA",
    url: "https://www.metacareers.com/jobs/412506247949277",
    department: "Reality Labs",
  },

  // ── Figma ──────────────────────────────────────────────────
  {
    title: "Product Designer, AI",
    company: "Figma",
    location: "United States",
    url: "https://job-boards.greenhouse.io/figma/jobs/5575171004",
    department: "Design",
  },
  {
    title: "Product Designer, Developer Tools",
    company: "Figma",
    location: "London, UK",
    url: "https://job-boards.greenhouse.io/figma/jobs/5657064004",
    department: "Design",
  },
  {
    title: "Product Designer — Design, Dev, & AI Tools",
    company: "Figma",
    location: "United States",
    url: "https://boards.greenhouse.io/figma/jobs/5711468004",
    department: "Design",
  },
  {
    title: "Product Designer, AI Models",
    company: "Figma",
    location: "San Francisco",
    url: "https://boards.greenhouse.io/figma/jobs/5711913004",
    department: "Design",
  },
  {
    title: "Product Designer, Growth & Monetization",
    company: "Figma",
    location: "San Francisco",
    url: "https://boards.greenhouse.io/figma/jobs/5711595004",
    department: "Design",
  },
  {
    title: "Product Designer — Figma Weave",
    company: "Figma",
    location: "Tel Aviv, Israel",
    url: "https://boards.greenhouse.io/figma/jobs/5753515004",
    department: "Figma Weave",
  },
  {
    title: "Design Program Manager, AI",
    company: "Figma",
    location: "San Francisco",
    url: "https://boards.greenhouse.io/figma/jobs/5799555004",
    department: "Design",
  },
  {
    title: "Director, Design — Communication Tools",
    company: "Figma",
    location: "San Francisco",
    url: "https://boards.greenhouse.io/figma/jobs/5661397004",
    department: "Design",
  },
  {
    title: "Manager, Product Design",
    company: "Figma",
    location: "San Francisco",
    url: "https://boards.greenhouse.io/figma/jobs/5790585004",
    department: "Design",
  },

  // ── Vercel ─────────────────────────────────────────────────
  {
    title: "Design Engineer",
    company: "Vercel",
    location: "Remote — United States",
    url: "https://vercel.com/careers/design-engineer-us-5709080004",
    department: "Design",
  },
  {
    title: "Senior Brand Designer",
    company: "Vercel",
    location: "Remote — US, Argentina",
    url: "https://vercel.com/careers/senior-brand-designer-latam-us-5579560004",
    department: "Design",
  },
  {
    title: "Senior Product Designer",
    company: "Vercel",
    location: "Remote — United States",
    url: "https://vercel.com/careers/senior-product-designer-us-5735407004",
    department: "Design",
  },
  {
    title: "Site Engineer",
    company: "Vercel",
    location: "Remote — United States",
    url: "https://job-boards.greenhouse.io/vercel/jobs/5732855004",
    department: "Design",
  },

  // ── Linear ─────────────────────────────────────────────────
  {
    title: "Designer, Web & Brand",
    company: "Linear",
    location: "Remote — Europe",
    url: "https://jobs.ashbyhq.com/Linear/4f10c2ca-d19a-42b5-9e1f-d1794c43dd89",
    department: "Magic",
  },
  {
    title: "Designer, Web & Brand",
    company: "Linear",
    location: "Remote — North America",
    url: "https://jobs.ashbyhq.com/Linear/4dc6be78-ccf0-45c8-bd98-a061a9e2ffe4",
    department: "Magic",
  },
  {
    title: "Senior / Staff Product Designer",
    company: "Linear",
    location: "Remote — North America",
    url: "https://jobs.ashbyhq.com/Linear/a264869e-f058-487c-ab7f-9b77dffa427c",
    department: "Design",
  },

  // ── Cursor ─────────────────────────────────────────────────
  {
    title: "Brand Designer",
    company: "Cursor",
    location: "New York",
    url: "https://cursor.com/careers/brand-designer",
    department: "Design",
  },
  {
    title: "Design Engineer",
    company: "Cursor",
    location: "San Francisco | New York",
    url: "https://cursor.com/careers/design-engineer",
    department: "Design",
  },
  {
    title: "Motion Designer",
    company: "Cursor",
    location: "San Francisco | New York",
    url: "https://cursor.com/careers/motion-designer",
    department: "Design",
  },
  {
    title: "Product Designer",
    company: "Cursor",
    location: "San Francisco | New York",
    url: "https://cursor.com/careers/product-designer",
    department: "Design",
  },

  // ── Perplexity ─────────────────────────────────────────────
  {
    title: "Lead Design Engineer — Growth & Marketing",
    company: "Perplexity",
    location: "San Francisco | New York",
    url: "https://jobs.ashbyhq.com/perplexity/30d27c9c-6d6f-4614-b6b3-35bd3ce641a9",
    department: "Product Engineering",
  },
  {
    title: "Design Engineer (iOS)",
    company: "Perplexity",
    location: "San Francisco",
    url: "https://jobs.ashbyhq.com/Perplexity",
    department: "Product Engineering",
  },
  {
    title: "Brand Designer",
    company: "Perplexity",
    location: "San Francisco",
    url: "https://jobs.ashbyhq.com/Perplexity",
    department: "Design",
  },
  {
    title: "Frontend Engineer — Design Systems",
    company: "Perplexity",
    location: "San Francisco",
    url: "https://jobs.ashbyhq.com/perplexity/36afb111-5c9c-4aec-9066-a2beb6f25f4b",
    department: "Product Engineering",
  },

  // ── Mistral AI ─────────────────────────────────────────────
  {
    title: "Product Designer",
    company: "Mistral AI",
    location: "Paris, France",
    url: "https://jobs.lever.co/mistral/6282ba64-f05b-4d8f-ac8e-c367592604e1",
    department: "Product Design",
  },
  {
    title: "Product Designer, Web Apps",
    company: "Mistral AI",
    location: "Paris, France",
    url: "https://jobs.lever.co/mistral/282e0150-5664-48e4-aa41-843493efdd4c",
    department: "Web Apps",
  },
  {
    title: "Product Designer, Mistral Code",
    company: "Mistral AI",
    location: "Paris, France",
    url: "https://jobs.lever.co/mistral/dc06d3cf-cd4e-48a3-9e87-d44cddc172f5",
    department: "Mistral Code",
  },
  {
    title: "Product Designer, AI Studio",
    company: "Mistral AI",
    location: "Paris, France",
    url: "https://jobs.lever.co/mistral/1b4158ae-ae7d-42a1-8b00-424353ebd730",
    department: "AI Studio",
  },

  // ── Runway ─────────────────────────────────────────────────
  {
    title: "Design Engineer",
    company: "Runway",
    location: "Remote",
    url: "https://job-boards.greenhouse.io/runwayml/jobs/4360272005",
    department: "Runway Labs",
  },
  {
    title: "Art Director",
    company: "Runway",
    location: "Remote",
    url: "https://job-boards.greenhouse.io/runwayml/jobs/4648129005",
    department: "Marketing & Creative",
  },

  // ── Replit ─────────────────────────────────────────────────
  {
    title: "Brand Design Lead",
    company: "Replit",
    location: "Foster City, CA (Hybrid)",
    url: "https://jobs.ashbyhq.com/replit/c5950df5-06dd-4d11-b0d6-1f7024754d0f",
    department: "Brand",
  },
  {
    title: "Brand Producer",
    company: "Replit",
    location: "Foster City, CA (Hybrid)",
    url: "https://jobs.ashbyhq.com/replit/78483be0-a2bc-4777-b09b-67b06173e98a",
    department: "Brand",
  },
  {
    title: "Staff Product Designer",
    company: "Replit",
    location: "Foster City, CA (Hybrid)",
    url: "https://jobs.ashbyhq.com/replit/172cc08a-3cf7-43cd-b392-4e48f7844a65",
    department: "Product Design",
  },
  {
    title: "Staff Product Designer, Design System",
    company: "Replit",
    location: "Foster City, CA (Hybrid)",
    url: "https://jobs.ashbyhq.com/replit/f98d1b7c-732c-42c3-8fad-f523314c69dd",
    department: "Product Design",
  },
  {
    title: "Staff Product Designer, Visual Design",
    company: "Replit",
    location: "Foster City, CA (Hybrid)",
    url: "https://jobs.ashbyhq.com/replit/06c065ff-1761-4d93-bfec-14308128d426",
    department: "Product Design",
  },
  {
    title: "Design Engineer",
    company: "Replit",
    location: "Foster City, CA (Hybrid)",
    url: "https://jobs.ashbyhq.com/replit/8cebc86f-dbc7-4915-95a6-677b2278e476",
    department: "Engineering",
  },

  // ── Character.ai ───────────────────────────────────────────
  {
    title: "Product Designer",
    company: "Character.ai",
    location: "Redwood City, CA",
    url: "https://jobs.ashbyhq.com/character/344e6351-d8c1-4bfa-8672-f9f2faf5a1c6",
    department: "Product",
  },

  // ── Adept AI ───────────────────────────────────────────────
  {
    title: "Product Designer",
    company: "Adept AI",
    location: "San Francisco",
    url: "https://startup.jobs/product-designer-adept-3218608",
    department: "Design",
  },
];
