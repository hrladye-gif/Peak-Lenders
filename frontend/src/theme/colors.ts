@import "tailwindcss";

@theme {
  /* Primary Brand */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-primary-light: #dbeafe;

  /* Accent */
  --color-secondary: #0f172a;
  --color-secondary-light: #334155;

  /* Status */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;

  /* Neutrals */
  --color-text: #0f172a;
  --color-muted: #64748b;
  --color-border: #e2e8f0;
  --color-background: #f8fafc;
  --color-surface: #ffffff;

  /* Sidebar */
  --color-sidebar: #0f172a;
  --color-sidebar-hover: #1e293b;
  --color-sidebar-active: #2563eb;
  --color-sidebar-text: #cbd5e1;

  /* Cards */
  --color-card: #ffffff;
  --color-card-border: #e2e8f0;

  /* Charts */
  --color-chart-1: #2563eb;
  --color-chart-2: #38bdf8;
  --color-chart-3: #06b6d4;
  --color-chart-4: #6366f1;
  --color-chart-5: #10b981;
}

/* If you want a custom `.card` utility class to use directly in JSX */
@utility card {
  background-color: var(--color-card);
  border: 1px solid var(--color-card-border);
  border-radius: 1rem;
  padding: 1.5rem;
}
