import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Full-screen start page shown until the portfolio data has loaded.
// retrying = the server could not be reached and the page is trying again.
// failed = it kept failing for too long: show a message and a "Try again" button.
export default function SplashScreen({ retrying = false, failed = false, onRetry }) {
  const [slow, setSlow] = useState(false);

  // If the server is slow to wake up, say so instead of looking stuck
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#121012] overflow-hidden">
      <div className="pointer-events-none absolute w-[420px] h-[420px] rounded-full bg-rose/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 w-[320px] h-[320px] rounded-full bg-plum/25 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative font-display font-extrabold text-6xl sm:text-7xl tracking-tight"
      >
        TD<span className="text-rose">.</span>
      </motion.div>

      {failed ? (
        <div className="relative mt-8 flex flex-col items-center text-center px-6">
          <p className="text-secondary">We couldn&apos;t reach the server.</p>
          <p className="text-xs text-muted mt-1">Check your connection and try again.</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 rounded-full bg-rose-gradient text-white font-medium px-6 py-3 text-sm shadow-glow hover:brightness-110 transition"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="relative mt-8 w-40 h-[3px] rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 w-1/3 rounded-full bg-rose-gradient"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <p className="relative mt-6 text-[11px] tracking-[0.3em] uppercase text-muted">
            Loading portfolio
          </p>
        </>
      )}
      {!failed && (retrying || slow) && (
        <motion.p
          key={retrying ? "retry" : "slow"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mt-3 text-xs text-muted"
        >
          {/* {retrying ? "Can't reach the server yet, trying again…" : "Server is waking up, almost there…"} */}
        </motion.p>
      )}
    </div>
  );
}