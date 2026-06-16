import { createFileRoute } from "@tanstack/react-router";
import { DreamBackdrop, WashiTape } from "@/components/Decorations";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Life Journey — SoulPages" },
      { name: "description", content: "An interactive timeline of your milestones and growth." },
    ],
  }),
  component: Timeline,
});

const events = [
  { date: "Jan 2024", icon: "🌱", title: "Started journaling", text: "The first page of a brand new chapter.", mood: "😊" },
  { date: "Apr 2024", icon: "🌷", title: "Found my morning ritual", text: "Tea, sunlight, and three gratitudes.", mood: "😌" },
  { date: "Aug 2024", icon: "🦋", title: "A season of change", text: "Let go of what no longer served me.", mood: "🥲" },
  { date: "Dec 2024", icon: "⭐", title: "100 pages written", text: "A whole year of showing up for myself.", mood: "🥰" },
  { date: "Now", icon: "🌙", title: "Still blooming", text: "Every day a little softer, a little stronger.", mood: "💜" },
];

function Timeline() {
  return (
    <>
      <DreamBackdrop />
      <AppShell emoji="🌿" title="Life journey">
        <p className="-mt-4 mb-6 font-script text-xl text-primary">your beautiful growth, one milestone at a time</p>

        <div className="relative pl-10">
          <div className="absolute left-[18px] top-2 bottom-2 w-1 rounded-full bg-gradient-to-b from-lilac via-blush to-accent" />
          {events.map((e, i) => (
            <div key={i} className="relative mb-6 animate-rise" style={{ animationDelay: `${i * 0.08}s` }}>
              <span className="absolute -left-[26px] grid h-9 w-9 place-items-center rounded-full bg-card text-lg shadow-soft">
                {e.icon}
              </span>
              <div className="rounded-3xl glass p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-gradient-to-r from-lilac/60 to-blush/60 px-3 py-1 text-xs font-semibold text-primary">
                    {e.date}
                  </span>
                  <span className="text-xl">{e.mood}</span>
                </div>
                <h3 className="mt-2 text-2xl">{e.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{e.text}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-2 animate-rise rounded-3xl bg-gradient-to-br from-primary/90 to-accent-foreground/80 p-6 text-center text-primary-foreground shadow-dream">
          <WashiTape className="mx-auto mb-2 block" />
          <p className="font-script text-2xl">growth insight 🪄</p>
          <p className="mt-1 text-sm opacity-90">
            You've been most at peace on slow mornings. More of those, beautiful.
          </p>
        </section>
      </AppShell>
    </>
  );
}
