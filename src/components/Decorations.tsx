import React from "react";

/* Floating dreamy background decorations made of emoji + glow blobs */
export function DreamBackdrop() {
  const items: { e: string; cls: string; style: React.CSSProperties }[] = [
    { e: "🦋", cls: "animate-float text-3xl", style: { top: "12%", left: "8%", ["--r" as string]: "-8deg" } },
    { e: "🌙", cls: "animate-drift text-4xl", style: { top: "8%", right: "10%" } },
    { e: "✨", cls: "animate-twinkle text-2xl", style: { top: "26%", right: "22%" } },
    { e: "💜", cls: "animate-float text-2xl", style: { top: "42%", left: "6%", ["--r" as string]: "10deg" } },
    { e: "☁️", cls: "animate-drift text-4xl opacity-70", style: { top: "58%", right: "8%" } },
    { e: "⭐", cls: "animate-twinkle text-xl", style: { bottom: "20%", left: "16%" } },
    { e: "🌸", cls: "animate-float text-3xl", style: { bottom: "12%", right: "14%", ["--r" as string]: "-12deg" } },
    { e: "🎀", cls: "animate-drift text-2xl", style: { bottom: "34%", left: "4%" } },
  ];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-lilac/40 blur-3xl" />
      <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-blush/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
      {items.map((it, i) => (
        <span key={i} className={`absolute select-none ${it.cls}`} style={it.style}>
          {it.e}
        </span>
      ))}
    </div>
  );
}

export function WashiTape({ className = "" }: { className?: string }) {
  return (
    <span
      className={`washi inline-block h-5 w-24 rotate-[-6deg] rounded-[3px] opacity-80 shadow-sm ${className}`}
    />
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return <span className={`animate-twinkle ${className}`}>✨</span>;
}

export function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-lilac/60 to-blush/60 px-4 py-1.5 font-script text-lg text-primary shadow-soft">
      <span>🌷</span>
      {children}
    </span>
  );
}
