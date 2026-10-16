import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getCaseStudies, deleteCaseStudy } from "../../api/endpoints.js";
import { fileUrl } from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import Reveal from "../../components/Reveal.jsx";
import { ADMIN_PATH } from "../../utils/constants.js";

export default function AdminCaseStudies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCaseStudies();
      setItems(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this case study? This cannot be undone.")) return;
    await deleteCaseStudy(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Case studies</h1>
          <p className="text-secondary">
            Shown on your public site only when at least one is added.
          </p>
        </div>
        <Link
          to={`${ADMIN_PATH}/case-studies/new`}
          className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-5 py-2.5 text-sm shadow-glow hover:brightness-110 transition"
        >
          <Plus size={16} /> New
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="card-surface rounded-2xl p-12 text-center text-secondary">
          No case studies yet. Add your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((c, i) => (
            <Reveal key={c._id} delay={i * 0.04}>
              <div className="card-surface rounded-2xl p-4 flex items-center gap-4 shadow-card">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-rose-gradient shrink-0">
                  {c.coverImage && (
                    <img src={fileUrl(c.coverImage)} alt={c.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs eyebrow">{c.category || "Case study"}</p>
                  <h3 className="font-semibold truncate">{c.title}</h3>
                </div>
                <Link
                  to={`${ADMIN_PATH}/case-studies/${c._id}/edit`}
                  className="w-9 h-9 rounded-full pill-btn flex items-center justify-center hover:border-rose transition-colors"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="w-9 h-9 rounded-full pill-btn flex items-center justify-center hover:border-rose hover:text-rose transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}