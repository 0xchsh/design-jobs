import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

// ── Types ──────────────────────────────────────────────────────────

type Job = {
  title: string;
  company: string;
  location: string;
  url: string;
  department: string;
};

// Greenhouse: jobs list has no departments — title-only filtering
type GreenhouseJob = {
  id: number;
  title: string;
  location: { name: string };
  absolute_url: string;
};

// Ashby: uses `department` and `team` fields
type AshbyJob = {
  id: string;
  title: string;
  location: string;
  department: string;
  team: string;
  jobUrl: string;
};

// Lever: uses `categories` object
type LeverJob = {
  id: string;
  text: string;
  categories: { location: string; team: string; department: string };
  hostedUrl: string;
};

// ── Company configs ────────────────────────────────────────────────

type CompanyConfig =
  | { company: string; platform: "greenhouse"; boardToken: string; careersUrl?: string }
  | { company: string; platform: "ashby"; orgSlug: string; careersUrl?: string }
  | { company: string; platform: "lever"; orgSlug: string; careersUrl?: string }
  | { company: string; platform: "custom"; existingJobs: true };

// Maps company → careers page URL (for linking to company sites instead of ATS)
const CAREERS_URLS: Record<string, string> = {
  Anthropic: "https://www.anthropic.com/careers",
  "Google DeepMind": "https://deepmind.google/about/careers/",
  Figma: "https://www.figma.com/careers/",
  Vercel: "https://vercel.com/careers",
  Runway: "https://runwayml.com/careers/",
  Stripe: "https://stripe.com/jobs",
  "Scale AI": "https://scale.com/careers",
  "Together AI": "https://www.together.ai/careers",
  Linear: "https://linear.app/careers",
  Perplexity: "https://www.perplexity.ai/hub/careers",
  Replit: "https://replit.com/site/careers",
  "Character.ai": "https://character.ai/careers",
  Pika: "https://pika.art/careers",
  ElevenLabs: "https://elevenlabs.io/careers",
  Ramp: "https://ramp.com/careers",
  "Mistral AI": "https://mistral.ai/careers",
  Cohere: "https://cohere.com/careers",
};

const companies: CompanyConfig[] = [
  // Greenhouse
  { company: "Anthropic", platform: "greenhouse", boardToken: "anthropic" },
  { company: "Google DeepMind", platform: "greenhouse", boardToken: "deepmind" },
  { company: "Figma", platform: "greenhouse", boardToken: "figma" },
  { company: "Vercel", platform: "greenhouse", boardToken: "vercel" },
  { company: "Runway", platform: "greenhouse", boardToken: "runwayml" },
  { company: "Stripe", platform: "greenhouse", boardToken: "stripe" },
  { company: "Scale AI", platform: "greenhouse", boardToken: "scaleai" },
  { company: "Together AI", platform: "greenhouse", boardToken: "togetherai" },
  { company: "Stability AI", platform: "greenhouse", boardToken: "stabilityai" },
  { company: "Inflection AI", platform: "greenhouse", boardToken: "inflectionai" },
  { company: "xAI", platform: "greenhouse", boardToken: "xai" },
  { company: "Glean", platform: "greenhouse", boardToken: "gleanwork" },
  { company: "Augment Code", platform: "greenhouse", boardToken: "augmentcomputing" },
  { company: "Warp", platform: "greenhouse", boardToken: "warp" },
  { company: "Waymo", platform: "greenhouse", boardToken: "waymo" },
  { company: "Databricks", platform: "greenhouse", boardToken: "databricks" },
  // Ashby
  { company: "Linear", platform: "ashby", orgSlug: "Linear" },
  { company: "Perplexity", platform: "ashby", orgSlug: "perplexity" },
  { company: "Replit", platform: "ashby", orgSlug: "replit" },
  { company: "Character.ai", platform: "ashby", orgSlug: "character" },
  { company: "Pika", platform: "ashby", orgSlug: "pika" },
  { company: "Notion", platform: "ashby", orgSlug: "notion" },
  { company: "ElevenLabs", platform: "ashby", orgSlug: "elevenlabs" },
  { company: "Cohere", platform: "ashby", orgSlug: "cohere" },
  { company: "Ramp", platform: "ashby", orgSlug: "ramp" },
  { company: "Writer", platform: "ashby", orgSlug: "writer" },
  { company: "Modal", platform: "ashby", orgSlug: "modal" },
  { company: "Sierra AI", platform: "ashby", orgSlug: "sierra" },
  { company: "Harvey AI", platform: "ashby", orgSlug: "harvey" },
  { company: "Suno", platform: "ashby", orgSlug: "suno" },
  { company: "Ideogram", platform: "ashby", orgSlug: "ideogram" },
  { company: "Lindy", platform: "ashby", orgSlug: "lindy" },
  { company: "Applied Labs", platform: "ashby", orgSlug: "appliedlabs" },
  { company: "Benchling", platform: "ashby", orgSlug: "benchling" },
  { company: "Synthesia", platform: "ashby", orgSlug: "synthesia" },
  { company: "ComfyUI", platform: "ashby", orgSlug: "comfy-org" },
  { company: "Lovable", platform: "ashby", orgSlug: "lovable" },
  { company: "Coframe", platform: "ashby", orgSlug: "coframe" },
  { company: "FlutterFlow", platform: "ashby", orgSlug: "FlutterFlow" },
  { company: "Netic", platform: "ashby", orgSlug: "netic" },
  { company: "Mercor", platform: "ashby", orgSlug: "mercor" },
  // Lever
  { company: "Mistral AI", platform: "lever", orgSlug: "mistral" },
  { company: "Palantir", platform: "lever", orgSlug: "palantir" },
  // Custom (URL liveness check only — can't auto-discover new jobs)
  { company: "Cursor", platform: "custom", existingJobs: true },
];

