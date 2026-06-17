import React from "react";

/* Subtle gradient background with soft glow blobs — no emoji stickers */
export function DreamBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-lilac/30 blur-3xl animate-drift" />
      <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-blush/30 blur-3xl animate-float" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-accent/25 blur-3xl animate-drift" />
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
