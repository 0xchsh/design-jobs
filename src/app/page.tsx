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
          <div className="max-w-xl pointer-events-auto">
          <h1 className="text-display-sm sm:text-display-lg font-medium tracking-[-0.02em] leading-[1.1] text-foreground font-serif">
            Curated design roles at AI companies
          </h1>
          <p className="mt-5 text-body-md leading-relaxed text-muted-foreground max-w-lg">
            Design and design engineering positions at the
            world&apos;s leading artificial intelligence teams and companies.
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
        <div className="mx-auto max-w-[1200px] px-6 h-14 flex items-center justify-between text-caption text-muted-foreground">
          <span>Built by <a href="https://ch.sh" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted decoration-muted-foreground/50 underline-offset-4 hover:decoration-solid hover:decoration-current">ch.sh</a></span>
          <span>Last updated: Mar 17, 2026</span>
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
    Stripe: "stripe.com",
    "Scale AI": "scale.com",
    "Together AI": "together.ai",
    "Stability AI": "stability.ai",
    "Hugging Face": "huggingface.co",
    "Inflection AI": "inflection.ai",
    Pika: "pika.art",
    Notion: "notion.so",
    ElevenLabs: "elevenlabs.io",
    Cohere: "cohere.com",
    Ramp: "ramp.com",
    xAI: "x.ai",
    Glean: "glean.com",
    Anduril: "anduril.com",
    Writer: "writer.com",
    Modal: "modal.com",
    "Sierra AI": "sierra.ai",
    "Harvey AI": "harvey.ai",
    Suno: "suno.com",
    Ideogram: "ideogram.ai",
    Palantir: "palantir.com",
    "Augment Code": "augmentcode.com",
    Warp: "warp.dev",
    Waymo: "waymo.com",
    Databricks: "databricks.com",
    Lindy: "lindy.ai",
    "Applied Labs": "appliedlabs.ai",
    Benchling: "benchling.com",
    Synthesia: "synthesia.io",
    ComfyUI: "comfy.org",
    Lovable: "lovable.dev",
    Coframe: "coframe.ai",
    FlutterFlow: "flutterflow.io",
    Netic: "netic.ai",
    Mercor: "mercor.com",
    Duolingo: "duolingo.com",
    Discord: "discord.com",
    Pinterest: "pinterest.com",
    Dropbox: "dropbox.com",
    Twitch: "twitch.tv",
    Reddit: "reddit.com",
    Airbnb: "airbnb.com",
    Instacart: "instacart.com",
    Robinhood: "robinhood.com",
    Coinbase: "coinbase.com",
    Airtable: "airtable.com",
    Grammarly: "grammarly.com",
    Descript: "descript.com",
    PlanetScale: "planetscale.com",
    Hebbia: "hebbia.ai",
    Forethought: "forethought.ai",
    Cresta: "cresta.com",
    Otter: "otter.ai",
    HeyGen: "heygen.com",
    Gong: "gong.io",
    Tavus: "tavus.io",
    Synthflow: "synthflow.ai",
    Braintrust: "braintrust.dev",
    Baseten: "baseten.co",
    Resend: "resend.com",
    Raycast: "raycast.com",
    Granola: "granola.ai",
    Factory: "factory.ai",
    Codegen: "codegen.com",
    Railway: "railway.app",
    Lyft: "lyft.com",
    Asana: "asana.com",
    Webflow: "webflow.com",
    Intercom: "intercom.com",
    Mercury: "mercury.com",
    Brex: "brex.com",
    Gusto: "gusto.com",
    Contentful: "contentful.com",
    Fivetran: "fivetran.com",
    Moveworks: "moveworks.com",
    Braze: "braze.com",
    "Late Checkout": "latecheckout.agency",
    Lattice: "lattice.com",
    Amplitude: "amplitude.com",
    Bloomreach: "bloomreach.com",
    Algolia: "algolia.com",
    Zoox: "zoox.com",
    Stytch: "stytch.com",
    Propel: "propel.com",
    Plain: "plain.com",
    Semgrep: "semgrep.com",
    Socket: "socket.dev",
    Sentry: "sentry.io",
    Coder: "coder.com",
    Mux: "mux.com",
    Spotify: "spotify.com",
    Plaid: "plaid.com",
  };
  return map[company] || "example.com";
}