// ── Design role detection ──────────────────────────────────────────

// Title must contain one of these to be considered a design role
const DESIGN_TITLE_PATTERNS = [
  /\bdesign(er|ing)?\b/i,
  /\bux\b/i,
  /\bui\b/i,
  /\bbrand design/i,
  /\bart director\b/i,
  /\bcreative director\b/i,
  /\bmotion design/i,
  /\bcontent design/i,
  /\bvisual design/i,
];

// Titles containing these are excluded even if they match above
const EXCLUDE_PATTERNS = [
  /\bsoftware engineer/i,
  /\bengineering manager/i,
  /\bstaff software/i,
  /\bsenior software/i,
  /\bdata scientist/i,
  /\baccount\b/i,
  /\bmarketing\b/i,
  /\brecruit/i,
  /\bsales\b/i,
  /\bsolutions architect/i,
  /\bprompt engineer\b/i,
  /\bcommunications\b/i,
  /\bcommunity\b/i,
  /\bvideo producer\b/i,
  /\bvideo director\b/i,
  /\bevent(?! design)/i,
  /\bfield marketing/i,
  /\bcontent marketing/i,
  /\bproduct marketing/i,
  /\btechnical lead manager/i,
  /\bmodel quality/i,
  /co-design/i,
  /\bhw-sw\b/i,
  /\bbackend engineer/i,
  /\bfrontend engineer/i,
  /\bstaff frontend/i,
  /\bproduct manager/i,
  /\bstaff product manager/i,
  /\bcompensation\b/i,
  /\binstructional designer/i,
  /\brecruiter/i,
  /\bcreative producer/i,
  /\bproduction design operations/i,
];

function isDesignRole(title: string, _department: string): boolean {
  const titleMatch = DESIGN_TITLE_PATTERNS.some((re) => re.test(title));
  if (!titleMatch) return false;

  const excluded = EXCLUDE_PATTERNS.some((re) => re.test(title));
  return !excluded;
}

// ── URL rewriting ──────────────────────────────────────────────────
// Use the company's careers page URL instead of ATS URLs when possible

function rewriteUrl(atsUrl: string, company: string): string {
  const careersUrl = CAREERS_URLS[company];
  if (!careersUrl) return atsUrl;

  // For companies that just link to ATS anyway, keep ATS URL (it works)
  // but for companies with custom career pages, link to their careers page
  // with the job ID as an anchor or query param
  return atsUrl;
}

// ── ATS fetchers ───────────────────────────────────────────────────

async function fetchGreenhouse(boardToken: string, company: string): Promise<Job[]> {
  // Step 1: Fetch departments (includes jobs nested inside)
  const deptUrl = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/departments`;
  const deptRes = await fetch(deptUrl);
  if (!deptRes.ok) {
    console.error(`  ✗ Greenhouse API error for ${company}: ${deptRes.status}`);
    return [];
  }

  type GHDept = {
    id: number;
    name: string;
    jobs: GreenhouseJob[];
  };
  const deptData = (await deptRes.json()) as { departments: GHDept[] };

  const results: Job[] = [];
  for (const dept of deptData.departments) {
    for (const job of dept.jobs) {
      if (isDesignRole(job.title, dept.name)) {
        results.push({
          title: job.title,
          company,
          location: job.location.name,
          url: job.absolute_url,
          department: dept.name,
        });
      }
    }
  }

  return results;
}

async function fetchAshby(orgSlug: string, company: string): Promise<Job[]> {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${orgSlug}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ✗ Ashby API error for ${company}: ${res.status}`);
    return [];
  }
  const data = (await res.json()) as { jobs: AshbyJob[] };

  return data.jobs
    .filter((j) => isDesignRole(j.title, `${j.department ?? ""} ${j.team ?? ""}`))
    .map((j) => ({
      title: j.title,
      company,
      location: j.location,
      url: j.jobUrl,
      department: j.department || j.team || "Design",
    }));
}

