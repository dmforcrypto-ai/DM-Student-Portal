import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Grade helpers — change these two functions if your scale isn't 0–100.
// ---------------------------------------------------------------------------

export function letterFor(grade: number): string {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 75) return 'C';
  if (grade >= 70) return 'D';
  return 'F';
}

export function bandFor(grade: number): 'pass' | 'watch' | 'fail' {
  if (grade >= 80) return 'pass';
  if (grade >= 75) return 'watch';
  return 'fail';
}

export function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

// ---------------------------------------------------------------------------

export function Panel({
  title,
  action,
  children,
  className = '',
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-[var(--surface)] border border-[var(--line)] rounded-sm ${className}`}
    >
      {title && (
        <header className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[var(--line)]">
          <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'quiet' | 'danger';
};

export function Button({ variant = 'solid', className = '', ...props }: ButtonProps) {
  const styles: Record<string, string> = {
    solid: 'bg-[var(--ink)] text-white hover:bg-[var(--ink-soft)]',
    quiet: 'bg-transparent text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--canvas)]',
    danger: 'bg-transparent text-[var(--fail)] border border-[var(--fail)]/30 hover:bg-[var(--fail)]/5',
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-45 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
  );
}

export function Field({
  label,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <input
        {...props}
        className="w-full rounded-sm border border-[var(--line)] bg-white px-3 py-2 text-sm placeholder:text-[var(--muted)]/60 focus:border-[var(--ink)] focus:outline-none"
      />
      {hint && <span className="mt-1 block text-xs text-[var(--muted)]">{hint}</span>}
    </label>
  );
}

export function GradePill({ grade }: { grade: number }) {
  const band = bandFor(grade);
  const color = `var(--${band})`;
  return (
    <span
      className="figures inline-flex items-baseline gap-1.5 rounded-sm px-2 py-0.5 text-sm font-semibold"
      style={{ color, backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)` }}
    >
      {grade}
      <span className="text-[11px] font-medium opacity-70">{letterFor(grade)}</span>
    </span>
  );
}

export function CourseCode({ code }: { code: string }) {
  return (
    <span className="figures rounded-sm bg-[var(--canvas)] px-1.5 py-0.5 text-[12px] font-semibold tracking-wide text-[var(--ink-soft)]">
      {code}
    </span>
  );
}

export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-8 text-sm text-[var(--muted)]">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--ink)]" />
      {label}
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="px-5 py-6">
      <p className="text-sm text-[var(--fail)]">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm font-medium underline underline-offset-4">
          Try again
        </button>
      )}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      {children && <div className="mt-2 text-sm text-[var(--muted)]">{children}</div>}
    </div>
  );
}
