import { motion } from "framer-motion";
import { Mail, ArrowUpRight, Link2 } from "lucide-react";
import { fileUrl } from "../api/axios.js";
import { logoFor } from "../utils/techLogos.js";
import { SOCIAL_ICONS } from "../utils/socialIcons.js";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// Used only when the profile has too few tech items with a known logo
const DEFAULT_ORBIT = ["React", "Node.js", "Express.js", "MongoDB", "JavaScript", "Tailwind CSS", "Git", "Firebase"];

// Up to 8 logos for the rotating ring, taken from the Tech Stack saved in the admin Profile
function pickOrbit(groups, skills) {
  const labels = [...(groups || []).flatMap((g) => g?.items || []), ...(skills || [])];
  const seen = new Set();
  const out = [];
  const add = (label) => {
    const logo = logoFor(label);
    if (!logo || seen.has(logo.title)) return;
    seen.add(logo.title);
    out.push({ label, logo });
  };
  labels.forEach(add);
  if (out.length < 6) DEFAULT_ORBIT.forEach(add);
  return out.slice(0, 8);
}

// Soft, blurred code in the background of the hero
function CodeBackdrop({ name, role, stack }) {
  const k = "text-pink-300";
  const s = "text-rose-light";
  const c = "text-white/40";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 75%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 75%, transparent 100%)",
      }}
    >
      <pre className="absolute left-4 md:left-[38%] top-28 md:top-32 font-mono text-[10px] sm:text-xs md:text-sm leading-6 md:leading-7 opacity-[0.16] md:opacity-[0.26] blur-[1.6px]">
        <span className={c}>{"// portfolio.js"}</span>
        {"\n"}
        <span className={k}>const</span> developer = {"{"}
        {"\n  "}name: <span className={s}>"{name}"</span>,{"\n  "}role: <span className={s}>"{role}"</span>,
        {"\n  "}stack: [{stack.map((t, i) => (
          <span key={t}>
            <span className={s}>"{t}"</span>
            {i < stack.length - 1 ? ", " : ""}
          </span>
        ))}],
        {"\n  "}build() {"{"}
        {"\n    "}
        <span className={k}>return</span> apps.<span className={k}>scalable</span>({"{"} clean: <span className={k}>true</span> {"}"});
        {"\n  }"},
        {"\n}"};
        {"\n\n"}
        app.<span className={k}>get</span>(<span className={s}>"/api/work"</span>, <span className={k}>async</span> (req, res) =&gt; {"{"}
        {"\n  "}
        <span className={k}>const</span> work = <span className={k}>await</span> Project.find();
        {"\n  "}res.json({"{"} success: <span className={k}>true</span>, work {"}"});
        {"\n}"});
      </pre>
    </div>
  );
}

// Ring height / ring width. Smaller = flatter oval.
const RING_FLATTEN = 0.6;

