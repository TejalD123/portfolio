import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import { getExperienceById, createExperience, updateExperience } from "../../api/endpoints.js";
import { fileUrl } from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { ADMIN_PATH } from "../../utils/constants.js";

const emptyForm = {
  company: "",
  role: "",
  type: "Internship",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  yearsOfExperience: "",
  companyLink: "",
  summary: "",
  description: "",
  responsibilities: "",
  projects: "",
  technologies: "",
  integrations: "",
  deployment: "",
  outcome: "",
};

export default function AdminExperienceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [logo, setLogo] = useState(null);
  const [existingLogo, setExistingLogo] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await getExperienceById(id);
        const e = res.data?.data;
        setForm({
          company: e.company || "",
          role: e.role || "",
          type: e.type || "Internship",
          location: e.location || "",
          startDate: e.startDate || "",
          endDate: e.endDate || "",
          isCurrent: e.isCurrent || false,
          yearsOfExperience: e.yearsOfExperience || "",
          companyLink: e.companyLink || "",
          summary: e.summary || "",
          description: e.description || "",
          responsibilities: (e.responsibilities || []).join("\n"),
          projects: (e.projects || []).join("\n"),
          technologies: (e.technologies || []).join(", "),
          integrations: (e.integrations || []).join(", "),
          deployment: (e.deployment || []).join(", "),
          outcome: e.outcome || "",
        });
        setExistingLogo(e.logo || "");
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
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logo) fd.append("logo", logo);

      if (isEdit) {
        await updateExperience(id, fd);
      } else {
        await createExperience(fd);
      }
      navigate(`${ADMIN_PATH}/experience`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  const inputClass =
    "w-full rounded-xl bg-ink/5 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-rose";
  const labelClass = "text-xs font-medium text-secondary mb-1.5 block";
  const hintClass = "text-xs text-muted mt-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl">
          {isEdit ? "Edit experience" : "New experience"}
        </h1>
        <button
          onClick={() => navigate(`${ADMIN_PATH}/experience`)}
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
              <label className={labelClass}>Company name</label>
              <input className={inputClass} value={form.company} onChange={handleChange("company")} required />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input
                className={inputClass}
                placeholder="e.g. Full Stack Developer Intern"
                value={form.role}
                onChange={handleChange("role")}
                required
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select className={inputClass} value={form.type} onChange={handleChange("type")}>
                <option value="Internship">Internship</option>
                <option value="Job">Job</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                className={inputClass}
                placeholder="e.g. Mumbai, India / Remote"
                value={form.location}
                onChange={handleChange("location")}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start date</label>
              <input type="month" className={inputClass} value={form.startDate} onChange={handleChange("startDate")} />
            </div>
            <div>
              <label className={labelClass}>End date</label>
              <input
                type="month"
                className={`${inputClass} disabled:opacity-40`}
                value={form.endDate}
                onChange={handleChange("endDate")}
                disabled={form.isCurrent}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-secondary">
            <input type="checkbox" checked={form.isCurrent} onChange={handleChange("isCurrent")} />
            I currently work here
          </label>
          {form.type === "Job" && (
            <div>
              <label className={labelClass}>Years of experience</label>
              <input
                className={inputClass}
                placeholder="e.g. 2 years"
                value={form.yearsOfExperience}
                onChange={handleChange("yearsOfExperience")}
              />
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company website (optional)</label>
              <input className={inputClass} value={form.companyLink} onChange={handleChange("companyLink")} />
            </div>
            <div>
              <label className={labelClass}>Company logo (optional)</label>
              {existingLogo && !logo && (
                <img src={fileUrl(existingLogo)} alt="logo" className="w-12 h-12 object-cover rounded-lg mb-2" />
              )}
              <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} />
            </div>
          </div>
        </div>

        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-display font-semibold text-lg mb-2">About the role</h2>
          <div>
            <label className={labelClass}>Short summary (shown on the card)</label>
            <textarea className={inputClass} rows={2} value={form.summary} onChange={handleChange("summary")} />
          </div>
          <div>
            <label className={labelClass}>Overview (shown on the detail page)</label>
            <textarea className={inputClass} rows={4} value={form.description} onChange={handleChange("description")} />
          </div>
          <div>
            <label className={labelClass}>Responsibilities</label>
            <textarea
              className={inputClass}
              rows={4}
              placeholder="One point per line"
              value={form.responsibilities}
              onChange={handleChange("responsibilities")}
            />
          </div>
          <div>
            <label className={labelClass}>Projects worked on</label>
            <textarea
              className={inputClass}
              rows={4}
              placeholder="One project per line — name and a short description"
              value={form.projects}
              onChange={handleChange("projects")}
            />
          </div>
        </div>

        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-display font-semibold text-lg mb-2">Tech, integrations &amp; deployment</h2>
          <div>
            <label className={labelClass}>Technologies (comma separated)</label>
            <input
              className={inputClass}
              placeholder="React, Node.js, Express.js, MongoDB"
              value={form.technologies}
              onChange={handleChange("technologies")}
            />
          </div>
          <div>
            <label className={labelClass}>Integrations (comma separated)</label>
            <input
              className={inputClass}
              placeholder="Razorpay, Firebase Auth, Twilio"
              value={form.integrations}
              onChange={handleChange("integrations")}
            />
            <p className={hintClass}>Shown as icon boxes on the detail page.</p>
          </div>
          <div>
            <label className={labelClass}>Deployment (comma separated)</label>
            <input
              className={inputClass}
              placeholder="Vercel, Render, Docker, GitHub Actions"
              value={form.deployment}
              onChange={handleChange("deployment")}
            />
            <p className={hintClass}>Shown as icon boxes on the detail page.</p>
          </div>
          <div>
            <label className={labelClass}>Outcome</label>
            <textarea
              className={inputClass}
              rows={4}
              placeholder="One point per line — what was achieved"
              value={form.outcome}
              onChange={handleChange("outcome")}
            />
          </div>
        </div>

        {error && <p className="text-sm text-rose">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-6 py-3 text-sm shadow-glow hover:brightness-110 transition disabled:opacity-60"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save experience"}
        </button>
      </form>
    </div>
  );
}