import {
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
  Boxes,
  GitBranch,
  Database,
  Sparkles,
} from "lucide-react";

// Icon for tech / service / integration boxes (not languages)
export const techIcon = (label = "") => {
  const l = label.toLowerCase();
  if (l.includes("firebase")) return Flame;
  if (l.includes("vercel")) return Triangle;
  if (l.includes("otp") || l.includes("sms")) return Smartphone;
  if (l.includes("auth") || l.includes("jwt") || l.includes("oauth")) return ShieldCheck;
  if (l.includes("password") || l.includes("bcrypt") || l.includes("encrypt")) return Lock;
  if (l.includes("token") || l.includes("key")) return KeyRound;
  if (l.includes("mail") || l.includes("smtp")) return Mail;
  if (l.includes("pay") || l.includes("razorpay") || l.includes("stripe")) return CreditCard;
  if (l.includes("docker") || l.includes("container") || l.includes("kubernetes")) return Boxes;
  if (l.includes("git") || l.includes("ci") || l.includes("pipeline")) return GitBranch;
  if (l.includes("mongo") || l.includes("sql") || l.includes("database") || l.includes("redis")) return Database;
  if (l.includes("render") || l.includes("heroku") || l.includes("railway") || l.includes("server") || l.includes("nginx")) return Server;
  if (l.includes("netlify") || l.includes("aws") || l.includes("cloud") || l.includes("hosting") || l.includes("azure")) return Cloud;
  if (l.includes("api") || l.includes("web")) return Globe;
  if (l.includes("design") || l.includes("ui")) return Layers;
  return Sparkles;
};

// Turn a text block into bullet points (one per line, else one per sentence)
export const toPoints = (text = "") => {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);
  if (lines.length > 1) return lines;
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((l) => l.trim())
    .filter(Boolean);
};

// "2024-06" -> "Jun 2024"
export const formatMonth = (ym) => {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  if (Number.isNaN(d.getTime())) return ym;
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
};

// "Jun 2024 – Aug 2024" / "Jun 2024 – Present"
export const formatRange = (start, end, current) => {
  if (!start) return "";
  const from = formatMonth(start);
  const to = current ? "Present" : formatMonth(end);
  return to ? `${from} – ${to}` : from;
};

// "3 mos" / "1 yr 2 mos"
export const formatLength = (start, end, current) => {
  if (!start) return "";
  const [sy, sm] = start.split("-").map(Number);
  let ey;
  let em;
  if (current || !end) {
    const now = new Date();
    ey = now.getFullYear();
    em = now.getMonth() + 1;
  } else {
    [ey, em] = end.split("-").map(Number);
  }
  const total = (ey - sy) * 12 + (em - sm) + 1;
  if (!Number.isFinite(total) || total < 1) return "";
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ");
};