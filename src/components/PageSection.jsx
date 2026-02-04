export function PageSection({ title, subtitle, children, className = '' }) {
  return (
    <section className={`max-w-6xl mx-auto px-4 sm:px-6 py-8 ${className}`}>
      {title && (
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          {subtitle && <p className="text-primary/70 mt-1">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
