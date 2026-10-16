import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Briefcase,
  MapPin,
  Clock,
  Award,
  Info,
  ListChecks,
  FolderKanban,
  TrendingUp,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Loader from "../components/Loader.jsx";
import Reveal from "../components/Reveal.jsx";
import { DetailSection, BulletList, ExpandableText, TechGroupBoxes } from "../components/DetailBlocks.jsx";
import { getExperienceById, getProfile } from "../api/endpoints.js";
import { fileUrl } from "../api/axios.js";
import { formatRange, formatLength } from "../utils/detailHelpers.js";

export default function ExperienceDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      try {
        const [res, profileRes] = await Promise.allSettled([getExperienceById(id), getProfile()]);
        if (res.status === "fulfilled") setItem(res.value.data?.data);
        else setError(true);
        if (profileRes.status === "fulfilled") setProfile(profileRes.value.data?.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar minimal />
        <Loader full />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen">
        <Navbar minimal />
        <div className="pt-40 text-center px-6">
          <p className="text-secondary mb-4">Experience not found.</p>
          <Link to="/" className="text-rose font-medium">
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  const range = formatRange(item.startDate, item.endDate, item.isCurrent);
  const length = formatLength(item.startDate, item.endDate, item.isCurrent);
  const meta = [
    { icon: Clock, label: "Duration", value: [range, length && `(${length})`].filter(Boolean).join(" ") },
    { icon: MapPin, label: "Location", value: item.location },
    { icon: Award, label: "Experience", value: item.type === "Job" ? item.yearsOfExperience : "" },
  ].filter((m) => m.value);

  return (
    <div className="min-h-screen">
      <Navbar minimal resumeUrl={profile?.resumeUrl} />
      <article className="relative pt-28 md:pt-32 pb-24 container-page">
        {/* Back arrow: desktop only, on the line where the content starts, at the right edge */}
        <div className="hidden md:flex md:absolute md:top-32 md:right-12 xl:right-16 z-10">
          <Link
            to="/#experience"
            aria-label="Back to experience"
            title="Back to experience"
            className="w-11 h-11 rounded-full bg-rose-gradient text-white flex items-center justify-center shadow-glow hover:brightness-110 hover:translate-x-0.5 transition"
          >
            <ArrowRight size={18} />
          </Link>
        </div>

        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-rose-gradient text-white flex items-center justify-center font-display font-bold text-4xl shadow-card shrink-0">
              {item.logo ? (
                <img src={fileUrl(item.logo)} alt={item.company} className="w-full h-full object-cover" />
              ) : (
                item.company?.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-rose-gradient text-white flex items-center justify-center shrink-0">
                  <Briefcase size={18} />
                </span>
                <span className="eyebrow" style={{ fontSize: "1.125rem" }}>
                  {item.type}
                </span>
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl mt-3 leading-tight">{item.role}</h1>
              <p className="text-xl text-secondary mt-2">{item.company}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {meta.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-4 mt-10">
              {meta.map(({ icon: Icon, label, value }) => (
                <div key={label} className="card-surface rounded-2xl p-5 shadow-card flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-rose-gradient text-white flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-widest text-muted leading-none">{label}</p>
                    <p className="text-sm font-medium mt-1.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {item.companyLink && (
            <a
              href={item.companyLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 pill-btn rounded-full px-4 py-2 text-sm hover:border-rose transition-colors mt-6"
            >
              <ExternalLink size={14} /> Company website
            </a>
          )}
        </Reveal>

        <div className="mt-14 space-y-8">
          {(item.description || item.summary) && (
            <DetailSection icon={Info} title="Overview">
              <ExpandableText text={item.description || item.summary} />
            </DetailSection>
          )}
          {item.responsibilities?.length > 0 && (
            <DetailSection icon={ListChecks} title="Responsibilities">
              <BulletList items={item.responsibilities} limit={3} />
            </DetailSection>
          )}
          {item.projects?.length > 0 && (
            <DetailSection icon={FolderKanban} title="Projects worked on">
              <BulletList items={item.projects} limit={3} />
            </DetailSection>
          )}
          <TechGroupBoxes
            groups={[
              { title: "Tech stack", items: item.technologies },
              { title: "Integrations", items: item.integrations },
              { title: "Deployment", items: item.deployment },
            ]}
          />
          {item.outcome && (
            <DetailSection icon={TrendingUp} title="Outcome">
              <BulletList text={item.outcome} limit={3} />
            </DetailSection>
          )}
        </div>

      </article>
      <Footer profile={profile} />
    </div>
  );
}