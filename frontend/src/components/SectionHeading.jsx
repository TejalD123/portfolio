import Reveal from "./Reveal.jsx";

export default function SectionHeading({ label, light = false, hint }) {
  return (
    <Reveal className="flex items-center justify-between gap-3 mb-10">
      <div className="flex items-center gap-3">
        <span
          className={`h-px w-10 ${light ? "bg-blossom/70 dark:bg-rose-light/60" : "bg-rose/70"}`}
        />
        <span className={`eyebrow !text-lg md:!text-2xl !tracking-[0.18em] ${light ? "!text-rose-light dark:!text-blossom" : ""}`}>
          {label}
        </span>
      </div>
      {hint && <span className="text-xs text-muted hidden sm:inline">{hint}</span>}
    </Reveal>
  );
}