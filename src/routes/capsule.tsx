import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DreamBackdrop } from "@/components/Decorations";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/capsule")({
  head: () => ({
    meta: [
      { title: "Memory Capsule — Mind Map Media" },
      { name: "description", content: "Lock precious memories away to unlock on a future date." },
    ],
  }),
  component: Capsule,
});

const capsules = [
  { title: "Summer of 2024", unlock: "Unlocks in 92 days", locked: true, e: "🌅" },
  { title: "Letter from mum", unlock: "Unlocks in 12 days", locked: true, e: "💐" },
  { title: "My 21st birthday", unlock: "Unlocked! 🎉", locked: false, e: "🎂" },
];

function Capsule() {
  const [revealed, setRevealed] = useState<string | null>(null);

  return (
    <>
      <DreamBackdrop />
      <AppShell emoji="🔮" title="Memory capsule">
        <p className="-mt-4 mb-5 font-script text-xl text-primary">treasures saved for future you 🪄</p>

        {/* Treasure box */}
        <section className="animate-rise rounded-3xl bg-gradient-to-br from-primary/90 to-accent-foreground/80 p-7 text-center text-primary-foreground shadow-dream">
          <div className="text-7xl">🧰</div>
          <p className="mt-2 font-script text-2xl">3 memories sealed inside</p>
          <button
            onClick={() => toast("🪄 Memory burying ritual coming soon!", { description: "You'll be able to seal new memories here." })}
            className="mt-4 rounded-full bg-card/80 px-7 py-2.5 font-semibold text-primary shadow-soft transition-transform hover:scale-105"
          >
            ➕ Bury a new memory
          </button>
        </section>

        {/* Capsules */}
        <div className="mt-5 space-y-3">
          {capsules.map((c) => (
            <div
              key={c.title}
              className="animate-rise overflow-hidden rounded-3xl glass p-5"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-lilac to-blush text-3xl">
                  {c.locked ? "🔒" : c.e}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xl">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.unlock}</p>
                </div>
                {!c.locked && (
                  <button
                    onClick={() => setRevealed(revealed === c.title ? null : c.title)}
                    className="shrink-0 rounded-full bg-gradient-to-r from-gold/80 to-blush/70 px-4 py-2 text-sm font-bold text-gold-foreground shadow-sm transition-transform hover:scale-105"
                  >
                    Open ✨
                  </button>
                )}
              </div>
              {revealed === c.title && (
                <div className="mt-4 animate-rise rounded-2xl bg-card/70 p-4 font-display text-lg italic text-foreground">
                  {c.e} “You blew out the candles surrounded by everyone you love. You felt
                  unstoppable. Hold onto that.”
                </div>
              )}
            </div>
          ))}
        </div>
      </AppShell>
    </>
  );
}
