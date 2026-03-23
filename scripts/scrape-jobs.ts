import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import Exa from "exa-js";

// ── Types ──────────────────────────────────────────────────────────

type Job = {
  title: string;
  company: string;
  location: string;
  url: string;
  department: string;
  postedAt: string; // ISO date string
};

// Greenhouse: jobs list has no departments — title-only filtering
type GreenhouseJob = {
  id: number;
  title: string;
  location: { name: string };
  absolute_url: string;
  first_published: string;
  updated_at: string;
};

// Ashby: uses `department` and `team` fields
type AshbyJob = {
  id: string;
  title: string;
  location: string;
  department: string;
  team: string;
  jobUrl: string;
  publishedAt: string;
};

// Lever: uses `categories` object
type LeverJob = {
  id: string;
  text: string;
  categories: { location: string; team: string; department: string };
  hostedUrl: string;
  createdAt: number; // Unix ms
};

// Workable: uses `shortcode` and `department`
type WorkableJob = {
  id: number;
  shortcode: string;
  title: string;
  department: string[];
  published: string; // ISO date string
  location: {
    country: string;
    city: string;
    region: string;
  };
  locations: { country: string; city: string; region: string }[];
};

// ── Company configs ────────────────────────────────────────────────

type CompanyConfig =
  | { company: string; platform: "greenhouse"; boardToken: string; careersUrl?: string }
  | { company: string; platform: "ashby"; orgSlug: string; careersUrl?: string }
  | { company: string; platform: "lever"; orgSlug: string; careersUrl?: string }
  | { company: string; platform: "workable"; accountSlug: string; careersUrl?: string }
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
  OpenAI: "https://openai.com/careers",
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
  { company: "Pinterest", platform: "greenhouse", boardToken: "pinterest" },
  { company: "Reddit", platform: "greenhouse", boardToken: "reddit" },
  { company: "Robinhood", platform: "greenhouse", boardToken: "robinhood" },
  { company: "Coinbase", platform: "greenhouse", boardToken: "coinbase" },
  { company: "Airtable", platform: "greenhouse", boardToken: "airtable" },
  { company: "Grammarly", platform: "greenhouse", boardToken: "grammarly" },
  { company: "Descript", platform: "greenhouse", boardToken: "descript" },
  { company: "PlanetScale", platform: "greenhouse", boardToken: "planetscale" },
  { company: "Hebbia", platform: "greenhouse", boardToken: "hebbia" },
  { company: "Forethought", platform: "greenhouse", boardToken: "forethought" },
  { company: "Cresta", platform: "greenhouse", boardToken: "cresta" },
  { company: "Otter", platform: "greenhouse", boardToken: "otter" },
  { company: "HeyGen", platform: "greenhouse", boardToken: "heygen" },
  { company: "Gong", platform: "greenhouse", boardToken: "gongio" },
  { company: "Lyft", platform: "greenhouse", boardToken: "lyft" },
  { company: "Asana", platform: "greenhouse", boardToken: "asana" },
  { company: "Webflow", platform: "greenhouse", boardToken: "webflow" },
  { company: "Intercom", platform: "greenhouse", boardToken: "intercom" },
  { company: "Mercury", platform: "greenhouse", boardToken: "mercury" },
  { company: "Brex", platform: "greenhouse", boardToken: "brex" },
  { company: "Gusto", platform: "greenhouse", boardToken: "gusto" },
  { company: "Contentful", platform: "greenhouse", boardToken: "contentful" },
  { company: "Fivetran", platform: "greenhouse", boardToken: "fivetran" },
  { company: "Moveworks", platform: "greenhouse", boardToken: "moveworks" },
  { company: "Braze", platform: "greenhouse", boardToken: "braze" },
  { company: "Lattice", platform: "greenhouse", boardToken: "lattice" },
  { company: "Amplitude", platform: "greenhouse", boardToken: "amplitude" },
  { company: "Bloomreach", platform: "greenhouse", boardToken: "bloomreach" },
  { company: "Algolia", platform: "greenhouse", boardToken: "algolia" },
  { company: "Sourcegraph", platform: "greenhouse", boardToken: "sourcegraph91" },
  { company: "CoreWeave", platform: "greenhouse", boardToken: "coreweave" },
  { company: "Figure AI", platform: "greenhouse", boardToken: "figureai" },
  { company: "Buildkite", platform: "greenhouse", boardToken: "buildkite" },
  { company: "You.com", platform: "greenhouse", boardToken: "youcom" },
  { company: "AssemblyAI", platform: "greenhouse", boardToken: "assemblyai" },
  { company: "Typeface", platform: "greenhouse", boardToken: "typeface" },
  { company: "Fireworks AI", platform: "greenhouse", boardToken: "fireworksai" },
  { company: "Hex", platform: "greenhouse", boardToken: "hextechnologies" },
  { company: "Udio", platform: "greenhouse", boardToken: "udio" },
  { company: "Arize AI", platform: "greenhouse", boardToken: "arizeai" },
  { company: "Labelbox", platform: "greenhouse", boardToken: "labelbox" },
  { company: "Temporal", platform: "greenhouse", boardToken: "temporaltechnologies" },
  { company: "HubSpot", platform: "greenhouse", boardToken: "hubspotjobs" },
  { company: "Cloudflare", platform: "greenhouse", boardToken: "cloudflare" },
  { company: "MongoDB", platform: "greenhouse", boardToken: "mongodb" },
  { company: "Okta", platform: "greenhouse", boardToken: "okta" },
  { company: "Datadog", platform: "greenhouse", boardToken: "datadog" },
  { company: "Elastic", platform: "greenhouse", boardToken: "elastic" },
  { company: "Typeform", platform: "greenhouse", boardToken: "typeform" },
  { company: "Bolt", platform: "greenhouse", boardToken: "stackblitz" },
  { company: "Klaviyo", platform: "greenhouse", boardToken: "klaviyo" },
  { company: "Squarespace", platform: "greenhouse", boardToken: "squarespace" },
  { company: "Faire", platform: "greenhouse", boardToken: "faire" },
  { company: "Chime", platform: "greenhouse", boardToken: "chime" },
  { company: "GlossGenius", platform: "greenhouse", boardToken: "glossgenius" },
  { company: "Pendo", platform: "greenhouse", boardToken: "pendo" },
  { company: "Affirm", platform: "greenhouse", boardToken: "affirm" },
  { company: "Sigma Computing", platform: "greenhouse", boardToken: "sigmacomputing" },
  { company: "Duolingo", platform: "greenhouse", boardToken: "duolingo" },
  { company: "Miro", platform: "greenhouse", boardToken: "realtimeboardglobal" },
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
  { company: "Cognition", platform: "ashby", orgSlug: "cognition" },
  { company: "OpenAI", platform: "ashby", orgSlug: "openai" },
  { company: "Deepgram", platform: "ashby", orgSlug: "deepgram" },
  { company: "Lambda", platform: "ashby", orgSlug: "lambda" },
  { company: "Quora", platform: "ashby", orgSlug: "quora" },
  { company: "Krea", platform: "ashby", orgSlug: "krea" },
  { company: "The Browser Company", platform: "ashby", orgSlug: "The Browser Company" },
  { company: "Infisical", platform: "ashby", orgSlug: "infisical" },
  { company: "Arcade", platform: "ashby", orgSlug: "arcade" },
  { company: "Prime Intellect", platform: "ashby", orgSlug: "PrimeIntellect" },
  { company: "Noise Labs", platform: "ashby", orgSlug: "noise-labs" },
  { company: "Doji", platform: "ashby", orgSlug: "doji" },
  { company: "Navattic", platform: "ashby", orgSlug: "navattic" },
  { company: "Tavus", platform: "ashby", orgSlug: "tavus" },
  { company: "Synthflow", platform: "ashby", orgSlug: "synthflow" },
  { company: "Braintrust", platform: "ashby", orgSlug: "braintrust" },
  { company: "Baseten", platform: "ashby", orgSlug: "baseten" },
  { company: "Resend", platform: "ashby", orgSlug: "resend" },
  { company: "Raycast", platform: "ashby", orgSlug: "raycast" },
  { company: "Granola", platform: "ashby", orgSlug: "granola" },
  { company: "Factory", platform: "ashby", orgSlug: "factory" },
  { company: "Railway", platform: "ashby", orgSlug: "railway" },
  { company: "Stytch", platform: "ashby", orgSlug: "stytch" },
  { company: "Propel", platform: "ashby", orgSlug: "propel" },
  { company: "Plain", platform: "ashby", orgSlug: "plain" },
  { company: "Semgrep", platform: "ashby", orgSlug: "semgrep" },
  { company: "Socket", platform: "ashby", orgSlug: "socket" },
  { company: "Sentry", platform: "ashby", orgSlug: "sentry" },
  { company: "Coder", platform: "ashby", orgSlug: "coder" },
  { company: "Mux", platform: "ashby", orgSlug: "mux" },
  { company: "Clay", platform: "ashby", orgSlug: "claylabs" },
  { company: "Poolside", platform: "ashby", orgSlug: "poolside" },
  { company: "Dust", platform: "ashby", orgSlug: "dust" },
  { company: "Magic", platform: "ashby", orgSlug: "magic.dev" },
  { company: "Twelve Labs", platform: "ashby", orgSlug: "twelve-labs" },
  { company: "Physical Intelligence", platform: "ashby", orgSlug: "physicalintelligence" },
  { company: "Letta", platform: "ashby", orgSlug: "letta" },
  { company: "LangChain", platform: "ashby", orgSlug: "langchain" },
  { company: "Pinecone", platform: "ashby", orgSlug: "pinecone" },
  { company: "Weaviate", platform: "ashby", orgSlug: "weaviate" },
  { company: "Roboflow", platform: "ashby", orgSlug: "roboflow" },
  { company: "Attio", platform: "ashby", orgSlug: "attio" },
  { company: "Sanity", platform: "ashby", orgSlug: "sanity" },
  { company: "Supabase", platform: "ashby", orgSlug: "supabase" },
  { company: "Snowflake", platform: "ashby", orgSlug: "snowflake" },
  { company: "Sprig", platform: "ashby", orgSlug: "sprig" },
  { company: "Pylon", platform: "ashby", orgSlug: "pylon" },
  { company: "Mintlify", platform: "ashby", orgSlug: "mintlify" },
  { company: "Browserbase", platform: "ashby", orgSlug: "browserbase" },
  // Lever
  { company: "Mistral AI", platform: "lever", orgSlug: "mistral" },
  { company: "Palantir", platform: "lever", orgSlug: "palantir" },
  { company: "Plaid", platform: "lever", orgSlug: "plaid" },
  { company: "Zoox", platform: "lever", orgSlug: "zoox" },
  { company: "Contentsquare", platform: "lever", orgSlug: "contentsquare" },
  { company: "LogRocket", platform: "lever", orgSlug: "logrocket" },
  // Workable
  { company: "Hugging Face", platform: "workable", accountSlug: "huggingface" },
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
  /\basic design/i,
  /\belectrical design/i,
  /\bmanufacturing design/i,
  /\bcad designer/i,
  /\binstructional.*designer/i,
  /\bmultimedia designer/i,
  /\bdesign validation/i,
  /\bdesign verification/i,
  /\bai trainer\b/i,
  /\bai annotator\b/i,
  /\bdata annotator\b/i,
  /\bgraphic design.*trainer/i,
  // Hardware / mechanical / physical design — not digital product design
  /\bmechanical (design|engineer)/i,
  /\bstructural design/i,
  /\bhardware design/i,
  /\bpcb design/i,
  /\bpropulsion design/i,
  /\bpower system.*design/i,
  /\bharness design/i,
  /\btool design/i,
  /\baircraft.*design/i,
  /\bbattery pack designer/i,
  /\bhigh voltage/i,
  /\bengineering specialist/i,
  /\bsystems engineer/i,
  /\belectronics design/i,
];

