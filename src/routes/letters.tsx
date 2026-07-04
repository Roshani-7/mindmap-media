import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DreamBackdrop } from "@/components/Decorations";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/letters")({
  head: () => ({
    meta: [
      { title: "Letters to Future Self — The MindMap Media" },
      { name: "description", content: "Write a vintage letter and let time deliver it back to you." },
    ],
  }),
  component: Letters,
});

interface PendingLetter {
  id: string;
  to: string;
  days: number;
  preview: string;
}

const initialPending: PendingLetter[] = [
  { id: "seed-1", to: "Future me, in 1 year", days: 218, preview: "I hope you finally..." },
  { id: "seed-2", to: "Me on my birthday", days: 47, preview: "Remember how brave you were..." },
];

function Letters() {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [deliverOn, setDeliverOn] = useState("");
  const [pending, setPending] = useState<PendingLetter[]>(initialPending);

  const handleSeal = () => {
    if (!body.trim()) {
      toast.error("Write a few words before sealing your letter 💌");
      return;
    }
    const days = deliverOn
      ? Math.max(0, Math.ceil((new Date(deliverOn).getTime() - Date.now()) / 86400000))
      : 365;
    setPending((p) => [
      {
        id: `letter-${Date.now()}`,
        to: deliverOn ? `Future me, on ${new Date(deliverOn).toLocaleDateString()}` : "Future me, in 1 year",
        days,
        preview: body.trim().slice(0, 40) + (body.length > 40 ? "..." : ""),
      },
      ...p,
    ]);
    setBody("");
    setDeliverOn("");
    setOpen(false);
    toast.success("Sealed & sent to the future 🔮", { description: "Time will deliver it back to you." });
  };


  return (
    <>
      <DreamBackdrop />
      <AppShell emoji="💌" title="Letters to future you">
        {/* Envelope */}
        <section
          onClick={() => setOpen((o) => !o)}
          className="animate-rise cursor-pointer rounded-3xl bg-gradient-to-br from-blush/80 to-lilac/70 p-6 text-center shadow-dream transition-transform hover:scale-[1.02]"
        >
          <div className={`mx-auto text-6xl transition-transform duration-500 ${open ? "-translate-y-2 rotate-3" : ""}`}>
            {open ? "📖" : "✉️"}
          </div>
          <p className="mt-3 font-script text-2xl text-primary">
            {open ? "your blank letter awaits" : "tap to open a new letter"}
          </p>
        </section>

        {open && (
          <section className="mt-4 animate-rise rounded-3xl bg-gradient-to-br from-gold/30 to-card p-6 shadow-soft">
            <p className="font-script text-2xl text-foreground">Dear future me,</p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder="Tell yourself what you hope, what you fear, what you love right now..."
              className="mt-3 w-full resize-none rounded-2xl border border-border bg-card/50 p-4 font-display text-lg italic text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm font-semibold text-muted-foreground">Deliver on</label>
              <input
                type="date"
                value={deliverOn}
                onChange={(e) => setDeliverOn(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-card/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              onClick={handleSeal}
              className="mt-4 w-full rounded-full bg-gradient-to-r from-primary to-accent-foreground py-3.5 text-lg font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
            >
              Seal & send to the future 🔮
            </button>
          </section>
        )}

        {/* Pending deliveries */}
        <section className="mt-6">
          <h2 className="text-2xl">On their way ✨</h2>
          <div className="mt-3 space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="animate-rise rounded-3xl glass p-5">
                <div className="flex items-center justify-between">
                  <p className="font-script text-xl text-primary">{p.to}</p>
                  <span className="text-2xl">💌</span>
                </div>
                <p className="mt-1 italic text-muted-foreground">“{p.preview}”</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-gradient-to-r from-gold/70 to-blush/60 px-3 py-1 text-xs font-bold text-gold-foreground">
                    ⏳ {p.days} days left
                  </span>
                  <span className="text-xs text-muted-foreground">sealed with love</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </AppShell>
    </>
  );
}
