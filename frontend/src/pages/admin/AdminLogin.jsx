import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, KeyRound } from "lucide-react";
import { loginAdmin, registerAdmin } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { ADMIN_PATH } from "../../utils/constants.js";

export default function AdminLogin() {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ email: "", password: "", secretKey: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res =
        mode === "login" ? await loginAdmin(form) : await registerAdmin(form);
      login(res.data.token, res.data.data);
      navigate(ADMIN_PATH);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="pointer-events-none absolute -right-40 top-10 w-[500px] h-[500px] rounded-full bg-rose/25 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 w-[400px] h-[400px] rounded-full bg-plum/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm card-surface rounded-3xl p-8 shadow-card"
      >
        <div className="w-12 h-12 rounded-full bg-rose-gradient flex items-center justify-center mb-6">
          <Lock size={18} className="text-white" />
        </div>
        <h1 className="font-display font-bold text-2xl mb-1">
          {mode === "login" ? "Admin sign in" : "Create admin account"}
        </h1>
        <p className="text-secondary text-sm mb-6">
          Private area — manage your portfolio content.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl bg-ink/5 dark:bg-white/5 pl-11 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-rose"
              required
            />
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl bg-ink/5 dark:bg-white/5 pl-11 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-rose"
              required
            />
          </div>
          {mode === "register" && (
            <div className="relative">
              <KeyRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                placeholder="Admin register secret"
                value={form.secretKey}
                onChange={(e) => setForm({ ...form, secretKey: e.target.value })}
                className="w-full rounded-xl bg-ink/5 dark:bg-white/5 pl-11 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-rose"
                required
              />
            </div>
          )}

          {error && <p className="text-xs text-rose">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-rose-gradient text-white font-medium py-3 text-sm shadow-glow hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-xs text-secondary hover:text-rose mt-6 transition-colors"
        >
          {mode === "login"
            ? "First time here? Create the admin account"
            : "Already have an account? Sign in"}
        </button>

        <Link to="/" className="block text-xs text-muted hover:text-rose mt-3 transition-colors">
          ← Back to site
        </Link>
      </motion.div>
    </div>
  );
}
