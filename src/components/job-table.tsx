"use client";

import { useState, useMemo } from "react";
import type { Job } from "@/data/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const domainMap: Record<string, string> = {
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
  Buildkite: "buildkite.com",
  "You.com": "you.com",
  Clay: "clay.com",
  Poolside: "poolside.ai",
  Dust: "dust.tt",
  Magic: "magic.dev",
  "Twelve Labs": "twelvelabs.io",
  AssemblyAI: "assemblyai.com",
  Typeface: "typeface.ai",
  "Fireworks AI": "fireworks.ai",
  Hex: "hex.tech",
  Udio: "udio.com",
  Sourcegraph: "sourcegraph.com",
  CoreWeave: "coreweave.com",
  "Figure AI": "figure.ai",
  Deepgram: "deepgram.com",
  Lambda: "lambdalabs.com",
  Quora: "quora.com",
  Krea: "krea.ai",
  "The Browser Company": "arc.net",
  Infisical: "infisical.com",
  Arcade: "arcade.software",
  "Prime Intellect": "primeintellect.ai",
  "Noise Labs": "noise.xyz",
  Doji: "doji.art",
  Navattic: "navattic.com",
  Cognition: "cognition.ai",
  "Physical Intelligence": "physicalintelligence.ai",
  Letta: "letta.ai",
  LangChain: "langchain.com",
  Pinecone: "pinecone.io",
  Weaviate: "weaviate.io",
  Roboflow: "roboflow.com",
  Attio: "attio.com",
  Sanity: "sanity.io",
  Supabase: "supabase.com",
  Snowflake: "snowflake.com",
  "Arize AI": "arize.com",
  Labelbox: "labelbox.com",
  Temporal: "temporal.io",
  HubSpot: "hubspot.com",
  Shopify: "shopify.com",
  Atlassian: "atlassian.com",
  Cloudflare: "cloudflare.com",
  MongoDB: "mongodb.com",
  Zendesk: "zendesk.com",
  Okta: "okta.com",
  Datadog: "datadoghq.com",
  Elastic: "elastic.co",
  Twilio: "twilio.com",
  Dropbox: "dropbox.com",
  Typeform: "typeform.com",
  Bolt: "bolt.new",
  Klaviyo: "klaviyo.com",
  Squarespace: "squarespace.com",
  Nubank: "nubank.com.br",
  Faire: "faire.com",
  Chime: "chime.com",
  DoorDash: "doordash.com",
  Contentsquare: "contentsquare.com",
  Affirm: "affirm.com",
  GlossGenius: "glossgenius.com",
  Hightouch: "hightouch.com",
  LogRocket: "logrocket.com",
  "Lucid Software": "lucid.app",
  "Sigma Computing": "sigmacomputing.com",
  Sprig: "sprig.com",
  Rogo: "rogo.ai",
  e2b: "e2b.dev",
  launchdarkly: "launchdarkly.com",
  skydio: "skydio.com",
  Wayve: "wayve.ai",
  Browserbase: "browserbase.com",
  Mintlify: "mintlify.com",
  Pylon: "usepylon.com",
};

function CompanyIcon({ company }: { company: string }) {
  const domain = domainMap[company];
  if (!domain) {
    return (
      <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[3px] shrink-0 bg-muted text-[9px] font-semibold text-muted-foreground select-none">
        {company[0]?.toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      width={18}
      height={18}
      className="rounded-[3px] shrink-0"
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        img.replaceWith(
          Object.assign(document.createElement("span"), {
            className: "inline-flex items-center justify-center w-[18px] h-[18px] rounded-[3px] shrink-0 bg-muted text-[9px] font-semibold text-muted-foreground select-none",
            textContent: company[0]?.toUpperCase() ?? "?",
          })
        );
      }}
    />
  );
}

type SortField = "title" | "company" | "location" | "postedAt";

