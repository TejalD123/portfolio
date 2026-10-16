import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Code2,
  Layers,
  Info,
  Target,
  Compass,
  Database,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Loader from "../components/Loader.jsx";
import Reveal from "../components/Reveal.jsx";
import { DetailSection, BulletList } from "../components/DetailBlocks.jsx";
import { getCaseStudyById, getProfile } from "../api/endpoints.js";
import { fileUrl } from "../api/axios.js";

export default function CaseStudyDetail() {
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
        const [res, profileRes] = await Promise.allSettled([getCaseStudyById(id), getProfile()]);
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
          <p className="text-secondary mb-4">Case study not found.</p>
          <Link to="/" className="text-rose font-medium">
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    { icon: Target, title: "Problem statement", text: item.problemStatement },
    { icon: Compass, title: "Approach", text: item.approach },
    { icon: Database, title: "Dataset", text: item.dataset },
    { icon: TrendingUp, title: "Results", text: item.results },
    { icon: Lightbulb, title: "Learnings", text: item.learnings },
  ].filter((s) => s.text);

  return (
    <div className="min-h-screen">
      <Navbar minimal resumeUrl={profile?.resumeUrl} />
      <article className="relative pt-28 md:pt-32 pb-24 container-page">
        {/* Back arrow: desktop only, on the line where the content starts, at the right edge */}
        <div className="hidden md:flex md:absolute md:top-32 md:right-12 xl:right-16 z-10">
          <Link
            to="/#cases"
            aria-label="Back to case studies"
            title="Back to case studies"
            className="w-11 h-11 rounded-full bg-rose-gradient text-white flex items-center justify-center shadow-glow hover:brightness-110 hover:translate-x-0.5 transition"
          >
            <ArrowRight size={18} />
          </Link>
        </div>

        <div
          className={`grid gap-8 lg:gap-20 items-center ${
            item.coverImage ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]" : ""
          }`}
        >
          {item.coverImage && (
            <Reveal delay={0.05}>
              <div className="rounded-3xl overflow-hidden shadow-card bg-rose-gradient">
                <img
                  src={fileUrl(item.coverImage)}
                  alt={item.title}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </Reveal>
          )}

          <Reveal delay={0.1} className={item.coverImage ? "lg:pl-6" : ""}>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-rose-gradient text-white flex items-center justify-center shrink-0">
                <Layers size={18} />
              </span>
              <span className="eyebrow" style={{ fontSize: "1.125rem" }}>
                {item.category || "Case study"}
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl mt-3 leading-tight">
              {item.title}
            </h1>

            {item.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {item.techStack.map((t) => (
                  <span key={t} className="pill-btn rounded-full px-3 py-1.5 text-xs text-secondary">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {(item.githubLink || item.liveDemoLink) && (
              <div className="flex flex-wrap gap-3 mt-6">
                {item.githubLink && (
                  <a
                    href={item.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 pill-btn rounded-full px-4 py-2 text-sm hover:border-rose transition-colors"
                  >
                    <Code2 size={14} /> Code
                  </a>
                )}
                {item.liveDemoLink && (
                  <a
                    href={item.liveDemoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 pill-btn rounded-full px-4 py-2 text-sm hover:border-rose transition-colors"
                  >
                    <ExternalLink size={14} /> Live demo
                  </a>
                )}
              </div>
            )}
          </Reveal>
        </div>

        <div className="mt-14 space-y-8">
          {item.summary && (
            <DetailSection icon={Info} title="Overview">
              <p className="text-secondary leading-relaxed max-w-3xl">{item.summary}</p>
            </DetailSection>
          )}
          {sections.map((s) => (
            <DetailSection key={s.title} icon={s.icon} title={s.title}>
              <BulletList text={s.text} />
            </DetailSection>
          ))}
        </div>

      </article>
      <Footer profile={profile} />
    </div>
  );
}