import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { NAV_LINKS } from "../utils/constants.js";
import { getResume } from "../api/endpoints.js";
import { fileUrl } from "../api/axios.js";

// minimal = detail pages: only the TD logo and the Download CV button.
// resumeUrl = pass it when the page already loaded the profile, otherwise it is fetched here.
export default function Navbar({ minimal = false, resumeUrl: resumeProp }) {
  const [scrolled, setScrolled] = useState(false);
  const [fetchedResume, setFetchedResume] = useState("");
  const resumeUrl = resumeProp !== undefined ? resumeProp : fetchedResume;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Download CV button only shows once a resume is uploaded from the admin Profile page
  useEffect(() => {
    if (resumeProp !== undefined) return;
    getResume()
      .then((res) => setFetchedResume(res.data?.resumeUrl || ""))
      .catch(() => setFetchedResume(""));
  }, [resumeProp]);

  const downloadCv = async () => {
    const url = fileUrl(resumeUrl);
    // "1791535919786-TejalDalvi_Resume.pdf" -> "TejalDalvi_Resume.pdf"
    const fileName = decodeURIComponent(url.split("/").pop() || "Resume.pdf").replace(/^\d+-/, "");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("download failed");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(url, "_blank", "noopener");
    }
  };

  const logo = (
    <>
      TD<span className="text-rose">.</span>
    </>
  );

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 md:top-5 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav shadow-sm" : ""
      }`}
    >
      <nav className="container-page flex items-center justify-between py-4">
        {minimal ? (
          <Link to="/" className="font-display font-bold text-lg tracking-tight">
            {logo}
          </Link>
        ) : (
          <a href="#top" className="font-display font-bold text-lg tracking-tight">
            {logo}
          </a>
        )}

        {!minimal && (
          <ul className="hidden md:flex items-center gap-1 pill-btn rounded-full px-1.5 py-1.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="px-4 py-1.5 text-xs tracking-widest uppercase font-medium text-secondary hover:text-rose transition-colors rounded-full"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3">
          {resumeUrl && (
            <button
              type="button"
              onClick={downloadCv}
              className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-4 sm:px-5 py-2.5 text-xs sm:text-sm shadow-glow hover:brightness-110 transition"
            >
              <Download size={15} /> Download CV
            </button>
          )}
        </div>
      </nav>
    </motion.header>
  );
}