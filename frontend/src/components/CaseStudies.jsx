import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { fileUrl } from "../api/axios.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function CaseStudies({ caseStudies }) {
  // Nothing added yet -> don't show the section at all
  if (!caseStudies || caseStudies.length === 0) return null;

  return (
    <section id="cases" className="container-page section-y">
      <SectionHeading label="Case Studies" />

      <div className="grid md:grid-cols-2 gap-6">
        {caseStudies.map((c, i) => {
          const chips = (c.techStack || []).slice(0, 4);
          return (
            <Reveal key={c._id} delay={i * 0.1} className="h-full">
              <Link
                to={`/case-studies/${c._id}`}
                className="group card-surface rounded-2xl shadow-card h-full flex flex-col overflow-hidden hover:-translate-y-1.5 transition-transform duration-300"
              >
                {c.coverImage && (
                  <div className="aspect-[16/9] bg-rose-gradient overflow-hidden">
                    <img
                      src={fileUrl(c.coverImage)}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1">
                  <span className="eyebrow mb-4">{c.category || "Case Study"}</span>
                  <h3 className="font-display font-bold text-2xl leading-snug">{c.title}</h3>
                  {c.summary && (
                    <p className="text-secondary text-sm mt-3 leading-relaxed flex-1 line-clamp-3">
                      {c.summary}
                    </p>
                  )}
                  {chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {chips.map((t) => (
                        <span key={t} className="pill-btn rounded-full px-3 py-1.5 text-xs text-secondary">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="inline-flex items-center gap-1 text-rose text-sm font-medium mt-6 group-hover:gap-2 transition-all">
                    Read the study <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}