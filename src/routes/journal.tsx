import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DreamBackdrop } from "@/components/Decorations";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Write — Mind Map Media" },
      { name: "description", content: "Your dreamy journaling space with stickers, moods and photos." },
    ],
  }),
  component: Journal,
});

const stickers = ["🌸", "🦋", "💜", "⭐", "🌙", "🎀", "☁️", "🍓", "🕯️", "📷", "🧸", "🌷"];
const backgrounds = [
  { l: "Lavender", c: "from-lilac/60 to-card" },
  { l: "Blush", c: "from-blush/60 to-card" },
  { l: "Cloud", c: "from-accent/50 to-card" },
];

function Journal() {
  const [text, setText] = useState("");
  const [placed, setPlaced] = useState<string[]>(["🌸", "🦋"]);
  const [bg, setBg] = useState(backgrounds[0]);
  const [mood, setMood] = useState("😌");

  return (
    <>
      <DreamBackdrop />
      <AppShell emoji="🖊️" title="Today's page">
        {/* Editor */}
        <section className={`animate-rise rounded-3xl bg-gradient-to-br ${bg.c} p-5 shadow-dream`}>
          <div className="mb-3 flex items-center gap-2">
            {["😌", "🥰", "😊", "🥲", "😔"].map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`text-2xl transition-transform ${mood === m ? "scale-125" : "opacity-50"}`}
              >
                {m}
              </button>
            ))}
            <span className="ml-auto font-script text-lg text-primary">Dear diary,</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pour your heart out here..."
            rows={7}
            className="w-full resize-none rounded-2xl border border-border bg-card/60 p-4 font-sans text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          <div className="mt-3 flex flex-wrap gap-2 text-3xl">
            {placed.map((s, i) => (
              <span key={i} className="animate-float" style={{ ["--r" as string]: `${i * 7 - 7}deg`, rotate: "var(--r)" }}>
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Toolbar */}
        <section className="mt-4 grid grid-cols-3 gap-3">
          <button className="rounded-2xl glass py-3 text-sm font-semibold text-primary transition-transform hover:scale-105">📷 Photo</button>
          <button className="rounded-2xl glass py-3 text-sm font-semibold text-primary transition-transform hover:scale-105">🎙️ Voice</button>
          <button className="rounded-2xl glass py-3 text-sm font-semibold text-primary transition-transform hover:scale-105">🎨 Doodle</button>
        </section>

        {/* Backgrounds */}
        <section className="mt-4 animate-rise rounded-3xl glass p-5">
          <h2 className="text-xl">Decorative background</h2>
          <div className="mt-3 flex gap-3">
            {backgrounds.map((b) => (
              <button
                key={b.l}
                onClick={() => setBg(b)}
                className={`h-14 flex-1 rounded-2xl bg-gradient-to-br ${b.c} text-xs font-semibold transition-transform ${
                  bg.l === b.l ? "scale-105 ring-2 ring-primary" : ""
                }`}
              >
                {b.l}
              </button>
            ))}
          </div>
        </section>

        {/* Sticker library */}
        <section className="mt-4 animate-rise rounded-3xl glass p-5">
          <h2 className="text-xl">Sticker library ✨</h2>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {stickers.map((s) => (
              <button
                key={s}
                onClick={() => setPlaced((p) => [...p, s])}
                className="rounded-2xl bg-card/70 py-2 text-2xl transition-transform hover:scale-110 hover:bg-muted"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <button className="mt-5 w-full rounded-full bg-gradient-to-r from-primary to-accent-foreground py-4 text-lg font-semibold text-primary-foreground shadow-dream transition-transform hover:scale-[1.02]">
          Save this page 💾
        </button>
      </AppShell>
    </>
  );
}
