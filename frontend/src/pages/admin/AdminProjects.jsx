import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getProjects, deleteProject } from "../../api/endpoints.js";
import { fileUrl } from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import Reveal from "../../components/Reveal.jsx";
import { ADMIN_PATH } from "../../utils/constants.js";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      setProjects(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await deleteProject(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Projects</h1>
          <p className="text-secondary">Manage the work shown on your public site.</p>
        </div>
        <Link
          to={`${ADMIN_PATH}/projects/new`}
          className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-5 py-2.5 text-sm shadow-glow hover:brightness-110 transition"
        >
          <Plus size={16} /> New
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <div className="card-surface rounded-2xl p-12 text-center text-secondary">
          No projects yet. Add your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p, i) => (
            <Reveal key={p._id} delay={i * 0.04}>
              <div className="card-surface rounded-2xl p-4 flex items-center gap-4 shadow-card">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-rose-gradient shrink-0">
                  {p.thumbnail && (
                    <img src={fileUrl(p.thumbnail)} alt={p.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs eyebrow">{p.field}</p>
                  <h3 className="font-semibold truncate">{p.title}</h3>
                </div>
                <Link
                  to={`${ADMIN_PATH}/projects/${p._id}/edit`}
                  className="w-9 h-9 rounded-full pill-btn flex items-center justify-center hover:border-rose transition-colors"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
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
