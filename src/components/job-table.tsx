"use client";

import { useState, useMemo } from "react";
import type { Job } from "@/data/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
};

type SortField = "title" | "company" | "location" | "department";

export function JobTable({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("company");
  const [sortAsc, setSortAsc] = useState(true);
  const [activeCompany, setActiveCompany] = useState<string | null>(null);

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
    result.sort((a, b) => {
      const aVal = a[sortField].toLowerCase();
      const bVal = b[sortField].toLowerCase();
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return result;
  }, [jobs, search, sortField, sortAsc, activeCompany]);

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
      <div className="flex items-center gap-2 mb-4">
        <div className="relative min-w-[400px]">
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
            className="h-8 text-sm pl-8 w-full"
          />
        </div>
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
                  onClick={() => handleSort("department")}
                >
                  Team
                  <SortIndicator field="department" />
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
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${domainMap[job.company] || "example.com"}&sz=64`}
                        alt=""
                        width={18}
                        height={18}
                        className="rounded-[3px] shrink-0"
                      />
                      <span className="font-medium text-sm truncate">
                        {job.company}
                      </span>
                    </button>
                  </td>
                  <td className="py-2.5 px-3 align-middle text-sm">
                    {job.title}
                  </td>
                  <td className="py-2.5 px-3 align-middle hidden md:table-cell text-muted-foreground text-xs">
                    {job.location}
                  </td>
                  <td className="py-2.5 px-3 align-middle hidden lg:table-cell">
                    <Badge variant="outline" className="font-normal">
                      {job.department}
                    </Badge>
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
