import { ProjectPreview } from "@/components/project-preview";
import type { Project } from "@/data/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card" id={`project-${project.id}`}>
      <a
        className="project-card-link"
        href={`/work/${project.id}/`}
        aria-labelledby={`project-title-${project.id}`}
      >
        <ProjectPreview project={project} />
        <div className="project-meta">
          <div className="project-heading-row">
            <h3 id={`project-title-${project.id}`}>{project.name}</h3>
            <span className={`status-pill status-pill--${project.status === "Live" ? "live" : "progress"}`}>
              <i />{project.status}
            </span>
          </div>
          <p className="project-summary">{project.summary}</p>
          <ul className="project-stack" aria-label={`${project.name} technologies`}>
            {project.stack.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <span className="project-detail-cta">View project <span aria-hidden="true">→</span></span>
        </div>
      </a>
    </article>
  );
}
