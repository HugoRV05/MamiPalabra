---
description: The Design System & Component Law - Frontend architecture and styling rules
---

# 🎨 The Design System & Component Law

This document enforces a **Component-Driven** approach to prevent utility class sprawl and ensure consistent, maintainable styling.

---

## The "Atomic" Rule

> [!IMPORTANT]
> UI elements MUST be built as small, reusable **Atoms** stored in `components/ui/`.

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                        PAGES                                │
│  app/[route]/page.tsx → Thin routing wrappers               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      PAGE COMPONENTS                        │
│  components/pages/[feature]/FeaturePage.tsx                 │
│  → "Thick" components with business logic                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    COMPOSITE COMPONENTS                     │
│  components/[domain]/                                       │
│  → Feature-specific composed components                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      ATOMIC COMPONENTS                      │
│  components/ui/                                             │
│  → Button, Input, Badge, Card, Modal, Dropdown, etc.        │
└─────────────────────────────────────────────────────────────┘
```

### Required Atomic Components

Every project should have these base atoms in `components/ui/`:

| Component  | Responsibility     | Variants                          |
| ---------- | ------------------ | --------------------------------- |
| `Button`   | User actions       | Primary, Secondary, Ghost, Danger |
| `Input`    | Text entry         | Text, Number, Search, Password    |
| `Badge`    | Status indicators  | Success, Warning, Error, Info     |
| `Card`     | Content containers | Default, Glass, Elevated          |
| `Modal`    | Overlay dialogs    | Standard, Fullscreen              |
| `Dropdown` | Selection menus    | Single, Multi-select              |
| `Icon`     | SVG wrapper        | Standardized icon component       |
| `Spinner`  | Loading states     | Small, Medium, Large              |
| `Table`    | Data display       | Sortable, Scrollable              |

---

## CSS Variable Enforcement

> [!CAUTION]
> Every style MUST reference a variable from `globals.css`. Hardcoded hex codes or pixel values in components are **FORBIDDEN**.

### globals.css Structure

```css
:root {
  /* ========== COLOR TOKENS ========== */

  /* Primary Palette */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-active: #1d4ed8;

  /* Semantic Colors */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;

  /* Background Colors */
  --color-bg-primary: #0a0a0f;
  --color-bg-secondary: #141419;
  --color-bg-glass: rgba(255, 255, 255, 0.05);

  /* Text Colors */
  --color-text-primary: #ffffff;
  --color-text-secondary: rgba(255, 255, 255, 0.7);
  --color-text-muted: rgba(255, 255, 255, 0.4);

  /* Border Colors */
  --color-border: rgba(255, 255, 255, 0.1);
  --color-border-hover: rgba(255, 255, 255, 0.2);

  /* ========== SPACING TOKENS ========== */
  --spacing-xs: 0.25rem; /* 4px */
  --spacing-sm: 0.5rem; /* 8px */
  --spacing-md: 1rem; /* 16px */
  --spacing-lg: 1.5rem; /* 24px */
  --spacing-xl: 2rem; /* 32px */
  --spacing-2xl: 3rem; /* 48px */

  /* ========== TYPOGRAPHY TOKENS ========== */
  --font-family-base: "Inter", system-ui, sans-serif;
  --font-family-mono: "JetBrains Mono", monospace;

  --font-size-xs: 0.75rem; /* 12px */
  --font-size-sm: 0.875rem; /* 14px */
  --font-size-base: 1rem; /* 16px */
  --font-size-lg: 1.125rem; /* 18px */
  --font-size-xl: 1.25rem; /* 20px */
  --font-size-2xl: 1.5rem; /* 24px */
  --font-size-3xl: 2rem; /* 32px */

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.75;

  /* ========== LAYOUT TOKENS ========== */
  --radius-sm: 0.25rem; /* 4px */
  --radius-md: 0.5rem; /* 8px */
  --radius-lg: 0.75rem; /* 12px */
  --radius-xl: 1rem; /* 16px */
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.2);
  --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3);

  /* ========== ANIMATION TOKENS ========== */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;

  /* ========== Z-INDEX TOKENS ========== */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-tooltip: 400;
  --z-toast: 500;
}
```

### Violation Examples

```css
/* ❌ FORBIDDEN - Hardcoded values */
.card {
  background: #1a1a2e;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
}

/* ✅ CORRECT - Variable references */
.card {
  background: var(--color-bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}
```

---

## Encapsulation Pattern: CSS Modules

> [!IMPORTANT]
> Every component MUST have a matching `.module.css` file. This ensures styles are **scoped** and cannot leak.

### File Structure

```
components/ui/Button/
├── Button.tsx
├── Button.module.css
└── index.ts
```

### Component Template

```tsx
// Button.tsx
import styles from "./Button.module.css";
import { ButtonProps } from "./types";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
```

```css
/* Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

/* Variants */
.primary {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

.primary:hover {
  background: var(--color-primary-hover);
}

.secondary {
  background: var(--color-bg-glass);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

/* Sizes */
.sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
}

.md {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
}

.lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-lg);
}
```

```ts
// index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./types";
```

---

## Logic vs. View: Thin Pages, Thick Components

> [!NOTE]
> Pages in `app/` should be **Thin Wrappers** that only handle routing. All logic lives in **Thick** components in `components/pages/`.

### Thin Page Example (app/dashboard/page.tsx)

```tsx
// ❌ FORBIDDEN - Logic in page files
export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardData().then(setData);
  }, []);

  return (
    <div className={styles.container}>{/* Lots of rendering logic */}</div>
  );
}

// ✅ CORRECT - Thin wrapper that delegates to page component
import { DashboardPage } from "@/components/pages/dashboard";

export default function Page() {
  return <DashboardPage />;
}
```

### Thick Component Example (components/pages/dashboard/DashboardPage.tsx)

```tsx
import { useDashboardData } from "@/hooks/useDashboardData";
import { MetricsCard } from "@/components/ui/MetricsCard";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </header>

      <section className={styles.metrics}>
        {data.metrics.map((metric) => (
          <MetricsCard key={metric.id} {...metric} />
        ))}
      </section>
    </div>
  );
}
```

---

## Component Creation Checklist

Before creating a new component:

- [ ] Is this component **reusable**? → Place in `components/ui/`
- [ ] Is this component **page-specific**? → Place in `components/pages/[feature]/`
- [ ] Does it have a `.module.css` file?
- [ ] Are all styles using CSS variables?
- [ ] Is there an `index.ts` for clean exports?
- [ ] Are props properly typed?
- [ ] Is the component free of business logic (if atomic)?

---

## Anti-Patterns to Avoid

### ❌ Utility Class Hell

```tsx
// FORBIDDEN - Inline utility classes
<div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
```

### ❌ Inline Styles

```tsx
// FORBIDDEN - Inline style objects
<div style={{ padding: '16px', background: '#1a1a2e' }}>
```

### ❌ Global Class Names

```css
/* FORBIDDEN - Unscoped class names */
.button {
}
.card {
}
```

### ✅ Correct Approach

```tsx
// CSS Module with scoped classes
import styles from "./Component.module.css";

<div className={styles.container}>
  <Card className={styles.card}>
    <Button variant="primary">Action</Button>
  </Card>
</div>;
```
