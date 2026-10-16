import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { getProfile, updateProfile } from "../../api/endpoints.js";
import { fileUrl } from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";

const HERO_BIO_MAX = 240;
const MAX_STATS = 3;

const emptyForm = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  heroBio: "",
  aboutHeadline: "",
  aboutBio: "",
  github: "",
  linkedin: "",
  kaggle: "",
  twitter: "",
  portfolio: "",
};

export default function AdminProfile() {
  const [form, setForm] = useState(emptyForm);
  // Tech stack categories. `items` is kept as one comma separated string while typing.
  const [groups, setGroups] = useState([]);
  // About stats: { value: "10+", label: "Projects built" }
  const [stats, setStats] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [removeImage, setRemoveImage] = useState(false); // "Remove photo" clicked, applied on Save
  const [existingResume, setExistingResume] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getProfile();
        const p = res.data?.data;
        if (p) {
          setForm({
            name: p.name || "",
            title: p.title || "",
            email: p.email || "",
            phone: p.phone || "",
            location: p.location || "",
            heroBio: p.heroBio || "",
            aboutHeadline: p.aboutHeadline || "",
            // Old profiles only had one `bio`; start About from it so nothing is lost.
            aboutBio: p.aboutBio || p.bio || "",
            github: p.socialLinks?.github || "",
            linkedin: p.socialLinks?.linkedin || "",
            kaggle: p.socialLinks?.kaggle || "",
            twitter: p.socialLinks?.twitter || "",
            portfolio: p.socialLinks?.portfolio || "",
          });
          setGroups(
            (p.skillGroups || []).map((g) => ({
              title: g.title || "",
              items: (g.items || []).join(", "),
            }))
          );
          setStats(
            (p.aboutStats || []).map((s) => ({ value: s.value || "", label: s.label || "" }))
          );
          setExistingImage(p.profileImage || "");
          setExistingResume(p.resumeUrl || "");
        }
      } catch {
        // no profile yet
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // ----- Tech stack categories -----
  const addGroup = () => setGroups([...groups, { title: "", items: "" }]);
  const removeGroup = (i) => setGroups(groups.filter((_, idx) => idx !== i));
  const updateGroup = (i, key) => (e) =>
    setGroups(groups.map((g, idx) => (idx === i ? { ...g, [key]: e.target.value } : g)));

  // ----- About stats -----
  const addStat = () => {
    if (stats.length < MAX_STATS) setStats([...stats, { value: "", label: "" }]);
  };
  const removeStat = (i) => setStats(stats.filter((_, idx) => idx !== i));
  const updateStat = (i, key) => (e) =>
    setStats(stats.map((s, idx) => (idx === i ? { ...s, [key]: e.target.value } : s)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("title", form.title);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("location", form.location);

      fd.append("heroBio", form.heroBio);

      fd.append("aboutHeadline", form.aboutHeadline);
      fd.append("aboutBio", form.aboutBio);
      fd.append(
        "aboutStats",
        JSON.stringify(stats.filter((s) => s.value.trim() && s.label.trim()))
      );

      fd.append(
        "skillGroups",
        JSON.stringify(
          groups
            .map((g) => ({
              title: g.title.trim(),
              items: g.items.split(",").map((s) => s.trim()).filter(Boolean),
            }))
            .filter((g) => g.title && g.items.length > 0)
        )
      );

      fd.append(
        "socialLinks",
        JSON.stringify({
          github: form.github,
          linkedin: form.linkedin,
          kaggle: form.kaggle,
          twitter: form.twitter,
          portfolio: form.portfolio,
        })
      );
      if (profileImage) fd.append("profileImage", profileImage);
      else if (removeImage) fd.append("removeProfileImage", "true");
      if (resume) fd.append("resume", resume);

      // updateProfile upserts on the backend, so it works whether or not
      // a profile document already exists.
      const res = await updateProfile(fd);
      setExistingImage(res.data?.data?.profileImage || "");
      setProfileImage(null);
      setRemoveImage(false);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  const inputClass =
    "w-full rounded-xl bg-ink/5 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-rose";
  const labelClass = "text-xs font-medium text-secondary mb-1.5 block";
  const hintClass = "text-xs text-muted mt-1.5";
  const smallBtnClass =
    "inline-flex items-center gap-2 rounded-full pill-btn px-4 py-2 text-xs font-medium hover:border-rose transition disabled:opacity-50 disabled:cursor-not-allowed";
  const iconBtnClass =
    "shrink-0 w-10 h-10 rounded-full pill-btn flex items-center justify-center text-secondary hover:text-rose hover:border-rose transition";
  const rowClass = "rounded-xl border border-ink/10 dark:border-white/10 p-4";

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-1">Profile</h1>
      <p className="text-secondary mb-8">
        Everything on your homepage (hero, about, tech stack and contact) is controlled from here.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ---------- Basics ---------- */}
        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-display font-semibold text-lg mb-2">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full name</label>
              <input className={inputClass} value={form.name} onChange={handleChange("name")} required />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                placeholder="Full Stack Developer"
                value={form.title}
                onChange={handleChange("title")}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} value={form.email} onChange={handleChange("email")} required />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={form.phone} onChange={handleChange("phone")} />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input className={inputClass} value={form.location} onChange={handleChange("location")} />
            </div>
          </div>
        </div>

        {/* ---------- Hero banner ---------- */}
        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <div>
            <h2 className="font-display font-semibold text-lg">Hero banner</h2>
            <p className="text-xs text-muted mt-1">
              The short line shown under your name at the top of the homepage.
            </p>
          </div>
          <div>
            <label className={labelClass}>Hero bio</label>
            <textarea
              className={inputClass}
              rows={3}
              maxLength={HERO_BIO_MAX}
              placeholder="Full Stack Developer building fast, clean MERN apps."
              value={form.heroBio}
              onChange={handleChange("heroBio")}
            />
            <p className={hintClass}>
              Keep it to 1-2 lines. {form.heroBio.length}/{HERO_BIO_MAX}
            </p>
          </div>
        </div>

        {/* ---------- About section ---------- */}
        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <div>
            <h2 className="font-display font-semibold text-lg">About section</h2>
            <p className="text-xs text-muted mt-1">Separate from the hero. This fills the About me card.</p>
          </div>
          <div>
            <label className={labelClass}>Headline</label>
            <input
              className={inputClass}
              placeholder="I turn ideas into complete, scalable web apps."
              value={form.aboutHeadline}
              onChange={handleChange("aboutHeadline")}
            />
            <p className={hintClass}>The large heading on the left of the About card.</p>
          </div>
          <div>
            <label className={labelClass}>About text</label>
            <textarea
              className={inputClass}
              rows={8}
              placeholder="Write about yourself. Press Enter to start a new paragraph."
              value={form.aboutBio}
              onChange={handleChange("aboutBio")}
            />
            <p className={hintClass}>Each new line becomes a new paragraph.</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${labelClass} mb-0`}>Stats (optional, max {MAX_STATS})</label>
              <button
                type="button"
                onClick={addStat}
                disabled={stats.length >= MAX_STATS}
                className={smallBtnClass}
              >
                <Plus size={14} /> Add stat
              </button>
            </div>
            {stats.length === 0 && (
              <p className="text-xs text-muted">No stats added. The stats row stays hidden on the site.</p>
            )}
            <div className="space-y-3">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    className={`${inputClass} sm:w-32 shrink-0`}
                    placeholder="10+"
                    value={s.value}
                    onChange={updateStat(i, "value")}
                  />
                  <input
                    className={inputClass}
                    placeholder="Projects built"
                    value={s.label}
                    onChange={updateStat(i, "label")}
                  />
                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className={iconBtnClass}
                    aria-label="Remove stat"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Tech stack ---------- */}
        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display font-semibold text-lg">Tech stack</h2>
              <p className="text-xs text-muted mt-1">
                Each category becomes its own box on the site (Frontend, Backend, Database, Tools...).
              </p>
            </div>
            <button type="button" onClick={addGroup} className={smallBtnClass}>
              <Plus size={14} /> Add category
            </button>
          </div>

          {groups.length === 0 && (
            <p className="text-xs text-muted">
              No categories yet. Click "Add category" to create your first box.
            </p>
          )}

          <div className="space-y-4">
            {groups.map((g, i) => (
              <div key={i} className={`${rowClass} space-y-3`}>
                <div className="flex items-center gap-3">
                  <input
                    className={inputClass}
                    placeholder="Category name (e.g. Frontend)"
                    value={g.title}
                    onChange={updateGroup(i, "title")}
                  />
                  <button
                    type="button"
                    onClick={() => removeGroup(i)}
                    className={iconBtnClass}
                    aria-label="Remove category"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div>
                  <input
                    className={inputClass}
                    placeholder="React, Tailwind CSS, Redux Toolkit"
                    value={g.items}
                    onChange={updateGroup(i, "items")}
                  />
                  <p className={hintClass}>Separate skills with commas. Each one becomes a chip.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Media ---------- */}
        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-display font-semibold text-lg mb-2">Media</h2>
          <div>
            <label className={labelClass}>Profile photo</label>
            {existingImage && !profileImage && !removeImage && (
              <div className="flex items-center gap-4 mb-3">
                <img src={fileUrl(existingImage)} alt="profile" className="w-20 h-20 object-cover rounded-lg" />
                <button type="button" onClick={() => setRemoveImage(true)} className={smallBtnClass}>
                  <Trash2 size={14} /> Remove photo
                </button>
              </div>
            )}
            {removeImage && (
              <p className="text-xs text-rose mb-3">
                The photo will be removed when you save.{" "}
                <button type="button" onClick={() => setRemoveImage(false)} className="underline">
                  Undo
                </button>
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setProfileImage(e.target.files[0]);
                setRemoveImage(false);
              }}
            />
          </div>
          <div>
            <label className={labelClass}>Resume (PDF)</label>
            {existingResume && !resume && (
              <a href={fileUrl(existingResume)} target="_blank" rel="noreferrer" className="text-rose text-sm block mb-2">
                View current resume
              </a>
            )}
            <input type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files[0])} />
          </div>
        </div>

        {/* ---------- Social links ---------- */}
        <div className="card-surface rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-display font-semibold text-lg mb-2">Social links</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>GitHub</label>
              <input className={inputClass} value={form.github} onChange={handleChange("github")} />
            </div>
            <div>
              <label className={labelClass}>LinkedIn</label>
              <input className={inputClass} value={form.linkedin} onChange={handleChange("linkedin")} />
            </div>
            <div>
              <label className={labelClass}>Kaggle</label>
              <input className={inputClass} value={form.kaggle} onChange={handleChange("kaggle")} />
            </div>
            <div>
              <label className={labelClass}>Twitter / X</label>
              <input className={inputClass} value={form.twitter} onChange={handleChange("twitter")} />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-rose">{error}</p>}
        {saved && <p className="text-sm text-emerald-500">Profile saved.</p>}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-6 py-3 text-sm shadow-glow hover:brightness-110 transition disabled:opacity-60"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}