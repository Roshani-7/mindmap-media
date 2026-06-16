import { createFileRoute } from "@tanstack/react-router";
import { DreamBackdrop, WashiTape } from "@/components/Decorations";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/vision-board")({
  head: () => ({
    meta: [
      { title: "Vision Board — Mind Map Media" },
      { name: "description", content: "A Pinterest-style dream collage of your goals and inspiration." },
    ],
  }),
  component: VisionBoard,
});

const pins = [
  { h: "h-40", e: "🏖️", t: "Slow travel by the sea", c: "from-accent/60 to-card" },
  { h: "h-28", e: "📚", t: "Read 24 books", c: "from-lilac/60 to-card" },
  { h: "h-36", e: "🧘‍♀️", t: "Morning yoga ritual", c: "from-blush/60 to-card" },
  { h: "h-44", e: "🏡", t: "A cozy creative home", c: "from-gold/40 to-card" },
  { h: "h-32", e: "🌻", t: "Grow a flower garden", c: "from-lilac/50 to-card" },
  { h: "h-40", e: "💍", t: "Love that feels like home", c: "from-blush/70 to-card" },
];

const goals = [
  { t: "Journal every day", p: 78 },
  { t: "Save for the trip", p: 45 },
  { t: "Learn watercolor", p: 30 },
];

function VisionBoard() {
  return (
    <>
      <DreamBackdrop />
      <AppShell emoji="📌" title="Vision board">
        <p className="-mt-4 mb-5 font-script text-xl text-primary">dream it, pin it, become it ✨</p>

        {/* Masonry pins */}
        <div className="columns-2 gap-3 [column-fill:_balance]">
          {pins.map((p, i) => (
            <div
              key={i}
              className={`mb-3 break-inside-avoid rounded-3xl bg-gradient-to-br ${p.c} ${p.h} animate-rise p-4 shadow-soft transition-transform hover:-translate-y-1`}
              style={{ ["--r" as string]: i % 2 ? "1.2deg" : "-1.2deg", rotate: "var(--r)" }}
            >
              {i % 2 === 0 && <WashiTape className="mb-2 block" />}
              <div className="text-4xl">{p.e}</div>
              <p className="mt-2 font-display text-xl leading-tight text-foreground">{p.t}</p>
            </div>
          ))}
        </div>

        <button className="my-4 w-full rounded-full glass py-3.5 font-semibold text-primary transition-transform hover:scale-[1.02]">
          ➕ Add a dream pin
        </button>

        {/* Goal tracking */}
        <section className="animate-rise rounded-3xl glass-strong p-5">
          <h2 className="text-2xl">Goal tracking 🎯</h2>
          <div className="mt-4 space-y-4">
            {goals.map((g) => (
              <div key={g.t}>
                <div className="flex justify-between text-sm font-semibold text-foreground">
                  <span>{g.t}</span>
                  <span className="text-primary">{g.p}%</span>
                </div>
                <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent-foreground"
                    style={{ width: `${g.p}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </AppShell>
    </>
  );
}
