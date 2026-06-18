import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
  const [photos, setPhotos] = useState<string[]>([]);
  const [bg, setBg] = useState(backgrounds[0]);
  const [mood, setMood] = useState("😌");
  const fileRef = useRef<HTMLInputElement>(null);

  // Restore any previously saved draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mmm.journal");
      if (raw) {
        const d = JSON.parse(raw);
        setText(d.text ?? "");
        setPlaced(d.placed ?? ["🌸", "🦋"]);
        setPhotos(d.photos ?? []);
        setMood(d.mood ?? "😌");
        const found = backgrounds.find((b) => b.l === d.bg);
        if (found) setBg(found);
      }
    } catch {
      /* ignore corrupt draft */
    }
  }, []);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((p) => [...p, reader.result as string]);
      toast.success("Photo added to your page 📷");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        "mmm.journal",
        JSON.stringify({ text, placed, photos, mood, bg: bg.l, savedAt: Date.now() }),
      );
      toast.success("Page saved 💾", { description: "Your entry is safely tucked away." });
    } catch {
      toast.error("Couldn't save this page. Please try again.");
    }
  };


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
          {photos.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {photos.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt="Journal memory" className="h-24 w-full rounded-2xl object-cover shadow-soft" />
                  <button
                    onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-card text-xs shadow-soft"
                    aria-label="Remove photo"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Toolbar */}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        <section className="mt-4 grid grid-cols-3 gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-2xl glass py-3 text-sm font-semibold text-primary transition-transform hover:scale-105"
          >
            📷 Photo
          </button>
          <button
            onClick={() => toast("🎙️ Voice notes are coming soon!")}
            className="rounded-2xl glass py-3 text-sm font-semibold text-primary transition-transform hover:scale-105"
          >
            🎙️ Voice
          </button>
          <button
            onClick={() => toast("🎨 Doodle mode is coming soon!")}
            className="rounded-2xl glass py-3 text-sm font-semibold text-primary transition-transform hover:scale-105"
          >
            🎨 Doodle
          </button>
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
