import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getExperiences, deleteExperience } from "../../api/endpoints.js";
import { fileUrl } from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import Reveal from "../../components/Reveal.jsx";
import { ADMIN_PATH } from "../../utils/constants.js";
import { formatRange } from "../../utils/detailHelpers.js";

export default function AdminExperience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getExperiences();
      setItems(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience? This cannot be undone.")) return;
    await deleteExperience(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Experience</h1>
          <p className="text-secondary">Internships and jobs shown on your public site.</p>
        </div>
        <Link
          to={`${ADMIN_PATH}/experience/new`}
          className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-5 py-2.5 text-sm shadow-glow hover:brightness-110 transition"
        >
          <Plus size={16} /> New
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="card-surface rounded-2xl p-12 text-center text-secondary">
          No experience yet. Add your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((e, i) => (
            <Reveal key={e._id} delay={i * 0.04}>
              <div className="card-surface rounded-2xl p-4 flex items-center gap-4 shadow-card">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-rose-gradient text-white flex items-center justify-center font-display font-bold text-xl shrink-0">
                  {e.logo ? (
                    <img src={fileUrl(e.logo)} alt={e.company} className="w-full h-full object-cover" />
                  ) : (
                    e.company?.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs eyebrow">
                    {e.type} · {formatRange(e.startDate, e.endDate, e.isCurrent)}
                  </p>
                  <h3 className="font-semibold truncate">{e.role}</h3>
                  <p className="text-sm text-secondary truncate">{e.company}</p>
                </div>
                <Link
                  to={`${ADMIN_PATH}/experience/${e._id}/edit`}
                  className="w-9 h-9 rounded-full pill-btn flex items-center justify-center hover:border-rose transition-colors"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(e._id)}
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