import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { DreamBackdrop } from "@/components/Decorations";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/mind-map")({
  head: () => ({
    meta: [
      { title: "Mind Map — Mind Map Media" },
      {
        name: "description",
        content:
          "Visually connect your memories, moods, and themes in a dreamy interactive mind map.",
      },
    ],
  }),
  component: MindMap,
});

type NodeKind = "core" | "mood" | "memory" | "theme";

interface MapNode {
  id: string;
  label: string;
  emoji: string;
  kind: NodeKind;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

const KIND_STYLES: Record<NodeKind, { ring: string; bg: string; tag: string }> = {
  core: { ring: "ring-gold/70", bg: "from-primary to-accent-foreground/80", tag: "You" },
  mood: { ring: "ring-blush/70", bg: "from-blush/80 to-lilac/70", tag: "Mood" },
  memory: { ring: "ring-lilac/70", bg: "from-lilac/80 to-accent/60", tag: "Memory" },
  theme: { ring: "ring-accent/70", bg: "from-accent/70 to-blush/60", tag: "Theme" },
};

const INITIAL_NODES: MapNode[] = [
  { id: "core", label: "My Mind", emoji: "🧠", kind: "core", x: 50, y: 48 },
  { id: "m1", label: "Calm", emoji: "😌", kind: "mood", x: 24, y: 22 },
  { id: "m2", label: "Joyful", emoji: "🥰", kind: "mood", x: 76, y: 24 },
  { id: "mem1", label: "Seaside trip", emoji: "🏖️", kind: "memory", x: 18, y: 64 },
  { id: "mem2", label: "Birthday", emoji: "🎂", kind: "memory", x: 80, y: 66 },
  { id: "t1", label: "Self-love", emoji: "💜", kind: "theme", x: 50, y: 14 },
  { id: "t2", label: "Growth", emoji: "🌱", kind: "theme", x: 50, y: 84 },
];

const INITIAL_LINKS: [string, string][] = [
  ["core", "m1"],
  ["core", "m2"],
  ["core", "mem1"],
  ["core", "mem2"],
  ["core", "t1"],
  ["core", "t2"],
  ["m1", "mem1"],
  ["m2", "mem2"],
  ["t1", "m2"],
  ["t2", "mem1"],
];

const NEW_PRESETS: Omit<MapNode, "id" | "x" | "y">[] = [
  { label: "Grateful", emoji: "🙏", kind: "mood" },
  { label: "Cozy day", emoji: "🕯️", kind: "memory" },
  { label: "Dreams", emoji: "🌙", kind: "theme" },
  { label: "Hopeful", emoji: "✨", kind: "mood" },
  { label: "First snow", emoji: "❄️", kind: "memory" },
  { label: "Creativity", emoji: "🎨", kind: "theme" },
];

function MindMap() {
  const [nodes, setNodes] = useState<MapNode[]>(INITIAL_NODES);
  const [links] = useState<[string, string][]>(INITIAL_LINKS);
  const [selected, setSelected] = useState<string>("core");
  const [presetIdx, setPresetIdx] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<string | null>(null);

  const pointFromEvent = useCallback((clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(6, Math.min(94, x)), y: Math.max(6, Math.min(94, y)) };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragId.current) return;
      const p = pointFromEvent(e.clientX, e.clientY);
      if (!p) return;
      setNodes((ns) => ns.map((n) => (n.id === dragId.current ? { ...n, ...p } : n)));
    },
    [pointFromEvent],
  );

  const endDrag = useCallback(() => {
    dragId.current = null;
  }, []);

  const addNode = () => {
    const preset = NEW_PRESETS[presetIdx % NEW_PRESETS.length];
    const id = `n${Date.now()}`;
    const angle = Math.random() * Math.PI * 2;
    setNodes((ns) => [
      ...ns,
      {
        ...preset,
        id,
        x: 50 + Math.cos(angle) * 28,
        y: 48 + Math.sin(angle) * 28,
      },
    ]);
    setPresetIdx((i) => i + 1);
    setSelected(id);
  };

  const removeSelected = () => {
    if (selected === "core") return;
    setNodes((ns) => ns.filter((n) => n.id !== selected));
    setSelected("core");
  };

  const nodeById = (id: string) => nodes.find((n) => n.id === id);
  const selectedNode = nodeById(selected);

  return (
    <>
      <DreamBackdrop />
      <AppShell emoji="🧠" title="Mind map">
        <p className="-mt-4 mb-4 font-script text-xl text-primary">
          connect your memories, moods & themes ✨
        </p>

        {/* Legend */}
        <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
          {(["mood", "memory", "theme"] as NodeKind[]).map((k) => (
            <span
              key={k}
              className={`rounded-full bg-gradient-to-r ${KIND_STYLES[k].bg} px-3 py-1 text-foreground/80`}
            >
              {KIND_STYLES[k].tag}
            </span>
          ))}
        </div>

        {/* Canvas */}
        <div
          ref={boardRef}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="relative aspect-square w-full touch-none overflow-hidden rounded-3xl glass shadow-dream"
        >
          {/* Links */}
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            {links.map(([a, b], i) => {
              const na = nodeById(a);
              const nb = nodeById(b);
              if (!na || !nb) return null;
              const active = selected === a || selected === b;
              return (
                <line
                  key={i}
                  x1={`${na.x}%`}
                  y1={`${na.y}%`}
                  x2={`${nb.x}%`}
                  y2={`${nb.y}%`}
                  stroke="currentColor"
                  className={active ? "text-primary" : "text-primary/30"}
                  strokeWidth={active ? 2.5 : 1.5}
                  strokeLinecap="round"
                  strokeDasharray={active ? "0" : "5 6"}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((n) => {
            const s = KIND_STYLES[n.kind];
            const isSel = selected === n.id;
            const isCore = n.kind === "core";
            return (
              <button
                key={n.id}
                onPointerDown={(e) => {
                  e.preventDefault();
                  dragId.current = n.id;
                  setSelected(n.id);
                }}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab select-none rounded-2xl bg-gradient-to-br ${s.bg} px-3 py-2 text-center shadow-soft ring-2 transition-transform active:cursor-grabbing ${
                  isSel ? `${s.ring} scale-110` : "ring-transparent"
                } ${isCore ? "animate-float" : ""}`}
              >
                <span className={`block leading-none ${isCore ? "text-3xl" : "text-2xl"}`}>
                  {n.emoji}
                </span>
                <span className="mt-0.5 block text-[0.7rem] font-bold text-foreground/80">
                  {n.label}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          drag any bubble to rearrange · tap to highlight its connections
        </p>

        {/* Controls */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={addNode}
            className="flex-1 rounded-full bg-gradient-to-r from-primary to-accent-foreground py-3.5 text-base font-semibold text-primary-foreground shadow-dream transition-transform hover:scale-[1.02]"
          >
            ➕ Add a node
          </button>
          <button
            onClick={removeSelected}
            disabled={selected === "core"}
            className="rounded-full glass px-5 py-3.5 text-base font-semibold text-primary transition-transform hover:scale-[1.02] disabled:opacity-40"
          >
            🗑️
          </button>
        </div>

        {/* Selected detail */}
        {selectedNode && (
          <section className="mt-4 animate-rise rounded-3xl glass p-5">
            <div className="flex items-center gap-3">
              <div
                className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${KIND_STYLES[selectedNode.kind].bg} text-3xl`}
              >
                {selectedNode.emoji}
              </div>
              <div>
                <h3 className="text-xl">{selectedNode.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {KIND_STYLES[selectedNode.kind].tag} ·{" "}
                  {links.filter((l) => l.includes(selectedNode.id)).length} connections
                </p>
              </div>
            </div>
          </section>
        )}
      </AppShell>
    </>
  );
}
