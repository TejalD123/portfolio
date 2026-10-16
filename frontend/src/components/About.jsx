import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function About({ profile }) {
  const headline =
    profile?.aboutHeadline ||
    "I build products that feel considered — where the interface, the motion and the code all carry the same intent.";

  // About has its own text (aboutBio). Old profiles that only have the legacy `bio` still show it.
  const aboutText = profile?.aboutBio || profile?.bio || "";
  const bioParas = aboutText
    ? aboutText.split("\n").filter((p) => p.trim())
    : [
        "For eight years I've worked at the seam between design and engineering: leading design systems at fintech scale, prototyping new surfaces, and shipping production frontends for teams that care about detail.",
        "My favourite problems are the dense ones — dashboards, editors, onboarding flows — where clarity is a design constraint and not a decoration.",
      ];

  // Stats come from the admin About form. If none are added, the row is hidden.
  const stats = (profile?.aboutStats || []).filter((s) => s?.value && s?.label);

  return (
    <section id="about" className="container-page section-y">
      <SectionHeading label="About me" />
      <Reveal delay={0.1}>
        <div className="card-surface rounded-3xl p-8 sm:p-12 pr-4 sm:pr-6 shadow-card grid md:grid-cols-2 gap-10 max-h-[70vh] overflow-y-auto hide-scrollbar md:max-h-none md:overflow-visible md:pr-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight">
            {headline}
          </h2>

          <div>
            <div className="space-y-4 text-secondary leading-relaxed">
              {bioParas.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {stats.length > 0 && (
              <div className="mt-8 grid grid-cols-3 gap-3">
                {stats.map((s, i) => (
                  <div key={`${s.label}-${i}`} className="rounded-2xl bg-ink/5 dark:bg-white/5 p-4">
                    <div className="font-display font-bold text-2xl text-rose">{s.value}</div>
                    <div className="text-xs text-muted mt-1 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}