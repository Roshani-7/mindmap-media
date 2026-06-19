import { createFileRoute, Link } from "@tanstack/react-router";
import { Moon } from "lucide-react";
import heroImg from "@/assets/hero-dream.jpg";
import { DreamBackdrop, SectionTag } from "@/components/Decorations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mind Map Media — Your Dreamy Digital Diary" },
      {
        name: "description",
        content:
          "Begin your magical journaling journey with Mind Map Media — mood tracking, gratitude, letters to your future self, and dreamy memory keeping.",
      },
      { property: "og:title", content: "Mind Map Media — Your Dreamy Digital Diary" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: "🧠", title: "Interactive Mind Map", text: "Visually connect memories, moods & themes." },
  { icon: "🌙", title: "Daily Reflections", text: "Track moods & gratitude with gentle AI prompts." },
  { icon: "💌", title: "Letters to Future You", text: "Seal a note and let time deliver it back." },
  { icon: "📌", title: "Dream Vision Board", text: "Collage your goals, Pinterest-style." },
  { icon: "🔮", title: "Memory Capsule", text: "Lock memories to unlock on a future date." },
  { icon: "🌿", title: "Life Journey", text: "A timeline of your beautiful growth." },
  { icon: "🦋", title: "AI Companion", text: "Weekly insights into your emotional world." },
];

function Landing() {
  return (
    <div className="relative min-h-screen">
      <DreamBackdrop />

      {/* Hero */}
      <section className="relative mx-auto max-w-md px-5 pt-20 text-center">
        <div className="animate-rise rounded-[2.5rem] glass-strong px-7 py-14">
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-gradient">
            Mind Map Media
          </h1>

          <p className="mt-4 font-display text-xl italic text-foreground/80">
            Thoughts. Stories. Growth.
          </p>

          <p className="mt-2 font-script text-lg text-primary">by Roshani Galande</p>

          <Link
            to="/journal"
            className="mt-9 inline-block rounded-full bg-gradient-to-r from-primary to-accent-foreground px-10 py-4 text-lg font-semibold text-primary-foreground shadow-dream transition-transform hover:scale-[1.03]"
          >
            Start Journal
          </Link>
        </div>

        <figure className="mt-7 rounded-3xl glass p-5 animate-rise" style={{ animationDelay: "0.25s" }}>
          <blockquote className="font-display text-2xl italic text-foreground">
            “She remembered who she was, and the game changed.”
          </blockquote>
          <figcaption className="mt-2 font-script text-lg text-primary">— a little reminder</figcaption>
        </figure>
      </section>


      {/* Features */}
      <section className="mx-auto mt-16 max-w-md px-5">
        <div className="text-center">
          <SectionTag>made for your soul</SectionTag>
          <h2 className="mt-3 text-4xl text-gradient">Everything you'll adore</h2>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="rounded-3xl glass p-4 text-left transition-transform hover:-translate-y-1"
              style={{ ["--r" as string]: i % 2 ? "1.5deg" : "-1.5deg", rotate: "var(--r)" }}
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-2 text-xl">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-md px-5 pb-20 text-center">
        <div className="rounded-[2rem] bg-gradient-to-br from-lilac/70 to-blush/70 p-8 shadow-dream">
          <p className="text-4xl">🫶</p>
          <h2 className="mt-2 text-3xl text-foreground">Your story deserves a beautiful home</h2>
          <Link
            to="/dashboard"
            className="mt-5 inline-block rounded-full bg-card/80 px-8 py-3 text-lg font-semibold text-primary shadow-soft transition-transform hover:scale-105"
          >
            Open my diary
          </Link>
        </div>
        <p className="mt-6 font-script text-xl text-primary">Mind Map Media · made with love 💜</p>
        <p className="mt-1 font-sans text-sm text-muted-foreground">by Roshani Galande</p>
      </section>
    </div>
  );
}