function formatDate(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  const weeks = Math.floor(diffDays / 7);
  if (weeks > 4) return "5w+ ago";
  return `${weeks}w ago`;
}

export function JobTable({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("company");
  const [sortAsc, setSortAsc] = useState(true);
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [remoteOnly, setRemoteOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q)
    );
    if (activeCompany) {
      result = result.filter((job) => job.company === activeCompany);
    }
    if (remoteOnly) {
      result = result.filter((job) => /remote/i.test(job.location));
    }
    result.sort((a, b) => {
      const aVal = a[sortField] ?? "";
      const bVal = b[sortField] ?? "";
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return result;
  }, [jobs, search, sortField, sortAsc, activeCompany, remoteOnly]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  function SortIndicator({ field }: { field: SortField }) {
    if (sortField !== field) return null;
    return (
      <span className="ml-0.5 opacity-40">{sortAsc ? "↑" : "↓"}</span>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative w-full sm:min-w-[400px] sm:w-auto">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <Input
            type="text"
            placeholder="Search roles, companies, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm pl-8 pr-8 w-full"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <label className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
          <Checkbox
            checked={remoteOnly}
            onCheckedChange={(checked) => setRemoteOnly(checked === true)}
          />
          Remote Only
        </label>
        {activeCompany && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveCompany(null)}
          >
            {activeCompany}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="ml-1"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Button>
        )}
        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} position{filtered.length !== 1 ? "s" : ""} at{" "}
          {new Set(filtered.map((j) => j.company)).size} companies
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th
                  className="text-left text-xs font-medium text-muted-foreground py-2.5 px-3 cursor-pointer hover:text-foreground transition-colors select-none"
                  onClick={() => handleSort("company")}
                >
                  Company
                  <SortIndicator field="company" />
                </th>
                <th
                  className="text-left text-xs font-medium text-muted-foreground py-2.5 px-3 cursor-pointer hover:text-foreground transition-colors select-none"
                  onClick={() => handleSort("title")}
                >
                  Role
                  <SortIndicator field="title" />
                </th>
                <th
                  className="text-left text-xs font-medium text-muted-foreground py-2.5 px-3 cursor-pointer hover:text-foreground transition-colors hidden md:table-cell select-none"
                  onClick={() => handleSort("location")}
                >
                  Location
                  <SortIndicator field="location" />
                </th>
                <th
                  className="text-left text-xs font-medium text-muted-foreground py-2.5 px-3 cursor-pointer hover:text-foreground transition-colors hidden lg:table-cell select-none"
                  onClick={() => handleSort("postedAt")}
                >
                  Posted
                  <SortIndicator field="postedAt" />
                </th>
                <th className="py-2.5 px-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job, i) => (
                <tr
                  key={`${job.company}-${job.title}-${i}`}
                  className="border-b border-border/50 last:border-0 group hover:bg-muted/30 transition-colors"
                >
                  <td className="py-2.5 px-3 align-middle max-w-[180px]">
                    <button
                      onClick={() =>
                        setActiveCompany(
                          activeCompany === job.company ? null : job.company
                        )
                      }
                      className="flex items-center gap-2 hover:opacity-70 transition-opacity text-left min-w-0"
                    >
                      <CompanyIcon company={job.company} />
                      <span className="font-medium text-sm truncate">
                        {job.company}
                      </span>
                    </button>
                  </td>
                  <td className="py-2.5 px-3 align-middle text-sm">
                    {job.title}
                  </td>
                  <td className="py-2.5 px-3 align-middle hidden md:table-cell text-muted-foreground text-sm max-w-[240px] truncate">
                    {job.location}
                  </td>
                  <td className="py-2.5 px-3 align-middle hidden lg:table-cell text-muted-foreground text-sm">
                    {formatDate(job.postedAt)}
                  </td>
                  <td className="py-2.5 px-3 align-middle text-right">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="default" size="xs">
                        Apply
                      </Button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No positions match your search.
          </p>
        </div>
      )}
    </div>
  );
}
