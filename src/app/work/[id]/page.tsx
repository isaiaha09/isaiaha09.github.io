import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPreview } from "@/components/project-preview";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { projects } from "@/data/portfolio";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);

  return {
    title: project ? `${project.name} — IASAPPS` : "Project not found — IASAPPS",
    description: project?.summary,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);

  if (!project) notFound();

  const paired = project.kind === "web-and-ios";

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="detail-hero section-wrap" id="top" aria-labelledby="project-title">
          <a className="detail-back-link" href="/#work"><span aria-hidden="true">←</span> Back to selected work</a>
          <div className="detail-hero-grid" style={{ "--project-accent": project.accent } as CSSProperties}>
            <div className="detail-hero-copy">
              <div className="detail-context">
                <span className={`status-pill status-pill--${project.status === "Live" ? "live" : "progress"}`}>
                  <i />{project.status}
                </span>
                <span>{paired ? "Website and iOS app" : "Standalone website"}</span>
              </div>
              <h1 id="project-title">{project.name}</h1>
              <p>{project.summary}</p>
              {project.siteUrl || project.appUrl ? (
                <div className="detail-actions">
                  {project.siteUrl ? (
                    <a className="button button-primary" href={project.siteUrl} target="_blank" rel="noreferrer">
                      Visit website <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  {project.appUrl ? (
                    <a className="button button-quiet" href={project.appUrl} target="_blank" rel="noreferrer">
                      View iOS app <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="detail-visual"><ProjectPreview project={project} variant="detail" /></div>
          </div>
        </section>

        <div className="detail-content section-wrap">
          <section className="detail-overview" aria-labelledby="overview-title">
            <div>
              <h2 id="overview-title">Overview</h2>
              <p>{project.detail.overview}</p>
            </div>
            <aside className="detail-stack glass-surface" aria-labelledby="stack-title">
              <h2 id="stack-title">Built with</h2>
              <ul className="project-stack" aria-label={`${project.name} technologies`}>
                {project.stack.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </aside>
          </section>

          <section className="detail-section" aria-labelledby="surfaces-title">
            <h2 id="surfaces-title">{paired ? "Across web and iOS" : "Website experience"}</h2>
            <div className={`detail-surface-grid${paired ? "" : " detail-surface-grid--single"}`}>
              {project.detail.surfaces.map((surface) => (
                <article className="detail-surface glass-surface" key={surface.title}>
                  <h3>{surface.title}</h3>
                  <p>{surface.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="detail-section" aria-labelledby="highlights-title">
            <h2 id="highlights-title">Highlights</h2>
            <div className="detail-highlight-grid">
              {project.detail.highlights.map((highlight) => (
                <article className="detail-highlight glass-surface" key={highlight.title}>
                  <h3>{highlight.title}</h3>
                  <p>{highlight.description}</p>
                </article>
              ))}
            </div>
          </section>

          <a className="detail-back-link detail-back-link--bottom" href="/#work">
            <span aria-hidden="true">←</span> Back to selected work
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
