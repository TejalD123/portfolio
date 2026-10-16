import Reveal from "./Reveal.jsx";
import {
  Palette,
  Feather,
  Sparkles,
  Layers,
  Atom,
  FileCode2,
  Wind,
  Boxes,
  Server,
  Database,
  Zap,
  ShieldCheck,
  PenTool,
  TestTube2,
  Gauge,
} from "lucide-react";

// Shown only until categories are added from the admin Profile page.
const defaultGroups = [
  {
    title: "Design",
    items: [
      { label: "Figma", icon: Palette },
      { label: "Framer", icon: Feather },
      { label: "Motion", icon: Sparkles },
      { label: "Design Systems", icon: Layers },
    ],
  },
  {
    title: "Frontend",
    items: [
      { label: "React", icon: Atom },
      { label: "JavaScript", icon: FileCode2 },
      { label: "Tailwind", icon: Wind },
      { label: "Node.js", icon: Boxes },
    ],
  },
  {
    title: "Backend",
    items: [
      { label: "Node", icon: Server },
      { label: "MongoDB", icon: Database },
      { label: "Express", icon: Zap },
      { label: "JWT Auth", icon: ShieldCheck },
    ],
  },
  {
    title: "Craft",
    items: [
      { label: "Accessibility", icon: ShieldCheck },
      { label: "Prototyping", icon: PenTool },
      { label: "Testing", icon: TestTube2 },
      { label: "Performance", icon: Gauge },
    ],
  },
];

// Old flat skills were saved with stray [ and " characters; strip them for display.
const cleanLegacy = (s) => String(s).replace(/^[\s["]+|[\s\]",]+$/g, "").trim();

const toItems = (labels) =>
  labels.filter(Boolean).map((label) => ({ label, icon: Sparkles }));

function buildGroups(groups, skills) {
  const fromAdmin = (groups || []).filter((g) => g?.title && g.items?.length > 0);
  if (fromAdmin.length > 0) {
    return fromAdmin.map((g) => ({ title: g.title, items: toItems(g.items) }));
  }
  const legacy = (skills || []).map(cleanLegacy).filter(Boolean);
  if (legacy.length > 0) {
    return [{ title: "Skills", items: toItems(legacy) }];
  }
  return defaultGroups;
}

export default function TechStack({ groups: adminGroups, skills }) {
  const groups = buildGroups(adminGroups, skills);

  return (
    <section id="stack" className="relative section-y overflow-hidden">
      <div className="absolute inset-0 bg-plum-section-light dark:bg-plum-section-dark" />
      <div className="container-page relative">
        <div className="flex items-center gap-3 mb-10">
          <span className="h-px w-10 bg-ink/40 dark:bg-white/50" />
          <span className="text-lg md:text-2xl tracking-[0.18em] uppercase font-semibold text-rose dark:text-white/80">
            Tech Stack
          </span>
        </div>

        {/* Always a single row. Extra boxes scroll sideways on every screen size (scrollbar hidden) */}
        <div className="flex gap-5 overflow-x-auto overflow-y-hidden hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0 py-4 -my-4 snap-x snap-mandatory">
          {groups.map((group, gi) => (
            <Reveal
              key={`${group.title}-${gi}`}
              delay={gi * 0.08}
              className="shrink-0 w-[78%] max-w-[300px] md:w-auto md:max-w-none md:grow md:basis-[260px] snap-start"
            >
              <div className="rounded-2xl border border-ink/10 dark:border-white/15 bg-white/50 dark:bg-white/5 p-5 h-full backdrop-blur-sm">
                <h3 className="text-xs tracking-widest uppercase font-semibold text-rose dark:text-blossom/90 mb-4">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((it, ii) => {
                    const Icon = it.icon;
                    return (
                      <span
                        key={`${it.label}-${ii}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-white/70 dark:bg-white/10 border border-ink/10 dark:border-white/10 px-3 py-2 text-sm text-ink dark:text-white/90 hover:bg-white dark:hover:bg-white/20 transition-colors"
                      >
                        <Icon size={14} className="shrink-0" />
                        {it.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}