// Only show US-based or remote-eligible roles
const NON_US_PATTERNS = [
  /\b(canada|uk|united kingdom|england|europe|germany|france|netherlands|amsterdam|london|berlin|paris|prague|czech republic|india|australia|singapore|japan|korea|israel|sweden|spain|italy|portugal|ireland|poland|ukraine|brazil|mexico|latin america|emea|apac)\b/i,
];
const US_PATTERNS = [
  /\b(remote|worldwide|global|anywhere|distributed|usa|united states?)\b/i,
  /\b(california|new york|texas|washington|colorado|illinois|massachusetts|georgia|florida|oregon|virginia|north carolina|new jersey|minnesota|arizona|ohio|michigan)\b/i,
  /\b(san francisco|new york city|nyc|sf|los angeles|seattle|austin|boston|chicago|denver|atlanta|miami|portland|san diego|brooklyn|manhattan)\b/i,
];

function isUSEligible(location: string): boolean {
  if (!location) return true; // unspecified — allow
  if (NON_US_PATTERNS.some((re) => re.test(location))) return false;
  if (US_PATTERNS.some((re) => re.test(location))) return true;
  return true; // unknown — allow
}

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
  const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ✗ Greenhouse API error for ${company}: ${res.status}`);
    return [];
  }
  const data = (await res.json()) as { jobs: GreenhouseJob[] };

  return data.jobs
    .filter((job) => isDesignRole(job.title, "") && isUSEligible(job.location.name))
    .map((job) => ({
      title: job.title,
      company,
      location: job.location.name,
      url: job.absolute_url,
      department: "",
      postedAt: job.first_published ?? job.updated_at ?? "",
    }));
}

async function fetchAshby(orgSlug: string, company: string): Promise<Job[]> {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(orgSlug)}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ✗ Ashby API error for ${company}: ${res.status}`);
    return [];
  }
  const data = (await res.json()) as { jobs: AshbyJob[] };

  return data.jobs
    .filter((j) => isDesignRole(j.title, `${j.department ?? ""} ${j.team ?? ""}`) && isUSEligible(j.location))
    .map((j) => ({
      title: j.title,
      company,
      location: j.location,
      url: j.jobUrl,
      department: j.department || j.team || "Design",
      postedAt: j.publishedAt ?? "",
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
      isDesignRole(j.text, `${j.categories.team ?? ""} ${j.categories.department ?? ""}`) &&
      isUSEligible(j.categories.location)
    )
    .map((j) => ({
      title: j.text,
      company,
      location: j.categories.location,
      url: j.hostedUrl,
      department: j.categories.team || j.categories.department || "Design",
      postedAt: j.createdAt ? new Date(j.createdAt).toISOString() : "",
    }));
}

async function fetchWorkable(accountSlug: string, company: string): Promise<Job[]> {
  const url = `https://apply.workable.com/api/v3/accounts/${accountSlug}/jobs`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    console.error(`  ✗ Workable API error for ${company}: ${res.status}`);
    return [];
  }
  const data = (await res.json()) as { results: WorkableJob[] };

  return data.results
    .filter((j) => isDesignRole(j.title, (j.department ?? []).join(" ")) && isUSEligible(
      j.locations?.map((l) => [l.city, l.region, l.country].filter(Boolean).join(", ")).join(" | ") ||
      [j.location?.city, j.location?.region, j.location?.country].filter(Boolean).join(", ")
    ))
    .map((j) => {
      const loc = j.locations?.length
        ? j.locations.map((l) => [l.city, l.region, l.country].filter(Boolean).join(", ")).join(" | ")
        : [j.location?.city, j.location?.region, j.location?.country].filter(Boolean).join(", ");
      return {
        title: j.title,
        company,
        location: loc || "Remote",
        url: `https://apply.workable.com/${accountSlug}/j/${j.shortcode}/`,
        department: (j.department ?? [])[0] || "Design",
        postedAt: j.published ?? "",
      };
    });
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
    /\{\s*title:\s*"([^"]*)",\s*company:\s*"([^"]*)",\s*location:\s*"([^"]*)",\s*url:\s*"([^"]*)",\s*department:\s*"([^"]*)",\s*postedAt:\s*"([^"]*)",?\s*\}/g;

  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    jobs.push({
      title: match[1],
      company: match[2],
      location: match[3],
      url: match[4],
      department: match[5],
      postedAt: match[6],
    });
  }

  return jobs;
}

