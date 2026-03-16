import { jobs } from "@/data/jobs";
import { JobTable } from "@/components/job-table";
import { AsciiBg } from "@/components/ascii-bg";

const companies = [...new Set(jobs.map((j) => j.company))];

export default function Home() {
  return (
    <div className="min-h-screen">
{/* Hero */}
      <header className="relative pt-[160px] pb-12">
        <AsciiBg />
        <div className="relative mx-auto max-w-[1200px] px-6 pointer-events-none">
          <div className="max-w-2xl pointer-events-auto">
          <h1 className="text-[64px] font-medium tracking-[-0.02em] leading-[1.1] text-foreground font-serif">
            Curated design roles
            <br />
            at AI companies
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground max-w-lg">
            Design and design engineering positions at the
            world&apos;s leading artificial intelligence companies.
          </p>
          </div>
        </div>
      </header>

      {/* Table */}
      <main className="mx-auto max-w-[1200px] px-6 pb-20">
        <JobTable jobs={jobs} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light">
        <div className="mx-auto max-w-[1200px] px-6 h-14 flex items-center justify-between text-[13px] text-muted-foreground">
          <span>Built by <a href="https://ch.sh" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted decoration-muted-foreground/50 underline-offset-4 hover:decoration-solid hover:decoration-current">ch.sh</a></span>
          <span>Last updated: Mar 16, 2026</span>
        </div>
      </footer>
    </div>
  );
}

function companyDomain(company: string): string {
  const map: Record<string, string> = {
    Anthropic: "anthropic.com",
    OpenAI: "openai.com",
    "Google DeepMind": "deepmind.google",
    Meta: "meta.com",
    Figma: "figma.com",
    Vercel: "vercel.com",
    Linear: "linear.app",
    Cursor: "cursor.com",
    Perplexity: "perplexity.ai",
    "Mistral AI": "mistral.ai",
    Runway: "runwayml.com",
    Replit: "replit.com",
    "Character.ai": "character.ai",
    "Adept AI": "adept.ai",
    Midjourney: "midjourney.com",
  };
  return map[company] || "example.com";
}
