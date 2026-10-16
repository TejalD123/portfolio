// Hidden admin entry point. Change this (and keep it secret) — it is never
// linked anywhere in the public site. Visit it directly in the browser.
export const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/admin";

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  // { label: "Cases", href: "#cases" },
];