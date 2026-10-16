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
import { getProfile, getProjects, getExperiences, getCaseStudies } from "../api/endpoints.js";
import { fileUrl } from "../api/axios.js";

const MIN_SPLASH_MS = 900; // avoid a flash when the data loads instantly
const RETRY_MS = 3000; // wait before asking the server again
const ATTEMPT_TIMEOUT_MS = 15000; // give up on one attempt after this long and try again
const MAX_WAIT_MS = 30000; // after this the splash shows "couldn't reach the server" + Try again

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Profile and projects are required: the server must answer them (a 404 "no profile yet" counts).
const essentialOk = (r) =>
  r.status === "fulfilled" || (r.reason?.response && r.reason.response.status < 500);
// Experience and case studies only need the server to answer. If one of them errors
// (e.g. a 500), that section just stays hidden instead of blocking the whole site.
const answered = (r) => r.status === "fulfilled" || Boolean(r.reason?.response);

// Resolve once the image is loaded (or failed / took too long)
const preloadImage = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve();
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
    setTimeout(resolve, 4000);
  });

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [run, setRun] = useState(0);
  const location = useLocation();
  const entry = useRef(location); // how this page was opened

  // The site stays on the splash screen until the server has answered for the data.
  // If the backend is down it keeps retrying, and after MAX_WAIT_MS it shows a Try again button.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const started = Date.now();
      while (!cancelled) {
        const results = await Promise.race([
          Promise.allSettled([getProfile(), getProjects(), getExperiences(), getCaseStudies()]),
          wait(ATTEMPT_TIMEOUT_MS).then(() => null),
        ]);

        if (results) {
          const [profileRes, projectsRes, expRes, caseRes] = results;
          if (essentialOk(profileRes) && essentialOk(projectsRes) && answered(expRes) && answered(caseRes)) {
            const ok = (r) => r.status === "fulfilled";

            const profileData = ok(profileRes) ? profileRes.value.data?.data || null : null;
            setProfile(profileData);
            if (ok(projectsRes)) setProjects(projectsRes.value.data?.data || []);
            if (ok(expRes)) setExperiences(expRes.value.data?.data || []);
            if (ok(caseRes)) setCaseStudies(caseRes.value.data?.data || []);

            // Profile photo too, so the hero doesn't pop in after the splash
            if (profileData?.profileImage) await preloadImage(fileUrl(profileData.profileImage));
            await wait(Math.max(0, MIN_SPLASH_MS - (Date.now() - started)));
            if (!cancelled) setLoading(false);
            return;
          }
        }

        if (Date.now() - started > MAX_WAIT_MS) {
          if (!cancelled) setFailed(true);
          return;
        }
        if (!cancelled) setRetrying(true);
        await wait(RETRY_MS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [run]);

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