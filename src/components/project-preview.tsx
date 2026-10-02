import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/data/portfolio";

function ProductLogo({ project }: { project: Project }) {
  if (project.logo) {
    return <Image className={`preview-logo preview-logo--${project.id}`} src={project.logo} alt="" width={54} height={54} />;
  }
  return <span className="preview-monogram" aria-hidden="true">{project.name.slice(0, 1)}</span>;
}

export function ProjectPreview({ project }: { project: Project }) {
  const paired = project.kind === "web-and-ios";

  return (
    <div
      className={`project-preview glass-surface project-preview--${project.id}`}
      style={{ "--project-accent": project.accent } as CSSProperties}
      role="img"
      aria-label={`${project.name} ${paired ? "website and iOS app" : "website"} preview`}
    >
      <div className="website-window" aria-hidden="true">
        <div className="website-topbar">
          <ProductLogo project={project} />
          <span className="website-nav"><i /><i /><i /></span>
        </div>
        <div className="website-content">
          <div className="website-copy">
            <strong>{project.sitePreview[0]}</strong>
            <p>{project.sitePreview[1]}</p>
            <span className="preview-action" />
          </div>
          <div className="website-art"><i /><i /><i /></div>
        </div>
        <div className="website-footer"><i /><i /><i /></div>
      </div>
      {paired && project.appPreview ? (
        <div className="phone-device" aria-hidden="true">
          <div className="phone-screen">
            <span className="phone-camera" />
            <ProductLogo project={project} />
            <strong>{project.appPreview[0]}</strong>
            <span className="phone-highlight" />
            <span className="phone-list-item" />
            <span className="phone-list-item" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
