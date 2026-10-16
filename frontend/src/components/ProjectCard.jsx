import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { fileUrl } from "../api/axios.js";
import Reveal from "./Reveal.jsx";

export default function ProjectCard({ project, index }) {
  const year = project.createdAt ? new Date(project.createdAt).getFullYear() : "";

  // The card always shows the thumbnail (the other images are for the project page).
  // Falls back to the first project-page image only if no thumbnail was uploaded.
  const image = project.thumbnail || project.images?.[0] || "";

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <motion.div
        whileHover={{ scale: 1.08, zIndex: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full"
        style={{ zIndex: 0 }}
      >
        <Link
          to={`/projects/${project._id}`}
          className="group block h-full rounded-2xl card-surface shadow-card overflow-hidden"
        >
          <div className="relative aspect-[4/3] bg-rose-gradient overflow-hidden">
            {image && (
              <img
                src={fileUrl(image)}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted font-mono">{String(index + 1).padStart(2, "0")}</span>
              <span className="eyebrow">{project.field}</span>
            </div>
            <h3 className="font-display font-bold text-xl mt-2">{project.title}</h3>
            <p className="text-secondary text-sm mt-2 leading-relaxed line-clamp-2">
              {project.info}
            </p>
            <div className="flex items-center justify-between mt-5">
              <span className="text-xs text-muted">{year}</span>
              <span className="inline-flex items-center gap-1 text-rose text-sm font-medium">
                View project
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </Reveal>
  );
}