// ── Exa AI discovery ───────────────────────────────────────────────
// Finds design job postings on supported ATS platforms for companies
// not already in the companies list, then fetches their full job data.

// Keywords that indicate a string is a job title, not a company name
const JOB_TITLE_WORDS = /\b(designer|developer|engineer|manager|director|researcher|analyst|specialist|architect|consultant|producer|strategist|trainer|annotator|coordinator|lead|writer|scientist)\b/i;

function inferCompanyFromTitle(title: string | null | undefined, fallback: string): string {
  if (!title) return fallback;

  // "Job Title at Company" or "Job Title @ Company"
  const atMatch = title.match(/\b(?:at|@)\s+(.+?)(?:\s*[|–\-]|\s*$)/i);
  if (atMatch) {
    const candidate = atMatch[1].trim();
    if (!JOB_TITLE_WORDS.test(candidate) && candidate.length < 60) return candidate;
  }

  // "Company | Job Title" or "Company - Job Title" — only if company part looks like a proper name
  const pipeMatch = title.match(/^(.+?)\s*[|–\-]\s*.+/);
  if (pipeMatch && pipeMatch[1].length < 40) {
    const candidate = pipeMatch[1].trim();
    if (!JOB_TITLE_WORDS.test(candidate)) return candidate;
  }

  return fallback;
}

