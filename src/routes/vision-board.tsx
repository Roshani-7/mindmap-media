import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DreamBackdrop, WashiTape } from "@/components/Decorations";
import { AppShell } from "@/components/AppShell";
import { getDreamPinIdeas } from "@/lib/api/vision-ai.functions";
import type { DreamPinIdea } from "@/lib/ai/vision-ideas.server";

export const Route = createFileRoute("/vision-board")({
  head: () => ({
    meta: [
      { title: "Vision Board — The MindMap Media" },
      { name: "description", content: "A Pinterest-style dream collage of your goals and inspiration." },
    ],
  }),
  component: VisionBoard,
});

interface Pin {
  h: string;
  e: string;
  t: string;
  c: string;
}

const initialPins: Pin[] = [
  { h: "h-40", e: "🏖️", t: "Slow travel by the sea", c: "from-accent/60 to-card" },
  { h: "h-28", e: "📚", t: "Read 24 books", c: "from-lilac/60 to-card" },
  { h: "h-36", e: "🧘‍♀️", t: "Morning yoga ritual", c: "from-blush/60 to-card" },
  { h: "h-44", e: "🏡", t: "A cozy creative home", c: "from-gold/40 to-card" },
  { h: "h-32", e: "🌻", t: "Grow a flower garden", c: "from-lilac/50 to-card" },
  { h: "h-40", e: "💍", t: "Love that feels like home", c: "from-blush/70 to-card" },
];

const pinPresets: Pin[] = [
  { h: "h-36", e: "✈️", t: "See the northern lights", c: "from-accent/60 to-card" },
  { h: "h-32", e: "🎨", t: "Sell my first painting", c: "from-lilac/60 to-card" },
  { h: "h-40", e: "🌊", t: "Learn to surf", c: "from-blush/60 to-card" },
  { h: "h-28", e: "📝", t: "Write a little book", c: "from-gold/40 to-card" },
  { h: "h-36", e: "🎻", t: "Play an instrument", c: "from-lilac/50 to-card" },
];

const goals = [
  { t: "Journal every day", p: 78 },
  { t: "Save for the trip", p: 45 },
  { t: "Learn watercolor", p: 30 },
];

const ideaColors = [
  "from-accent/60 to-card",
  "from-lilac/60 to-card",
  "from-blush/60 to-card",
  "from-gold/40 to-card",
  "from-lilac/50 to-card",
];

function VisionBoard() {
  const [pins, setPins] = useState<Pin[]>(initialPins);
  const [ideas, setIdeas] = useState<DreamPinIdea[] | null>(null);
  const [loadingIdeas, setLoadingIdeas] = useState(false);

  const addPin = () => {
    const preset = pinPresets[pins.length % pinPresets.length];
    setPins((p) => [...p, preset]);
    toast.success("Dream pinned ✨", { description: preset.t });
  };

  const fetchIdeas = async () => {
    if (loadingIdeas) return;
    setLoadingIdeas(true);
    try {
      const result = await getDreamPinIdeas({
        data: { pins: pins.map((p) => p.t), goals: goals.map((g) => g.t) },
      });
      setIdeas(result);
      toast.success("Fresh dream ideas ✨", { description: "Tap Pin on any idea you love." });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something dreamy went wrong — try again 💜");
    } finally {
      setLoadingIdeas(false);
    }
  };

  const pinIdea = (idea: DreamPinIdea) => {
    setPins((p) => [
      ...p,
      { h: "h-32", e: idea.emoji, t: idea.text, c: ideaColors[p.length % ideaColors.length] },
    ]);
    setIdeas((list) => (list ? list.filter((i) => i.text !== idea.text) : list));
    toast.success("Dream pinned ✨", { description: idea.text });
  };

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

        <button
          onClick={fetchIdeas}
          disabled={loadingIdeas}
          className="my-4 w-full rounded-full bg-gradient-to-r from-primary to-accent-foreground py-3.5 text-lg font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {loadingIdeas ? "Dreaming up ideas… ✨" : "✨ Ask AI for dream ideas"}
        </button>

        {ideas && ideas.length > 0 && (
          <section className="animate-rise rounded-3xl glass-strong p-5">
            <h2 className="text-2xl">AI dream ideas 💫</h2>
            <div className="mt-3 space-y-2">
              {ideas.map((idea) => (
                <div key={idea.text} className="flex items-center gap-3 rounded-2xl bg-card/60 p-3">
                  <span className="text-2xl">{idea.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight text-foreground">{idea.text}</p>
                    <p className="text-xs font-semibold text-muted-foreground">{idea.category}</p>
                  </div>
                  <button
                    onClick={() => pinIdea(idea)}
                    className="shrink-0 rounded-full bg-gradient-to-r from-gold/80 to-blush/70 px-4 py-2 text-sm font-bold text-gold-foreground shadow-sm transition-transform hover:scale-105"
                  >
                    Pin ✨
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <button
          onClick={addPin}
          className="mt-4 w-full rounded-full glass py-3.5 font-semibold text-primary transition-transform hover:scale-[1.02]"
        >
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
