import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import { fileUrl } from "../api/axios.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { formatRange } from "../utils/detailHelpers.js";

function ExperienceCard({ item, index }) {
  const range = formatRange(item.startDate, item.endDate, item.isCurrent);
  const chips = (item.technologies || []).slice(0, 4);
  const extra = (item.technologies || []).length - chips.length;

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <Link
        to={`/experience/${item._id}`}
        className="group block h-full rounded-2xl card-surface shadow-card p-6 hover:-translate-y-1.5 transition-transform duration-300"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-rose-gradient text-white flex items-center justify-center font-display font-bold text-xl shrink-0">
            {item.logo ? (
              <img src={fileUrl(item.logo)} alt={item.company} className="w-full h-full object-cover" />
            ) : (
              item.company?.charAt(0)
            )}
          </div>
          <span className="pill-btn rounded-full px-3 py-1 text-xs text-secondary">{item.type}</span>
        </div>

        <h3 className="font-display font-bold text-xl mt-5 leading-snug">{item.role}</h3>
        <p className="text-rose text-sm font-medium mt-1">{item.company}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted">
          {range && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} /> {range}
            </span>
          )}
          {item.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={12} /> {item.location}
            </span>
          )}
        </div>

        {item.summary && (
          <p className="text-secondary text-sm mt-4 leading-relaxed line-clamp-3">{item.summary}</p>
        )}

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {chips.map((c) => (
              <span key={c} className="pill-btn rounded-full px-3 py-1 text-xs text-secondary">
                {c}
              </span>
            ))}
            {extra > 0 && (
              <span className="pill-btn rounded-full px-3 py-1 text-xs text-muted">+{extra}</span>
            )}
          </div>
        )}

        <span className="inline-flex items-center gap-1 text-rose text-sm font-medium mt-6">
          View details
          <ArrowUpRight
            size={14}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </span>
      </Link>
    </Reveal>
  );
}

export default function Experience({ experiences }) {
  // Nothing added yet -> don't show the section at all
  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="experience" className="container-page section-y">
      <SectionHeading label="Experience" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((item, i) => (
          <ExperienceCard key={item._id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}