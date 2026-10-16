import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { getContacts, markContactAsRead, deleteContact } from "../../api/endpoints.js";
import Loader from "../../components/Loader.jsx";
import Reveal from "../../components/Reveal.jsx";

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getContacts();
      setMessages(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRead = async (id) => {
    await markContactAsRead(id);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    await deleteContact(id);
    load();
  };

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-1">Messages</h1>
      <p className="text-secondary mb-8">Submissions from your portfolio's contact form.</p>

      {loading ? (
        <Loader />
      ) : messages.length === 0 ? (
        <div className="card-surface rounded-2xl p-12 text-center text-secondary">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m, i) => (
            <Reveal key={m._id} delay={i * 0.04}>
              <div
                className={`card-surface rounded-2xl p-5 shadow-card ${
                  !m.isRead ? "ring-1 ring-rose/40" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{m.name}</h3>
                      {!m.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose shrink-0" />
                      )}
                    </div>
                    <a href={`mailto:${m.email}`} className="text-xs text-rose">
                      {m.email}
                    </a>
                    <p className="text-secondary text-sm mt-2 leading-relaxed">{m.message}</p>
                    <p className="text-xs text-muted mt-2">
                      {new Date(m.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!m.isRead && (
                      <button
                        onClick={() => handleRead(m._id)}
                        className="w-9 h-9 rounded-full pill-btn flex items-center justify-center hover:border-rose transition-colors"
                        title="Mark as read"
                      >
                        <MailOpen size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="w-9 h-9 rounded-full pill-btn flex items-center justify-center hover:border-rose hover:text-rose transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
