import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Sparkles, Wand2, FileText, Mail, Share2, Search, Save, Send } from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { articles } from "@/lib/mock-data";

export const Route = createFileRoute("/articles/$articleId")({
  component: ArticleEditor,
});

function ArticleEditor() {
  const { articleId } = Route.useParams();
  const article = articles.find((a) => String(a.id) === articleId);
  const title = article?.title ?? "Untitled article";

  return (
    <PageShell title="Article Editor" subtitle={article ? `${article.city} · ${article.category}` : "New draft"}>
      <Link to="/articles" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-3 w-3" /> All articles
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <SectionCard>
            <input defaultValue={title} className="w-full text-2xl font-semibold tracking-tight bg-transparent focus:outline-none" />
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Badge tone="warning">Draft</Badge>
              <span>· Autosaved 2s ago</span>
            </div>
            <div className="mt-5 space-y-3 text-sm leading-relaxed">
              <p className="text-muted-foreground">Lead paragraph — replace with article hook.</p>
              <textarea
                rows={14}
                defaultValue="Write the body of the article here. The AI assistant on the right can rewrite, summarize, optimize SEO, and generate newsletter or social variants from this content."
                className="w-full bg-transparent focus:outline-none resize-none border-t border-border pt-3"
              />
            </div>
          </SectionCard>

          <SectionCard title="SEO" description="Search optimization metadata">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Meta title</label>
                <input defaultValue={title} className="mt-1 h-9 w-full px-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Slug</label>
                <input defaultValue={title.toLowerCase().replace(/\s+/g, "-").slice(0, 40)} className="mt-1 h-9 w-full px-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Meta description</label>
                <textarea rows={2} defaultValue="A concise meta description optimized for search snippets." className="mt-1 w-full px-3 py-2 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Tags</label>
                <input defaultValue="local, breaking, ai" className="mt-1 h-9 w-full px-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <select className="mt-1 h-9 w-full px-3 text-sm rounded-md border border-border bg-card">
                  <option>Local News</option><option>Real Estate</option><option>Local Sports</option>
                  <option>Local Business</option><option>Trending National</option>
                </select>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="AI Assistant" description="One-click content actions" action={<Badge tone="primary"><Sparkles className="h-2.5 w-2.5" />GPT-4o</Badge>}>
            <ul className="space-y-2">
              {[
                { icon: Wand2, label: "Rewrite headline" },
                { icon: FileText, label: "Summarize" },
                { icon: Search, label: "Improve SEO" },
                { icon: Mail, label: "Generate newsletter version" },
                { icon: Share2, label: "Generate social caption" },
              ].map((a) => (
                <li key={a.label}>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted/50 transition text-left">
                    <a.icon className="h-3.5 w-3.5 text-primary" />
                    <span>{a.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Publish">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">AI confidence</span>
                <span className="font-semibold tabular-nums">{((article?.aiConfidence ?? 0.78) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Source credibility</span>
                <Badge tone="success">High</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge tone="warning">Pending Review</Badge>
              </div>
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <button className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center justify-center gap-1.5 font-medium hover:bg-primary/90">
                  <Send className="h-3.5 w-3.5" /> Publish now
                </button>
                <button className="h-9 px-3 text-sm rounded-md border border-border bg-card inline-flex items-center justify-center gap-1.5 hover:bg-muted">
                  <Save className="h-3.5 w-3.5" /> Save draft
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Live Preview">
            <div className="text-xs text-muted-foreground">{article?.city ?? "City"}</div>
            <h3 className="mt-1 text-base font-semibold leading-snug">{title}</h3>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-3">A preview of how this article appears on the published city site.</p>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}
