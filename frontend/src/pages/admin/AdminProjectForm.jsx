import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import { getProjectById, createProject, updateProject } from "../../api/endpoints.js";
import { fileUrl } from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { ADMIN_PATH } from "../../utils/constants.js";

const emptyForm = {
  title: "",
  field: "",
  info: "",
  details: "",
  order: "",
  techStack: "",
  additionalTech: "",
  githubLink: "",
  liveDemoLink: "",
  datasetLink: "",
  featured: false,
  role: "",
  keyLearning: "",
  projectDate: "",
};

export default function AdminProjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [existingThumb, setExistingThumb] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await getProjectById(id);
        const p = res.data?.data;
        setForm({
          title: p.title || "",
          field: p.field || "",
          info: p.info || "",
          details: p.details || "",
          order: p.order > 0 ? String(p.order) : "",
          techStack: (p.techStack || []).join(", "),
          additionalTech: (p.additionalTech || []).join(", "),
          githubLink: p.githubLink || "",
          liveDemoLink: p.liveDemoLink || "",
          datasetLink: p.datasetLink || "",
          featured: p.featured || false,
          role: p.role || "",
          keyLearning: p.keyLearning || "",
          projectDate: p.projectDate || "",
        });
        setExistingThumb(p.thumbnail || "");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const handleChange = (key) => (e) =>
    setForm({ ...form, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("field", form.field);
      fd.append("info", form.info);
      fd.append("details", form.details);
      fd.append("order", form.order === "" ? 0 : form.order);
      // Backend splits techStack on commas itself, so send as a plain string
      fd.append("techStack", form.techStack);
      fd.append("additionalTech", form.additionalTech);
      fd.append("githubLink", form.githubLink);
      fd.append("liveDemoLink", form.liveDemoLink);
      fd.append("datasetLink", form.datasetLink);
      fd.append("featured", form.featured);
      fd.append("role", form.role);
      fd.append("keyLearning", form.keyLearning);
      fd.append("projectDate", form.projectDate);
      if (thumbnail) fd.append("thumbnail", thumbnail);
      images.forEach((img) => fd.append("images", img));

      if (isEdit) {
        await updateProject(id, fd);
      } else {
        await createProject(fd);
      }
      navigate(`${ADMIN_PATH}/projects`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  const inputClass =
    "w-full rounded-xl bg-ink/5 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-rose";
  const labelClass = "text-xs font-medium text-secondary mb-1.5 block";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl">
          {isEdit ? "Edit project" : "New project"}
        </h1>
        <button
          onClick={() => navigate(`${ADMIN_PATH}/projects`)}
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
              <label className={labelClass}>Field / Category</label>
              <input
                className={inputClass}
                placeholder="e.g. Machine Learning, NLP"
                value={form.field}
                onChange={handleChange("field")}
                required
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Short info (shown on the project card)</label>
            <textarea className={inputClass} rows={2} value={form.info} onChange={handleChange("info")} required />
          </div>
          <div>
            <label className={labelClass}>Detailed info (shown on the project page, one point per line)</label>
            <textarea
              className={inputClass}
              rows={6}
              placeholder="One point per line. The first 4 show on the page, the rest open with “Show more”."
              value={form.details}
              onChange={handleChange("details")}
            />
          </div>
          <div>
            <label className={labelClass}>Tech stack — languages / frameworks (comma separated)</label>
            <input
              className={inputClass}
              placeholder="React, Node.js, Express.js, MongoDB"
              value={form.techStack}
              onChange={handleChange("techStack")}
            />
          </div>
          <div>
            <label className={labelClass}>Additional tech / services used (comma separated)</label>
            <input
              className={inputClass}
              placeholder="Firebase, Authentication, Vercel"
              value={form.additionalTech}
              onChange={handleChange("additionalTech")}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>GitHub link</label>
              <input className={inputClass} value={form.githubLink} onChange={handleChange("githubLink")} />
            </div>
            <div>
              <label className={labelClass}>Live demo link</label>
              <input className={inputClass} value={form.liveDemoLink} onChange={handleChange("liveDemoLink")} />
            </div>
            <div>
              <label className={labelClass}>Dataset link</label>
              <input className={inputClass} value={form.datasetLink} onChange={handleChange("datasetLink")} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className={labelClass}>Display order (1 shows first, 2 next… leave empty to show last)</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                placeholder="e.g. 1"
                value={form.order}
                onChange={handleChange("order")}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-secondary pb-3">
              <input type="checkbox" checked={form.featured} onChange={handleChange("featured")} />
              Featured project
            </label>
          </div>
        </div>

        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-display font-semibold text-lg mb-2">Images</h2>
          <div>
            <label className={labelClass}>Card image (thumbnail) — shown on the project card</label>
            {existingThumb && !thumbnail && (
              <img src={fileUrl(existingThumb)} alt="thumbnail" className="w-24 h-24 object-cover rounded-lg mb-2" />
            )}
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
          </div>
          <div>
            <label className={labelClass}>Project page images (multiple, up to 5) — shown in the carousel on the project page</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))}
            />
            <p className="text-xs text-muted mt-1">Choosing new images replaces the existing ones.</p>
          </div>
        </div>

        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <div>
            <h2 className="font-display font-semibold text-lg">Project details</h2>
            <p className="text-xs text-muted mt-1">
              Optional quick facts shown near the top of the project page. Separate from the
              longer case study below.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Your role</label>
              <input
                className={inputClass}
                placeholder="e.g. Solo developer, Backend lead"
                value={form.role}
                onChange={handleChange("role")}
              />
            </div>
            <div>
              <label className={labelClass}>Month & year</label>
              <input
                className={inputClass}
                placeholder="e.g. March 2025"
                value={form.projectDate}
                onChange={handleChange("projectDate")}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>What I learned (one point per line)</label>
            <textarea
              className={inputClass}
              rows={5}
              placeholder="One point per line — each line shows as a bullet on the project page"
              value={form.keyLearning}
              onChange={handleChange("keyLearning")}
            />
          </div>
        </div>

        {error && <p className="text-sm text-rose">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-6 py-3 text-sm shadow-glow hover:brightness-110 transition disabled:opacity-60"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save project"}
        </button>
      </form>
    </div>
  );
}