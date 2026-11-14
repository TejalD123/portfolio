import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import TechStack from "../components/TechStack.jsx";
import Projects from "../components/Projects.jsx";
import Experience from "../components/Experience.jsx";
import CaseStudies from "../components/CaseStudies.jsx";
import Footer from "../components/Footer.jsx";
import SplashScreen from "../components/SplashScreen.jsx";
import {
  getHome,
  getProfile,
  getProjects,
  getExperiences,
  getCaseStudies,
} from "../api/endpoints.js";
import { fileUrl } from "../api/axios.js";

const CACHE_KEY = "td-home-cache-v1";
const MIN_SPLASH_MS = 400; // avoid a flash when the data loads instantly
const RETRY_MS = 2000; // wait before asking the server again
const ATTEMPT_TIMEOUT_MS = 25000; // one request may take this long (free hosting needs time to wake up)
const MAX_WAIT_MS = 75000; // after this the splash shows "couldn't reach the server" + Try again
const IMAGE_WAIT_MS = 1000; // never hold the splash for the profile photo longer than this

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- Local cache: the last successful data is shown instantly on the next visit ----
const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* storage full / blocked: ignore */
  }
};

// Resolve once the image is loaded (or failed / took too long)
const preloadImage = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve();
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
    setTimeout(resolve, IMAGE_WAIT_MS);
  });

// Old fallback (used only if the backend doesn't have /api/home yet):
// profile and projects are required (a 404 "no profile yet" counts as an answer).
const essentialOk = (r) =>
  r.status === "fulfilled" || (r.reason?.response && r.reason.response.status < 500);
const answered = (r) => r.status === "fulfilled" || Boolean(r.reason?.response);

const fetchSeparately = async () => {
  const [profileRes, projectsRes, expRes, caseRes] = await Promise.allSettled([
    getProfile(),
    getProjects(),
    getExperiences(),
    getCaseStudies(),
  ]);
  if (!(essentialOk(profileRes) && essentialOk(projectsRes) && answered(expRes) && answered(caseRes))) {
    throw new Error("Server not reachable");
  }
  const ok = (r) => r.status === "fulfilled";
  return {
    profile: ok(profileRes) ? profileRes.value.data?.data || null : null,
    projects: ok(projectsRes) ? projectsRes.value.data?.data || [] : [],
    experiences: ok(expRes) ? expRes.value.data?.data || [] : [],
    caseStudies: ok(caseRes) ? caseRes.value.data?.data || [] : [],
  };
};

// One request for everything (GET /api/home). Falls back to the 4 old calls on a 404.
const fetchAll = async () => {
  try {
    const res = await getHome({ timeout: ATTEMPT_TIMEOUT_MS });
    const d = res.data?.data || {};
    return {
      profile: d.profile || null,
      projects: d.projects || [],
      experiences: d.experiences || [],
      caseStudies: d.caseStudies || [],
    };
  } catch (err) {
    if (err?.response?.status === 404) return fetchSeparately();
    throw err;
  }
};

export default function Home() {
  const cached = useRef(readCache()); // data from the last visit, if any
  const hasCache = Boolean(cached.current);

  const [profile, setProfile] = useState(cached.current?.profile ?? null);
  const [projects, setProjects] = useState(cached.current?.projects ?? []);
  const [experiences, setExperiences] = useState(cached.current?.experiences ?? []);
  const [caseStudies, setCaseStudies] = useState(cached.current?.caseStudies ?? []);
  const [loading, setLoading] = useState(!hasCache); // cached visit: no splash at all
  const [retrying, setRetrying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [run, setRun] = useState(0);
  const location = useLocation();
  const entry = useRef(location); // how this page was opened

  // - Returning visitor: the site shows instantly from cache and refreshes quietly in the background.
  // - First visit: splash until ONE request (/api/home) answers. If the server is down it keeps
  //   retrying, and after MAX_WAIT_MS it shows a Try again button.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const started = Date.now();
      while (!cancelled) {
        try {
          const data = await fetchAll();
          if (cancelled) return;

          setProfile(data.profile);
          setProjects(data.projects);
          setExperiences(data.experiences);
          setCaseStudies(data.caseStudies);
          if (data.profile) writeCache(data);

          if (!hasCache) {
            // Profile photo too (but only briefly), so the hero doesn't pop in after the splash
            if (data.profile?.profileImage) await preloadImage(fileUrl(data.profile.profileImage));
            await wait(Math.max(0, MIN_SPLASH_MS - (Date.now() - started)));
            if (!cancelled) setLoading(false);
          }
          return;
        } catch {
          if (cancelled) return;
          if (Date.now() - started > MAX_WAIT_MS) {
            if (!hasCache) setFailed(true); // with a cache the old data simply stays on screen
            return;
          }
          if (!hasCache) setRetrying(true);
          await wait(RETRY_MS);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [run, hasCache]);

  const retry = () => {
    setFailed(false);
    setRetrying(false);
    setRun((n) => n + 1);
  };

  // Once the data is ready:
  // - fresh visit / refresh (even if the URL still has an old #section): start at the top, on the Hero
  // - coming back from a detail page (e.g. "/#experience"): scroll to that section
  useEffect(() => {
    if (loading) return;
    const { key, hash, pathname, search } = entry.current;
    if (key === "default") {
      window.scrollTo(0, 0);
      if (hash) window.history.replaceState(null, "", pathname + search);
    } else if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, [loading]);

  if (loading) return <SplashScreen retrying={retrying} failed={failed} onRetry={retry} />;

  return (
    <div className="min-h-screen">
      <Navbar resumeUrl={profile?.resumeUrl} />
      <Hero profile={profile} />
      <About profile={profile} />
      <TechStack groups={profile?.skillGroups} skills={profile?.skills} />
      <Projects projects={projects} loading={false} />
      <Experience experiences={experiences} />
      <CaseStudies caseStudies={caseStudies} />
      <Footer profile={profile} />
    </div>
  );
}
