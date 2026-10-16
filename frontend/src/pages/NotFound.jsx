import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="eyebrow mb-4">404</span>
      <h1 className="font-display font-bold text-4xl mb-4">Page not found</h1>
      <p className="text-secondary mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-6 py-3 text-sm shadow-glow hover:brightness-110 transition"
      >
        Back home
      </Link>
    </div>
  );
}
