"use client";

import { useState, useMemo } from "react";
import type { Job } from "@/data/jobs";

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
  "Adept AI": "adept.ai",
  Midjourney: "midjourney.com",
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
      <span className="ml-1 text-foreground/40">{sortAsc ? "↑" : "↓"}</span>
    );
  }

  return (
    <div>
      {/* Search + filter bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            width="16"
            height="16"
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
          <input
            type="text"
            placeholder="Search roles, companies, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-surface border border-border text-[14px] placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
          />
        </div>
        {activeCompany && (
          <button
            onClick={() => setActiveCompany(null)}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-foreground text-surface text-[13px] font-medium hover:bg-foreground/80 transition-colors"
          >
            {activeCompany}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        <span className="text-[13px] text-muted ml-auto">
          {filtered.length} position{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th
                  className="text-left text-[12px] font-medium uppercase tracking-wider text-muted py-3 px-4 cursor-pointer hover:text-foreground transition-colors select-none"
                  onClick={() => handleSort("company")}
                >
                  Company
                  <SortIndicator field="company" />
                </th>
                <th
                  className="text-left text-[12px] font-medium uppercase tracking-wider text-muted py-3 px-4 cursor-pointer hover:text-foreground transition-colors select-none"
                  onClick={() => handleSort("title")}
                >
                  Role
                  <SortIndicator field="title" />
                </th>
                <th
                  className="text-left text-[12px] font-medium uppercase tracking-wider text-muted py-3 px-4 cursor-pointer hover:text-foreground transition-colors hidden md:table-cell select-none"
                  onClick={() => handleSort("location")}
                >
                  Location
                  <SortIndicator field="location" />
                </th>
                <th
                  className="text-left text-[12px] font-medium uppercase tracking-wider text-muted py-3 px-4 cursor-pointer hover:text-foreground transition-colors hidden lg:table-cell select-none"
                  onClick={() => handleSort("department")}
                >
                  Team
                  <SortIndicator field="department" />
                </th>
                <th className="py-3 px-4 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job, i) => (
                <tr
                  key={`${job.company}-${job.title}-${i}`}
                  className="border-b border-border-light last:border-0 group hover:bg-surface-alt transition-colors"
                >
                  <td className="py-3.5 px-4 align-middle">
                    <button
                      onClick={() =>
                        setActiveCompany(
                          activeCompany === job.company ? null : job.company
                        )
                      }
                      className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
                    >
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${domainMap[job.company] || "example.com"}&sz=64`}
                        alt=""
                        width={20}
                        height={20}
                        className="rounded-[4px] shrink-0"
                      />
                      <span className="font-medium text-[14px]">
                        {job.company}
                      </span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 align-middle">
                    <span className="group-hover:text-foreground transition-colors">
                      {job.title}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 align-middle hidden md:table-cell text-muted text-[13px]">
                    {job.location}
                  </td>
                  <td className="py-3.5 px-4 align-middle hidden lg:table-cell">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-surface-alt border border-border-light text-[12px] text-muted">
                      {job.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 align-middle text-right">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center h-8 px-4 rounded-full bg-foreground text-surface text-[13px] font-medium hover:bg-foreground/80 transition-colors"
                    >
                      Apply
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted text-[14px]">
            No positions match your search.
          </p>
        </div>
      )}
    </div>
  );
}
