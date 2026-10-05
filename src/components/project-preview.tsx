import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/data/portfolio";
import { ProjectDemoVideo } from "@/components/project-demo-video";

function ProductLogo({ project }: { project: Project }) {
  if (project.logo) {
    return <Image className={`preview-logo preview-logo--${project.id}`} src={project.logo} alt="" width={54} height={54} />;
  }
  return <span className="preview-monogram" aria-hidden="true">{project.name.slice(0, 1)}</span>;
}

export function ProjectPreview({
  project,
  variant = "card",
}: {
  project: Project;
  variant?: "card" | "detail";
}) {
  const paired = project.kind === "web-and-ios";
  const detailVideo = variant === "detail" && Boolean(project.siteVideo);

  return (
    <div
      className={`project-preview glass-surface project-preview--${project.id}`}
      style={{ "--project-accent": project.accent } as CSSProperties}
      role={variant === "card" ? "img" : "group"}
      aria-label={`${project.name} ${paired ? "website and iOS app" : "website"} preview`}
    >
      <div
        className={"website-window" + (detailVideo ? " website-window--detail-video" : "")}
        aria-hidden={variant === "card" || undefined}
      >
        {detailVideo ? (
          <ProjectDemoVideo
            src={project.siteVideo!}
            poster={project.sitePoster}
            className="website-detail-video"
            label={project.name + " website screen recording"}
            controls
          />
        ) : (
          <>
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
              <div className={"website-art" + (project.siteVideo ? " website-art--video" : "")}>
                {project.siteVideo ? (
                  <ProjectDemoVideo
                    src={project.siteVideo}
                    poster={project.sitePoster}
                    className="website-art-video"
                    label={project.name + " website screen recording"}
                    ariaHidden
                  />
                ) : null}
                <i /><i /><i />
              </div>
            </div>
            <div className="website-footer"><i /><i /><i /></div>
          </>
        )}
      </div>
      {paired && (project.appPreview || project.appVideo) ? (
        <div
          className="phone-device"
          aria-hidden={variant === "card" || !project.appVideo || undefined}
        >
          <div className={"phone-screen" + (project.appVideo ? " phone-screen--video" : "")}>
            {project.appVideo ? (
              <>
                <ProjectDemoVideo
                  src={project.appVideo}
                  poster={project.appPoster}
                  className="phone-demo-video"
                  label={project.name + " iOS app screen recording"}
                  controls={variant === "detail"}
                />
                <span className="phone-camera" />
              </>
            ) : (
              <>
                <span className="phone-camera" />
                <ProductLogo project={project} />
                <strong>{project.appPreview?.[0]}</strong>
                <span className="phone-highlight" />
                <span className="phone-list-item" />
                <span className="phone-list-item" />
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
