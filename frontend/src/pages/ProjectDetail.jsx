import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Code2,
  Database,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Flame,
  Triangle,
  ShieldCheck,
  Cloud,
  KeyRound,
  Mail,
  Smartphone,
  CreditCard,
  Server,
  Globe,
  Lock,
  Layers,
  Sparkles,
  User,
  Lightbulb,
  Info,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Loader from "../components/Loader.jsx";
import Reveal from "../components/Reveal.jsx";
import { BulletList } from "../components/DetailBlocks.jsx";
import { toPoints } from "../utils/detailHelpers.js";
import { getProjectById, getProfile } from "../api/endpoints.js";
import { fileUrl } from "../api/axios.js";

// Icon for "additional tech" boxes (services / tools, not languages)
const techIcon = (label = "") => {
  const l = label.toLowerCase();
  if (l.includes("firebase")) return Flame;
  if (l.includes("vercel")) return Triangle;
  if (l.includes("otp") || l.includes("sms")) return Smartphone;
  if (l.includes("auth") || l.includes("jwt") || l.includes("oauth")) return ShieldCheck;
  if (l.includes("password") || l.includes("bcrypt") || l.includes("encrypt")) return Lock;
  if (l.includes("token") || l.includes("key")) return KeyRound;
  if (l.includes("mail") || l.includes("smtp")) return Mail;
  if (l.includes("pay") || l.includes("razorpay") || l.includes("stripe")) return CreditCard;
  if (l.includes("render") || l.includes("heroku") || l.includes("railway") || l.includes("server")) return Server;
  if (l.includes("netlify") || l.includes("aws") || l.includes("cloud") || l.includes("hosting")) return Cloud;
  if (l.includes("api") || l.includes("web")) return Globe;
  if (l.includes("design") || l.includes("ui")) return Layers;
  return Sparkles;
};

function SectionHeading({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-10 h-10 rounded-xl bg-rose-gradient text-white flex items-center justify-center shrink-0">
        <Icon size={18} />
      </span>
      <h2 className="font-display font-bold text-2xl">{children}</h2>
    </div>
  );
}

