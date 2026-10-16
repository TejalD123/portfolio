import SectionHeading from "./SectionHeading.jsx";
import ProjectCard from "./ProjectCard.jsx";
import Loader from "./Loader.jsx";

export default function Projects({ projects, loading }) {
  // 4 or fewer: normal grid, wraps only if the window is narrow.
  // More than 4: keep everything on one row and scroll sideways instead of
  // wrapping to a second row. Scrollbar is hidden (same pattern as Tech Stack).
  const scrollMode = projects.length > 4;

  return (
    <section id="work" className="container-page section-y">
      <SectionHeading label="Projects" hint={scrollMode ? "Scroll for more →" : undefined} />

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <div className="card-surface rounded-2xl p-12 text-center text-secondary">
          Projects will appear here once added from the admin panel.
        </div>
      ) : scrollMode ? (
        <div className="flex gap-6 overflow-x-auto overflow-y-hidden hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0 py-5 -my-5 snap-x snap-mandatory">
          {projects.map((p, i) => (
            <div
              key={p._id}
              className="shrink-0 w-[82%] sm:w-[46%] lg:w-[calc(25%-1.125rem)] snap-start"
            >
              <ProjectCard project={p} index={i} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p._id} project={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}