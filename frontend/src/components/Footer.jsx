import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "../api/endpoints.js";

export default function Footer({ profile }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const email = profile?.email || "hello@tejaldalvi.design";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      await sendContactMessage(form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <footer className="pb-12 pt-4">
      <div className="container-page">
        <div className="card-surface rounded-3xl p-6 sm:p-8 md:p-12 shadow-card grid md:grid-cols-2 gap-8 md:gap-10 mb-10">
          <div className="min-w-0">
            <span className="eyebrow">Get in touch</span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl mt-4 leading-tight break-words">
              Let's build something precise —{" "}
              <a
                href={`mailto:${email}`}
                className="text-rose underline underline-offset-4 break-all"
              >
                {email}
              </a>
            </h3>
            <p className="text-secondary mt-4 leading-relaxed">
              Have a project in mind, or just want to say hello? Drop a message and I'll get back
              to you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 min-w-0">
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl bg-ink/5 dark:bg-white/5 border border-transparent focus:border-rose outline-none px-4 py-3 text-sm placeholder:text-muted"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl bg-ink/5 dark:bg-white/5 border border-transparent focus:border-rose outline-none px-4 py-3 text-sm placeholder:text-muted"
              required
            />
            <textarea
              placeholder="Your message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-xl bg-ink/5 dark:bg-white/5 border border-transparent focus:border-rose outline-none px-4 py-3 text-sm placeholder:text-muted resize-none"
              required
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-6 py-3 text-sm shadow-glow hover:brightness-110 transition disabled:opacity-60"
            >
              {status === "sent" ? (
                <>
                  Sent <CheckCircle2 size={16} />
                </>
              ) : (
                <>
                  {status === "sending" ? "Sending..." : "Send message"} <Send size={14} />
                </>
              )}
            </motion.button>
            {status === "error" && (
              <p className="text-xs text-rose">Something went wrong. Please try again.</p>
            )}
          </form>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-ink/10 dark:border-white/10 text-xs text-muted">
          <span>© {new Date().getFullYear()} {profile?.name || "Tejal Dalvi"}</span>
          <span>Built with React, Tailwind &amp; care.</span>
        </div>
      </div>
    </footer>
  );
}