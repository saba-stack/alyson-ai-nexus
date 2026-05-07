import type { ReactNode } from "react";
import { TopBar } from "./TopBar";

export function PageShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <TopBar title={title} subtitle={subtitle} />
      <div className="px-8 py-6">
        {actions && <div className="mb-4 flex items-center justify-end gap-2">{actions}</div>}
        {children}
      </div>
    </>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-card border border-border rounded-xl shadow-card ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
          <div>
            {title && <h2 className="text-sm font-semibold tracking-tight">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "destructive" | "primary" | "brand";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-muted text-muted-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
    primary: "bg-primary/10 text-primary",
    brand: "bg-brand/15 text-brand-foreground",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
