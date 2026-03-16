import { jobs } from "@/data/jobs";
import { JobTable } from "@/components/job-table";

const companies = [...new Set(jobs.map((j) => j.company))];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border-light">
        <div className="mx-auto max-w-[1200px] px-6 h-14 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-tight">
            designjobs.ai
          </span>
          <div className="flex items-center gap-6 text-[13px] text-muted">
            <span>{jobs.length} roles</span>
            <span>{companies.length} companies</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-[1200px] px-6 pt-16 pb-12">
        <div className="max-w-2xl">
          <h1 className="text-[44px] font-semibold tracking-[-0.02em] leading-[1.1] text-foreground">
            Design jobs at
            <br />
            AI companies
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-muted max-w-lg">
            Curated design and design engineering positions at the
            world&apos;s most notable artificial intelligence companies.
          </p>
        </div>

        {/* Company pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {companies.map((company) => (
            <span
              key={company}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-[13px] font-medium text-foreground"
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${companyDomain(company)}&sz=32`}
                alt=""
                width={14}
                height={14}
                className="rounded-sm"
              />
              {company}
            </span>
          ))}
        </div>
      </header>

      {/* Table */}
      <main className="mx-auto max-w-[1200px] px-6 pb-20">
        <JobTable jobs={jobs} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light">
        <div className="mx-auto max-w-[1200px] px-6 h-14 flex items-center justify-between text-[13px] text-muted">
          <span>designjobs.ai</span>
          <span>Updated March 2026</span>
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