// Profile photo with tech logos travelling on an oval ring that passes behind the photo
function OrbitPhoto({ image, name, orbit }) {
  return (
    <div className="relative shrink-0 w-[min(calc(100%_+_1.5rem),380px)] md:w-full md:max-w-[560px] aspect-square">
      {/* bright pink glows */}
      <div className="absolute inset-[10%] rounded-full bg-pink-400/30 blur-3xl" />
      <div className="absolute inset-[26%] rounded-full bg-rose-light/50 blur-2xl" />
      <div className="absolute -top-2 right-[8%] w-24 h-24 rounded-full bg-pink-300/25 blur-2xl" />
      <div className="absolute bottom-0 left-[6%] w-28 h-28 rounded-full bg-fuchsia-400/20 blur-2xl" />

      {/* oval ring (a circle squashed vertically), sits behind the photo */}
      <div className="absolute inset-0" style={{ transform: `scaleY(${RING_FLATTEN})` }}>
        <div className="absolute inset-[4%] rounded-full border-[3px] border-pink-400/25 blur-md" />
        <div className="absolute inset-[4%] rounded-full border border-pink-300/45 blur-[1.5px]" />

        {/* logos travel along the ring */}
        <div className="absolute inset-0 animate-orbit">
          {orbit.map(({ label, logo }, i) => {
            const angle = (i / orbit.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <div
                key={label}
                className="absolute"
                style={{
                  left: `${50 + 46 * Math.cos(angle)}%`,
                  top: `${50 + 46 * Math.sin(angle)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* cancel the ring's rotation and squash so each logo stays upright */}
                <div className="animate-orbit-reverse">
                  <span
                    title={logo.title}
                    style={{ transform: `scaleY(${1 / RING_FLATTEN})` }}
                    className="flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-xl bg-white/95 shadow-[0_0_26px_-4px_rgba(255,120,170,0.65)]"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" role="img" aria-label={logo.title}>
                      <path d={logo.path} fill={`#${logo.hex}`} />
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* photo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-[56%]"
        >
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden card-surface shadow-card animate-float ring-1 ring-pink-300/20">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-rose-gradient flex items-center justify-center">
                <span className="font-display text-white/70 text-sm tracking-widest uppercase">
                  Add profile photo
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={icon.title}
      className="w-11 h-11 rounded-full pill-btn flex items-center justify-center hover:border-rose transition"
    >
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" role="img">
        <path d={icon.path} />
      </svg>
    </a>
  );
}

export default function Hero({ profile }) {
  const name = profile?.name || "Tejal Dalvi";
  const [first, ...rest] = name.split(" ");
  const last = rest.join(" ");
  const role = profile?.title || "Full Stack Developer";
  // Hero uses its own short intro (heroBio) - the long About text is separate.
  const bio =
    profile?.heroBio ||
    "Product Designer & Frontend Engineer — I design expressive interfaces and ship them myself, pixel to production.";
  const image = profile?.profileImage ? fileUrl(profile.profileImage) : null;
  const social = profile?.socialLinks || {};
  const orbit = pickOrbit(profile?.skillGroups, profile?.skills);

  return (
    <section
      id="top"
      className="relative overflow-hidden section-y !pt-32 md:!pt-36 flex items-center"
    >
      <CodeBackdrop name={name} role={role} stack={orbit.slice(0, 4).map((o) => o.logo.title)} />

      {/* ambient glow */}
      <div className="pointer-events-none absolute -right-40 top-10 w-[560px] h-[560px] rounded-full bg-rose/25 dark:bg-rose/20 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 w-[400px] h-[400px] rounded-full bg-plum/20 blur-[120px]" />

      <div className="container-page w-full grid md:grid-cols-2 gap-8 md:gap-14 items-center relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center md:text-left"
        >
          {/* Hidden on mobile */}
          <motion.div
            variants={item}
            className="hidden md:inline-flex items-center gap-2 pill-btn rounded-full px-4 py-1.5 text-xs tracking-widest uppercase font-medium text-secondary mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose animate-pulse" />
            Available for select work
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
          >
            {first}
            <br />
            <span className="text-rose">{last}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 text-secondary text-base sm:text-lg max-w-md mx-auto md:mx-0 leading-relaxed"
          >
            {bio}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex items-center gap-4 flex-wrap justify-center md:justify-start"
          >
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-6 py-3 text-sm shadow-glow hover:brightness-110 transition"
            >
              View selected work <ArrowUpRight size={16} />
            </a>
            <div className="flex items-center gap-2">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  className="w-11 h-11 rounded-full pill-btn flex items-center justify-center hover:border-rose transition"
                >
                  <Mail size={18} />
                </a>
              )}
              {social.github && <SocialIcon href={social.github} icon={SOCIAL_ICONS.github} />}
              {social.linkedin && <SocialIcon href={social.linkedin} icon={SOCIAL_ICONS.linkedin} />}
              {social.kaggle && (
                <a
                  href={social.kaggle}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Kaggle"
                  className="w-11 h-11 rounded-full pill-btn flex items-center justify-center hover:border-rose transition"
                >
                  <Link2 size={18} />
                </a>
              )}
              {social.twitter && <SocialIcon href={social.twitter} icon={SOCIAL_ICONS.twitter} />}
            </div>
          </motion.div>
        </motion.div>

        <div className="order-first md:order-none flex justify-center md:justify-end">
          <OrbitPhoto image={image} name={name} orbit={orbit} />
        </div>
      </div>
    </section>
  );
}