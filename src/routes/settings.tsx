import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard } from "@/components/PageShell";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const sections = [
  { title: "City Management", desc: "Add, pause, or remove city sites and configure subdomains.", fields: [["Default subdomain pattern", "{slug}.alyson.news"], ["Auto-provision subdomain", "Enabled"]] },
  { title: "API Keys", desc: "Manage API credentials for AI providers and integrations.", fields: [["OpenAI key", "sk-···7a2"], ["Claude key", "sk-ant-···91f"], ["DeepSeek key", "ds-···c44"]] },
  { title: "Automation Rules", desc: "Trigger conditions for auto-publishing and ranking.", fields: [["Auto-publish threshold", "AI confidence ≥ 0.85"], ["Auto-rank cadence", "Every 5 minutes"]] },
  { title: "Scraping Settings", desc: "Source ingestion frequency and quotas.", fields: [["Reddit poll interval", "60s"], ["TikTok poll interval", "120s"], ["Daily article cap", "1,200"]] },
  { title: "Moderation Settings", desc: "Human review thresholds.", fields: [["Require review below", "AI confidence 0.75"], ["Reviewers", "Sarah, Emma, Mike"]] },
  { title: "SEO Defaults", desc: "Network-wide SEO defaults.", fields: [["Default OG image", "alyson-share.png"], ["Sitemap refresh", "Hourly"]] },
];

function SettingsPage() {
  return (
    <PageShell title="Settings" subtitle="System configuration">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((s) => (
          <SectionCard key={s.title} title={s.title} description={s.desc}>
            <dl className="divide-y divide-border -my-2">
              {s.fields.map(([k, v]) => (
                <div key={k} className="py-2.5 flex items-center justify-between text-sm">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>
        ))}
      </div>
    </PageShell>
  );
}
