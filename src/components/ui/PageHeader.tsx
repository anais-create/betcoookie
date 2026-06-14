interface PageHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  action?: React.ReactNode;
}

/** En-tête de page standard (titre display + sous-titre). */
export function PageHeader({ title, subtitle, emoji, action }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-extrabold text-choc-chip sm:text-3xl">
          {emoji && <span className="mr-1.5">{emoji}</span>}
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-choc-chip/70">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
