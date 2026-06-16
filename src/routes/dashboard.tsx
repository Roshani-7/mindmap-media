import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DreamBackdrop, WashiTape } from "@/components/Decorations";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SoulPages" },
      { name: "description", content: "Your daily mood, gratitude, streaks and reflections." },
    ],
  }),
  component: Dashboard,
});

const moods = [
  { e: "🥰", l: "Loved" },
  { e: "😊", l: "Happy" },
  { e: "😌", l: "Calm" },
  { e: "🥲", l: "Tender" },
  { e: "😔", l: "Low" },
  { e: "😴", l: "Tired" },
];

const badges = ["🌱 First Page", "🔥 7-Day Streak", "💌 Time Traveler", "✨ Gratitude Guru"];

function Dashboard() {
  const [mood, setMood] = useState<string | null>("Calm");
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <>
      <DreamBackdrop />
      <AppShell emoji="☀️" title="Hello, lovely">
        <p className="-mt-4 mb-5 font-script text-xl text-primary">{today}</p>

        {/* Mood tracker */}
        <section className="animate-rise rounded-3xl glass p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">How's your heart? 💗</h2>
            <WashiTape />
          </div>
          <div className="mt-4 grid grid-cols-6 gap-2">
            {moods.map((m) => (
              <button
                key={m.l}
                onClick={() => setMood(m.l)}
                className={`flex flex-col items-center rounded-2xl py-2 transition-all ${
                  mood === m.l ? "scale-110 bg-gradient-to-br from-lilac to-blush shadow-soft" : "hover:bg-muted"
                }`}
              >
                <span className="text-2xl">{m.e}</span>
                <span className="mt-1 text-[0.6rem] text-muted-foreground">{m.l}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mt-4 grid grid-cols-2 gap-4">
          <div className="animate-rise rounded-3xl bg-gradient-to-br from-primary/90 to-accent-foreground/80 p-5 text-primary-foreground shadow-dream">
            <p className="text-4xl font-bold">12 🔥</p>
            <p className="mt-1 text-sm opacity-90">Day journaling streak</p>
          </div>
          <div className="animate-rise rounded-3xl glass p-5">
            <p className="text-4xl font-bold text-primary">48</p>
            <p className="mt-1 text-sm text-muted-foreground">Pages written 📖</p>
          </div>
        </section>

        {/* Gratitude */}
        <section className="mt-4 animate-rise rounded-3xl bg-gradient-to-br from-blush/70 to-card p-5 shadow-soft">
          <h2 className="text-2xl">Today I'm grateful for 🌷</h2>
          <ul className="mt-3 space-y-2 font-script text-xl text-foreground">
            <li>🌸 quiet mornings with tea</li>
            <li>💜 friends who text back</li>
            <li>✨ the way sunlight falls</li>
          </ul>
        </section>

        {/* AI prompt */}
        <section className="mt-4 animate-rise rounded-3xl glass-strong p-5">
          <p className="font-script text-xl text-primary">🦋 Your AI reflection companion asks</p>
          <p className="mt-2 font-display text-2xl italic text-foreground">
            “What is one small thing that made you smile today, and why did it matter?”
          </p>
          <button className="mt-4 rounded-full bg-gradient-to-r from-primary to-accent-foreground px-6 py-2.5 font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105">
            Reflect now ✍️
          </button>
        </section>

        {/* Badges */}
        <section className="mt-4 animate-rise rounded-3xl glass p-5">
          <h2 className="text-2xl">Your achievements 🏆</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span key={b} className="rounded-full bg-gradient-to-r from-gold/70 to-blush/60 px-4 py-1.5 text-sm font-semibold text-gold-foreground shadow-sm">
                {b}
              </span>
            ))}
          </div>
        </section>
      </AppShell>
    </>
  );
}