function Lightbox({ slides, index, setIndex, onClose, title }) {
  const many = slides.length > 1;
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + slides.length) % slides.length),
    [slides.length, setIndex]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % slides.length),
    [slides.length, setIndex]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (many && e.key === "ArrowLeft") prev();
      if (many && e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [many, prev, next, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <X size={20} />
      </button>
      {many && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-4 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-4 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
      <img
        src={slides[index]}
        alt={`${title} ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[94vw] max-h-[94vh] object-contain select-none"
      />
    </motion.div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [slide, setSlide] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showAllInfo, setShowAllInfo] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      try {
        const [res, profileRes] = await Promise.allSettled([
          getProjectById(id),
          getProfile(),
        ]);
        if (res.status === "fulfilled") {
          setProject(res.value.data?.data);
        } else {
          setError(true);
        }
        if (profileRes.status === "fulfilled") setProfile(profileRes.value.data?.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const slideCount = project
    ? [project.thumbnail, ...(project.images || [])].filter(Boolean).length
    : 0;

  // Auto-advance the image carousel (pauses on hover and while fullscreen is open)
  useEffect(() => {
    if (slideCount < 2 || lightbox || paused) return;
    const t = setTimeout(() => setSlide((i) => (i + 1) % slideCount), 4000);
    return () => clearTimeout(t);
  }, [slide, slideCount, lightbox, paused]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar minimal />
        <Loader full />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen">
        <Navbar minimal />
        <div className="pt-40 text-center px-6">
          <p className="text-secondary mb-4">Project not found.</p>
          <Link to="/" className="text-rose font-medium">
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  const year = project.createdAt ? new Date(project.createdAt).getFullYear() : "";
  const slides = [project.thumbnail, ...(project.images || [])].filter(Boolean).map(fileUrl);

  // Detailed info: one bullet per line. First 4 show, the rest open with "Show more".
  const INFO_PREVIEW = 4;
  const infoPoints = toPoints(project.details || "");
  const visiblePoints = showAllInfo ? infoPoints : infoPoints.slice(0, INFO_PREVIEW);

  return (
    <div className="min-h-screen">
      <Navbar minimal resumeUrl={profile?.resumeUrl} />
      <article className="relative pt-28 md:pt-32 pb-24 container-page">
        {/* Back arrow: desktop only, on the line where the content starts, at the right edge */}
        <div className="hidden md:flex md:absolute md:top-32 md:right-12 xl:right-16 z-10">
          <Link
            to="/#work"
            aria-label="Back to projects"
            title="Back to projects"
            className="w-11 h-11 rounded-full bg-rose-gradient text-white flex items-center justify-center shadow-glow hover:brightness-110 hover:translate-x-0.5 transition"
          >
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-8 lg:gap-20 items-center">
          {slides.length > 0 && (
            <Reveal delay={0.05}>
              <div
                className="relative rounded-3xl overflow-hidden shadow-card bg-rose-gradient"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <button
                  type="button"
                  onClick={() => setLightbox(true)}
                  aria-label="View image full screen"
                  className="block w-full aspect-[4/3] cursor-zoom-in"
                >
                  <motion.img
                    key={slide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={slides[slide]}
                    alt={`${project.title} ${slide + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
                {slides.length > 1 && (
                  <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSlide(i)}
                        aria-label={`Show image ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          i === slide ? "w-5 bg-white" : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.1} className="lg:pl-6">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-rose-gradient text-white flex items-center justify-center shrink-0">
                <Layers size={18} />
              </span>
              <span className="eyebrow" style={{ fontSize: "1.125rem" }}>
                {project.field}
              </span>
              {(project.projectDate || year) && (
                <span className="text-xs text-muted font-mono">{project.projectDate || year}</span>
              )}
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl mt-3 leading-tight">
              {project.title}
            </h1>

            {project.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {project.techStack.map((t) => (
                  <span key={t} className="pill-btn rounded-full px-3 py-1.5 text-xs text-secondary">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {project.role && (
              <div className="flex items-center gap-3 mt-6">
                <span className="w-9 h-9 rounded-xl bg-rose-gradient text-white flex items-center justify-center shrink-0">
                  <User size={16} />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted leading-none">My role</p>
                  <p className="text-sm font-medium mt-1">{project.role}</p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 pill-btn rounded-full px-4 py-2 text-sm hover:border-rose transition-colors"
                >
                  <Code2 size={14} /> Code
                </a>
              )}
              {project.liveDemoLink && (
                <a
                  href={project.liveDemoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 pill-btn rounded-full px-4 py-2 text-sm hover:border-rose transition-colors"
                >
                  <ExternalLink size={14} /> Live demo
                </a>
              )}
              {project.datasetLink && (
                <a
                  href={project.datasetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 pill-btn rounded-full px-4 py-2 text-sm hover:border-rose transition-colors"
                >
                  <Database size={14} /> Dataset
                </a>
              )}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 space-y-12">
          <Reveal>
            <div className="card-surface rounded-2xl p-6 sm:p-8 shadow-card">
              <SectionHeading icon={Info}>Project info</SectionHeading>
              {infoPoints.length > 0 ? (
                <>
                  <BulletList items={visiblePoints} />
                  {infoPoints.length > INFO_PREVIEW && (
                    <button
                      type="button"
                      onClick={() => setShowAllInfo((v) => !v)}
                      className="mt-5 inline-flex items-center gap-1.5 text-rose text-sm font-medium hover:brightness-110 transition"
                    >
                      {showAllInfo ? "Show less" : "Show more"}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${showAllInfo ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </>
              ) : (
                <p className="text-secondary leading-relaxed max-w-3xl">{project.info}</p>
              )}
            </div>
          </Reveal>

          {project.keyLearning && (
            <Reveal>
              <div className="card-surface rounded-2xl p-6 sm:p-8 shadow-card">
                <SectionHeading icon={Lightbulb}>What I learned</SectionHeading>
                <BulletList text={project.keyLearning} />
              </div>
            </Reveal>
          )}

          {project.additionalTech?.length > 0 && (
            <Reveal>
              <h2 className="font-display font-bold text-2xl mb-4">Technologies &amp; services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.additionalTech.map((t) => {
                  const Icon = techIcon(t);
                  return (
                    <div
                      key={t}
                      className="card-surface rounded-2xl p-5 shadow-card flex flex-col items-center text-center gap-3"
                    >
                      <span className="w-11 h-11 rounded-xl bg-rose-gradient text-white flex items-center justify-center">
                        <Icon size={20} />
                      </span>
                      <span className="text-sm font-medium">{t}</span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          )}

        </div>

      </article>
      <AnimatePresence>
        {lightbox && slides.length > 0 && (
          <Lightbox
            slides={slides}
            index={slide}
            setIndex={setSlide}
            onClose={() => setLightbox(false)}
            title={project.title}
          />
        )}
      </AnimatePresence>
      <Footer profile={profile} />
    </div>
  );
}