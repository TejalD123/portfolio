import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, Mail, MailOpen, Plus } from "lucide-react";
import { getProjects, getContacts } from "../../api/endpoints.js";
import Reveal from "../../components/Reveal.jsx";
import { ADMIN_PATH } from "../../utils/constants.js";

export default function AdminDashboard() {
  const [projectCount, setProjectCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [p, c] = await Promise.allSettled([getProjects(), getContacts()]);
        if (p.status === "fulfilled") setProjectCount((p.value.data?.data || []).length);
        if (c.status === "fulfilled") {
          const msgs = c.value.data?.data || [];
          setTotalMessages(msgs.length);
          setUnreadCount(msgs.filter((m) => !m.isRead).length);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const cards = [
    { label: "Projects", value: projectCount, icon: FolderKanban, to: `${ADMIN_PATH}/projects` },
    { label: "Total messages", value: totalMessages, icon: Mail, to: `${ADMIN_PATH}/messages` },
    { label: "Unread messages", value: unreadCount, icon: MailOpen, to: `${ADMIN_PATH}/messages` },
  ];

  return (
    <div>
      <Reveal>
        <h1 className="font-display font-bold text-3xl mb-1">Welcome back</h1>
        <p className="text-secondary mb-8">Here's a quick snapshot of your portfolio.</p>
      </Reveal>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.08}>
            <Link
              to={c.to}
              className="block card-surface rounded-2xl p-6 shadow-card hover:-translate-y-1 transition-transform"
            >
              <c.icon size={18} className="text-rose mb-3" />
              <div className="font-display font-bold text-3xl">{c.value}</div>
              <div className="text-xs text-muted mt-1">{c.label}</div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <Link
          to={`${ADMIN_PATH}/projects/new`}
          className="inline-flex items-center gap-2 rounded-full bg-rose-gradient text-white font-medium px-6 py-3 text-sm shadow-glow hover:brightness-110 transition"
        >
          <Plus size={16} /> Add new project
        </Link>
      </Reveal>
    </div>
  );
}
