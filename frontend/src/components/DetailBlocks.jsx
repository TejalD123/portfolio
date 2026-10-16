import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { Sparkles } from "lucide-react";
import { techIcon, toPoints } from "../utils/detailHelpers.js";
import { logoFor } from "../utils/techLogos.js";

// Card with an icon heading — used for each section on detail pages
export function DetailSection({ icon: Icon, title, children }) {
  return (
    <Reveal>
      <div className="card-surface rounded-2xl p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-xl bg-rose-gradient text-white flex items-center justify-center shrink-0">
            <Icon size={18} />
          </span>
          <h2 className="font-display font-bold text-2xl">{title}</h2>
        </div>
        {children}
      </div>
    </Reveal>
  );
}

// "View more" / "View less" toggle used by the expandable blocks below
function ViewMoreButton({ open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-1.5 text-rose text-sm font-medium hover:brightness-110 transition"
    >
      {open ? "View less" : "View more"}
      <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

// limit = show only this many bullets, the rest open with "View more"
export function BulletList({ text, items, limit = 0 }) {
  const points = items || toPoints(text || "");
  const [open, setOpen] = useState(false);
  const canExpand = limit > 0 && points.length > limit;
  const shown = canExpand && !open ? points.slice(0, limit) : points;

  return (
    <>
      <ul className="space-y-2.5">
        {shown.map((point, i) => (
          <li key={i} className="flex gap-3 text-secondary leading-relaxed">
            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-rose shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      {canExpand && <ViewMoreButton open={open} onClick={() => setOpen((v) => !v)} />}
    </>
  );
}

// Paragraph limited to 3 lines, the rest opens with "View more"
export function ExpandableText({ text }) {
  const [open, setOpen] = useState(false);
  // Short texts fit in 3 lines already, so no button is needed
  const canExpand = (text || "").length > 220;

  return (
    <>
      <p
        className={`text-secondary leading-relaxed max-w-3xl whitespace-pre-line ${
          canExpand && !open ? "line-clamp-3" : ""
        }`}
      >
        {text}
      </p>
      {canExpand && <ViewMoreButton open={open} onClick={() => setOpen((v) => !v)} />}
    </>
  );
}

// Small icon boxes (integrations, deployment, services)
export function TechBoxes({ items }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((t) => {
        const Icon = techIcon(t);
        return (
          <div
            key={t}
            className="rounded-2xl border border-card-border p-5 flex flex-col items-center text-center gap-3"
          >
            <span className="w-11 h-11 rounded-xl bg-rose-gradient text-white flex items-center justify-center">
              <Icon size={20} />
            </span>
            <span className="text-sm font-medium">{t}</span>
          </div>
        );
      })}
    </div>
  );
}

// Original brand logo on a small light tile; generic icon when there is no logo
function TechLogo({ label }) {
  const logo = logoFor(label);
  if (!logo) return <Sparkles size={14} className="shrink-0 text-rose" />;
  return (
    <span className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" width="16" height="16" role="img" aria-label={logo.title}>
        <path d={logo.path} fill={`#${logo.hex}`} />
      </svg>
    </span>
  );
}

// Grouped boxes (Tech stack / Integrations / Deployment), each with icon chips
export function TechGroupBoxes({ groups }) {
  const visible = groups.filter((g) => g.items?.length > 0);
  if (visible.length === 0) return null;
  return (
    <Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((group) => (
          <div key={group.title} className="card-surface rounded-2xl shadow-card p-5">
            <h3 className="text-xs tracking-widest uppercase font-semibold text-rose mb-4">
              {group.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((label, i) => (
                <span
                  key={`${label}-${i}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-card-border px-3 py-2 text-sm"
                >
                  <TechLogo label={label} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}