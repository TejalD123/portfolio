import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import { getCaseStudyById, createCaseStudy, updateCaseStudy } from "../../api/endpoints.js";
import { fileUrl } from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { ADMIN_PATH } from "../../utils/constants.js";

const emptyForm = {
  title: "",
  category: "",
  summary: "",
  techStack: "",
  githubLink: "",
  liveDemoLink: "",
  problemStatement: "",
  approach: "",
  dataset: "",
  results: "",
  learnings: "",
};

export default function AdminCaseStudyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [cover, setCover] = useState(null);
  const [existingCover, setExistingCover] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await getCaseStudyById(id);
        const c = res.data?.data;
        setForm({
          title: c.title || "",
          category: c.category || "",
          summary: c.summary || "",
          techStack: (c.techStack || []).join(", "),
          githubLink: c.githubLink || "",
          liveDemoLink: c.liveDemoLink || "",
          problemStatement: c.problemStatement || "",
          approach: c.approach || "",
          dataset: c.dataset || "",
          results: c.results || "",
          learnings: c.learnings || "",
        });
        setExistingCover(c.coverImage || "");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const handleChange = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (cover) fd.append("cover", cover);

      if (isEdit) {
        await updateCaseStudy(id, fd);
      } else {
        await createCaseStudy(fd);
      }
      navigate(`${ADMIN_PATH}/case-studies`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save case study");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  const inputClass =
    "w-full rounded-xl bg-ink/5 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-rose";
  const labelClass = "text-xs font-medium text-secondary mb-1.5 block";

  const textareas = [
    ["problemStatement", "Problem statement"],
    ["approach", "Approach"],
    ["dataset", "Dataset"],
    ["results", "Results"],
    ["learnings", "Learnings"],
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl">
          {isEdit ? "Edit case study" : "New case study"}
        </h1>
        <button
          onClick={() => navigate(`${ADMIN_PATH}/case-studies`)}
          className="w-9 h-9 rounded-full pill-btn flex items-center justify-center"
        >
          <X size={15} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-display font-semibold text-lg mb-2">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title</label>
              <input className={inputClass} value={form.title} onChange={handleChange("title")} required />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input
                className={inputClass}
                placeholder="e.g. Machine Learning, NLP"
                value={form.category}
                onChange={handleChange("category")}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Short summary (shown on the card)</label>
            <textarea className={inputClass} rows={2} value={form.summary} onChange={handleChange("summary")} />
          </div>
          <div>
            <label className={labelClass}>Tech stack (comma separated)</label>
            <input
              className={inputClass}
              placeholder="Python, TensorFlow, Pandas"
              value={form.techStack}
              onChange={handleChange("techStack")}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>GitHub link (optional)</label>
              <input className={inputClass} value={form.githubLink} onChange={handleChange("githubLink")} />
            </div>
            <div>
              <label className={labelClass}>Live demo link (optional)</label>
              <input className={inputClass} value={form.liveDemoLink} onChange={handleChange("liveDemoLink")} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Cover image (optional)</label>
            {existingCover && !cover && (
              <img src={fileUrl(existingCover)} alt="cover" className="w-24 h-24 object-cover rounded-lg mb-2" />
            )}
            <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} />
          </div>
        </div>

        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <div>
            <h2 className="font-display font-semibold text-lg">Case study</h2>
            <p className="text-xs text-muted mt-1">
              One point per line — each line becomes a bullet. Empty sections are hidden.
            </p>
          </div>
          {textareas.map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <textarea className={inputClass} rows={3} value={form[key]} onChange={handleChange(key)} />
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-rose">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-6 py-3 text-sm shadow-glow hover:brightness-110 transition disabled:opacity-60"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save case study"}
        </button>
      </form>
    </div>
  );
}