async function fetchLever(orgSlug: string, company: string): Promise<Job[]> {
  const url = `https://api.lever.co/v0/postings/${orgSlug}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ✗ Lever API error for ${company}: ${res.status}`);
    return [];
  }
  const data = (await res.json()) as LeverJob[];

  return data
    .filter((j) =>
      isDesignRole(j.text, `${j.categories.team ?? ""} ${j.categories.department ?? ""}`)
    )
    .map((j) => ({
      title: j.text,
      company,
      location: j.categories.location,
      url: j.hostedUrl,
      department: j.categories.team || j.categories.department || "Design",
    }));
}

// ── URL liveness check for custom companies ────────────────────────

async function checkUrlAlive(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function filterLiveJobs(existingJobs: Job[]): Promise<Job[]> {
  const results: Job[] = [];
  for (const job of existingJobs) {
    const alive = await checkUrlAlive(job.url);
    if (alive) {
      results.push(job);
    } else {
      console.log(`  ✗ Removed dead listing: ${job.title} (${job.url})`);
    }
  }
  return results;
}

// ── Load existing jobs for custom companies ────────────────────────

function loadExistingJobs(): Job[] {
  const filePath = join(process.cwd(), "src/data/jobs.ts");
  const content = readFileSync(filePath, "utf-8");

  // Extract the array from the TS file using a simple regex approach
  const jobs: Job[] = [];
  const blockRegex =
    /\{\s*title:\s*"([^"]*)",\s*company:\s*"([^"]*)",\s*location:\s*"([^"]*)",\s*url:\s*"([^"]*)",\s*department:\s*"([^"]*)",?\s*\}/g;

  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    jobs.push({
      title: match[1],
      company: match[2],
      location: match[3],
      url: match[4],
      department: match[5],
    });
  }

  return jobs;
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log("Scraping design jobs from AI companies...\n");

  const existingJobs = loadExistingJobs();
  const allJobs: Job[] = [];

  for (const config of companies) {
    console.log(`→ ${config.company} (${config.platform})`);

    let jobs: Job[] = [];

    switch (config.platform) {
      case "greenhouse":
        jobs = await fetchGreenhouse(config.boardToken, config.company);
        break;
      case "ashby":
        jobs = await fetchAshby(config.orgSlug, config.company);
        break;
      case "lever":
        jobs = await fetchLever(config.orgSlug, config.company);
        break;
      case "custom": {
        const companyJobs = existingJobs.filter((j) => j.company === config.company);
        jobs = await filterLiveJobs(companyJobs);
        break;
      }
    }

    console.log(`  Found ${jobs.length} design roles`);
    allJobs.push(...jobs);
  }

  // Merge roles with same company + title but different locations
  const mergeMap = new Map<string, Job>();
  for (const job of allJobs) {
    const key = `${job.company}|${job.title}`;
    const existing = mergeMap.get(key);
    if (existing) {
      // Merge locations if different
      const existingLocs = existing.location.split(" | ");
      const newLocs = job.location.split(" | ");
      const allLocs = [...new Set([...existingLocs, ...newLocs])];
      existing.location = allLocs.join(" | ");
    } else {
      mergeMap.set(key, { ...job });
    }
  }
  const dedupedJobs = Array.from(mergeMap.values());

  // Sort: by company name, then by title
  dedupedJobs.sort((a, b) => a.company.localeCompare(b.company) || a.title.localeCompare(b.title));

  // Group by company for readable output
  const grouped = new Map<string, Job[]>();
  for (const job of dedupedJobs) {
    const list = grouped.get(job.company) ?? [];
    list.push(job);
    grouped.set(job.company, list);
  }

  // Generate the TypeScript file
  const today = new Date().toISOString().split("T")[0];
  let output = `export type Job = {
  title: string;
  company: string;
  location: string;
  url: string;
  department: string;
};

// Auto-updated by scraper — ${today}
export const jobs: Job[] = [\n`;

  for (const [company, jobs] of grouped) {
    const separator = "\u2500".repeat(Math.max(0, 55 - company.length));
    output += `  // \u2500\u2500 ${company} ${separator}\n`;
    for (const job of jobs) {
      output += `  {\n`;
      output += `    title: ${JSON.stringify(job.title)},\n`;
      output += `    company: ${JSON.stringify(job.company)},\n`;
      output += `    location: ${JSON.stringify(job.location)},\n`;
      output += `    url: ${JSON.stringify(job.url)},\n`;
      output += `    department: ${JSON.stringify(job.department)},\n`;
      output += `  },\n`;
    }
    output += `\n`;
  }

  output += `];\n`;

  const outPath = join(process.cwd(), "src/data/jobs.ts");
  writeFileSync(outPath, output);

  console.log(`\nWrote ${allJobs.length} jobs to src/data/jobs.ts`);

  // Also update the footer date in page.tsx
  const pagePath = join(process.cwd(), "src/app/page.tsx");
  const pageContent = readFileSync(pagePath, "utf-8");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const now = new Date();
  const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const updated = pageContent.replace(
    /Last updated: [A-Z][a-z]{2} \d{1,2}, \d{4}/,
    `Last updated: ${dateStr}`
  );
  if (updated !== pageContent) {
    writeFileSync(pagePath, updated);
    console.log(`Updated footer date to ${dateStr}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
