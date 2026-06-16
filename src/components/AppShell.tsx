import { Link, useRouterState } from "@tanstack/react-router";

const links = [
  { to: "/dashboard", label: "Home", icon: "🏠" },
  { to: "/journal", label: "Write", icon: "🖊️" },
  { to: "/timeline", label: "Journey", icon: "🌿" },
  { to: "/vision-board", label: "Vision", icon: "✨" },
  { to: "/letters", label: "Letters", icon: "💌" },
] as const;

export function AppNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto mb-3 flex max-w-md items-center justify-around gap-1 rounded-3xl px-2 py-2 glass-strong">
      {links.map((l) => {
        const active = pathname === l.to;
        return (
          <Link
            key={l.to}
            to={l.to}
            className={`flex flex-1 flex-col items-center rounded-2xl px-1 py-1.5 text-[0.65rem] font-semibold transition-all ${
              active
                ? "scale-105 bg-gradient-to-br from-primary to-accent-foreground/70 text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <span className="text-lg leading-none">{l.icon}</span>
            <span className="mt-1">{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  children,
  title,
  emoji,
}: {
  children: React.ReactNode;
  title: string;
  emoji: string;
}) {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md px-4 pb-28 pt-8">
      <header className="mb-6 animate-rise">
        <p className="font-script text-2xl text-primary">{emoji} Mind Map Media</p>
        <h1 className="mt-1 text-4xl text-gradient">{title}</h1>
      </header>
      {children}
      <AppNav />
    </div>
  );
}