async function discoverViaExa(): Promise<Job[]> {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    console.log("→ Exa discovery (skipping — EXA_API_KEY not set)");
    return [];
  }

  console.log("→ Exa AI discovery");

  const exa = new Exa(apiKey);
  const newJobs: Job[] = [];

  // Track already-known ATS tokens to avoid duplicates
  // Also includes tokens for companies we explicitly don't want to feature
  const EXCLUDED_GREENHOUSE = new Set([
    "airbnb", "ithaka", "innovecs", "wehrtyou", "digitalocean98",
    "criticalmass", "robotsandpencils", "spothopper", "monstro", "boldbusiness", "pallet", "circleso", "onbe", "fluxon", "emergentlabsinc",
    "oliver",        // marketing agency, non-US
    "rga",           // advertising agency
    "infuse",        // marketing agency
    "bpcs",          // unknown non-tech
    "soldejaneiro",  // beauty brand
    "birdygrey",     // wedding brand
    "eucalyptus",    // telehealth
    "perpay",        // consumer lending
    "skylighthq",    // military financial wellness
    "panoramaed",    // education data
    "medeanalytics", // healthcare analytics
    "qualifiedhealth","pomelocare",  // healthcare
    "upwork",        // freelancing platform
    "willowtree",    // app dev agency
    "mobilityware",  // mobile games
    "cobaltio",      // pen testing
    "kettle",        // insurance tech
    "nextstreet",    // community development
    "toast",         // restaurant tech
    "esri",          // GIS mapping
    "mozilla",       // browser (non-AI design roles)
    "sphereentertainment", // entertainment venue
    "cargurus",      // car marketplace
    "iconcareers",   // job board
    "trellis",       // unknown
    "perplexityai",  // duplicate (already have "perplexity")
    "postman",       // API tools (non-AI design focus)
    "apolloio",      // sales intelligence
    "snorkelai",     // data labeling
    "lilasciences",  // biotech
    "meshy",         // 3D AI - could keep but niche
    "postscript",    // SMS marketing
    "perfectserve",  // healthcare communication
    "wisetack",      // consumer financing
    "worldquant",    // quant hedge fund
    "skylight",      // payroll for hourly workers
    "phaidra",       // industrial AI ops (niche)
  ]);
  const EXCLUDED_ASHBY = new Set([
    "handshake", // posts AI trainer/annotator roles, not design jobs
    "weave",     // dental/vet practice management
    "codeium",   // 404
  ]);
  const EXCLUDED_LEVER = new Set([
    "redhorsecorp", "saronic", "aechelon", "USMobile", "nominal", "valence",
    "ladders", "Ubiminds", "ubiminds", "oowlish", "zaimler", "nitra", "tryjeeves", "remofirst", "Yassir",
    "superside",          // creative agency
    "AIFund",             // investment firm
    "articulate",         // e-learning authoring tool
    "sonarsource",        // code quality, not AI product
    "whoop",              // fitness wearable
    "kitmanlabs",         // sports analytics
    "talkiatry",          // mental health staffing
    "wisdomai",           // HR analytics
    "suger",              // commerce marketplace
    "vivun",              // sales presales
    "Eve",                // unclear
    "zocks",              // unclear
    "shieldai", "field-ai", // defense AI — hardware/mechanical design roles
    "ro",                 // healthcare
    "verifiable",         // credential verification
    "Flex",               // fintech
    "lunaphysicaltherapy",// physical therapy
    "accurate",           // background checks
    "gojob",              // staffing
    "tradeify",           // trading
    "peerspace",          // venue rental
    "triallibrary",       // clinical trials
    "gopuff",             // delivery
    "synapticure",        // genetic disease
    "luxurypresence",     // real estate tech
    "gohighlevel",        // marketing SaaS
    "useinsider",         // marketing automation
    "brilliant",          // education/math puzzles
    "smart-working-solutions", // HR
    "CordTechnologies",   // data labeling (non-product design)
    "NormAI",             // regulatory AI
    "15five",             // HR performance
    "scaleway",           // European cloud provider
    "ivo",                // contract AI (small)
    "augment",            // sales AI
    "finix",              // payments
    "bosonai",            // unclear
    "hive",               // content moderation AI
    "kumo",               // graph ML
    "metabase",           // BI tool
    "secureframe",        // compliance
    "jumpcloud",          // IT management
    "highspot",           // sales enablement
    "clovirtualfashion",  // 3D fashion software
    "agiloft",            // contract management
    "weave",              // dental/vet practice management
    "jobgether",          // job aggregator, not a real company
  ]);
  const knownGreenhouse = new Set([
    ...companies.filter((c) => c.platform === "greenhouse").map((c) => (c as { boardToken: string }).boardToken),
    ...EXCLUDED_GREENHOUSE,
  ]);
  const knownAshby = new Set([
    ...companies.filter((c) => c.platform === "ashby").map((c) => (c as { orgSlug: string }).orgSlug.toLowerCase()),
    ...EXCLUDED_ASHBY,
  ]);
  const knownLever = new Set([
    ...companies.filter((c) => c.platform === "lever").map((c) => (c as { orgSlug: string }).orgSlug),
    ...EXCLUDED_LEVER,
  ]);

  // Only look at postings from the last 6 months to keep results fresh and relevant
  const sinceDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Search each major ATS separately for better precision, using multiple queries
  // to maximize discovery of AI-focused companies hiring designers
  const searches: { domains: string[]; platform: "greenhouse" | "ashby" | "lever"; query: string }[] = [
    {
      domains: ["job-boards.greenhouse.io", "boards.greenhouse.io"],
      platform: "greenhouse",
      query: '"product designer" OR "design engineer" artificial intelligence OR "machine learning" OR LLM OR "generative AI" startup',
    },
    {
      domains: ["job-boards.greenhouse.io", "boards.greenhouse.io"],
      platform: "greenhouse",
      query: '"UX designer" OR "brand designer" OR "visual designer" OR "motion designer" AI startup technology',
    },
    {
      domains: ["jobs.ashbyhq.com"],
      platform: "ashby",
      query: '"product designer" OR "design engineer" OR "UX designer" artificial intelligence OR "machine learning" OR LLM OR "generative AI"',
    },
    {
      domains: ["jobs.ashbyhq.com"],
      platform: "ashby",
      query: '"brand designer" OR "visual designer" OR "motion designer" OR "design lead" AI startup technology',
    },
    {
      domains: ["jobs.lever.co"],
      platform: "lever",
      query: '"product designer" OR "design engineer" OR "UX designer" artificial intelligence OR "machine learning" OR LLM startup',
    },
  ];

  for (const { domains, platform, query } of searches) {
    let results: { url: string; title?: string | null }[] = [];
    try {
      const response = await exa.search(query, {
        numResults: 50,
        includeDomains: domains,
        useAutoprompt: false,
        startPublishedDate: sinceDate,
      });
      results = response.results;
    } catch (err) {
      console.error(`  Exa search error (${platform}): ${err}`);
      continue;
    }

    for (const result of results) {
      const url = result.url;

      if (platform === "greenhouse") {
        const match = url.match(/greenhouse\.io\/([^\/]+)\/jobs\/\d+/);
        if (!match) continue;
        const token = match[1];
        if (knownGreenhouse.has(token)) continue;
        knownGreenhouse.add(token);
        const company = inferCompanyFromTitle(result.title, token);
        console.log(`  Exa found Greenhouse: ${company} (${token})`);
        const jobs = await fetchGreenhouse(token, company);
        console.log(`    → ${jobs.length} design roles`);
        newJobs.push(...jobs);
      } else if (platform === "ashby") {
        const match = url.match(/jobs\.ashbyhq\.com\/([^\/]+)/);
        if (!match) continue;
        const slug = match[1];
        if (knownAshby.has(slug.toLowerCase())) continue;
        knownAshby.add(slug.toLowerCase());
        const company = inferCompanyFromTitle(result.title, slug);
        console.log(`  Exa found Ashby: ${company} (${slug})`);
        const jobs = await fetchAshby(slug, company);
        console.log(`    → ${jobs.length} design roles`);
        newJobs.push(...jobs);
      } else if (platform === "lever") {
        const match = url.match(/jobs\.lever\.co\/([^\/]+)/);
        if (!match) continue;
        const slug = match[1];
        if (knownLever.has(slug)) continue;
        knownLever.add(slug);
        const company = inferCompanyFromTitle(result.title, slug);
        console.log(`  Exa found Lever: ${company} (${slug})`);
        const jobs = await fetchLever(slug, company);
        console.log(`    → ${jobs.length} design roles`);
        newJobs.push(...jobs);
      }
    }
  }

  console.log(`  Total via Exa: ${newJobs.length} design roles`);
  return newJobs;
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
      case "workable":
        jobs = await fetchWorkable(config.accountSlug, config.company);
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

  // Discover additional companies via Exa AI
  const exaJobs = await discoverViaExa();
  allJobs.push(...exaJobs);

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
  postedAt: string;
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
      output += `    postedAt: ${JSON.stringify(job.postedAt ?? "")},\n`;
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
