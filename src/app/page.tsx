import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { ProjectCard } from "@/components/project-card";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { portfolio, profile, projects } from "@/data/portfolio";

type SocialType = "email" | "github" | "linkedin" | "instagram" | "tiktok" | "youtube" | "stack-overflow";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3.5 10h12m-5-5 5 5-5 5" />
    </svg>
  );
}

function SocialMark({ type }: { type: SocialType }) {
  if (type === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.01-.68.08-.67.08-.67 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.47-.28-5.07-1.24-5.07-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.29-2.6 5.24-5.08 5.51.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
      </svg>
    );
  }
  if (type === "linkedin") {
    return <span className="linkedin-mark" aria-hidden="true">in</span>;
  }
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M14 3v11.2a4.5 4.5 0 1 1-4.5-4.5" />
        <path d="M14 3c.7 2.7 2.5 4.2 5.5 4.5" />
      </svg>
    );
  }
  if (type === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "stack-overflow") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M5 16v4h14v-4M8 17h8.5M8.5 14l8.2 1.5M9.7 11l7.5 3M12 7.5l6 4.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function ContactLink({
  label,
  href,
  type,
  detail,
}: {
  label: string;
  href?: string;
  type: SocialType;
  detail?: string;
}) {
  return (
    href ? (
      <a className="social-link" href={href} target={type === "email" ? undefined : "_blank"} rel={type === "email" ? undefined : "noreferrer"}>
        <span className="social-icon"><SocialMark type={type} /></span>
        <span>{label}</span>
        <span className="social-arrow"><ArrowIcon /></span>
      </a>
    ) : (
      <div className="social-link social-link--missing" aria-disabled="true">
        <span className="social-icon"><SocialMark type={type} /></span>
        <span>{label}</span>
        <span className="contact-link-pending">{detail}</span>
      </div>
    )
  );
}

export default function HomePage() {
  const productProjects = projects.filter((project) => project.kind === "web-and-ios");
  const standaloneProjects = projects.filter((project) => project.kind === "standalone-web");
  const websiteCount = projects.length;
  const contactLinks = [
    { label: "Email", href: portfolio.email ? `mailto:${portfolio.email}` : undefined, detail: portfolio.email ? undefined : "Address needed", type: "email" as const },
    ...(portfolio.github ? [{ label: "GitHub", href: portfolio.github, type: "github" as const }] : []),
    { label: "LinkedIn", href: portfolio.linkedin || undefined, detail: portfolio.linkedin ? undefined : "Profile needed", type: "linkedin" as const },
    ...(portfolio.instagram ? [{ label: "Instagram", href: portfolio.instagram, type: "instagram" as const }] : []),
    ...(portfolio.tiktok ? [{ label: "TikTok", href: portfolio.tiktok, type: "tiktok" as const }] : []),
    ...(portfolio.youtube ? [{ label: "YouTube", href: portfolio.youtube, type: "youtube" as const }] : []),
    ...(portfolio.stackOverflow ? [{ label: "Stack Overflow", href: portfolio.stackOverflow, type: "stack-overflow" as const }] : []),
  ];
  const resumeHref = portfolio.resumeHref;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader isHome />

      <main id="main">
        <section className="hero section-wrap" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">I build useful<br /><span>digital apps</span></h1>
            <p className="hero-intro">Websites and iOS apps shaped around real problems, from the first screen to the details that make them work.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Explore my work <ArrowIcon /></a>
              {resumeHref ? (
                <a className="button button-quiet" href={resumeHref} download={portfolio.resumeFileName}>Download resume</a>
              ) : (
                <a className="button button-quiet" href="#resume">View resume</a>
              )}
            </div>
            <p className="hero-meta"><strong>{websiteCount}</strong> websites <span aria-hidden="true">·</span> <strong>{productProjects.length}</strong> iOS apps</p>
          </div>
          <div className="hero-brand" aria-label={`${portfolio.brandName} brand logo`}>
            <Image src="/brand/iasapps-logo.png" alt={`${portfolio.brandName} logo`} width={1280} height={1280} priority />
          </div>
        </section>

        <section className="work-section section-wrap" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <h2 id="work-title">Selected work</h2>
              <p className="section-intro">Four web and iOS products, plus two standalone websites.</p>
            </div>
          </div>
          <h3 className="work-subheading">Websites and iOS apps</h3>
          <div className="project-grid">
            {productProjects.map((project) => <ProjectCard project={project} key={project.id} />)}
          </div>
          <h3 className="work-subheading standalone-heading">Standalone websites</h3>
          <div className="project-grid project-grid--standalone">
            {standaloneProjects.map((project) => <ProjectCard project={project} key={project.id} />)}
          </div>
        </section>

        <section className="about-section section-wrap" id="about" aria-labelledby="about-title">
          <div className="section-heading about-heading">
            <div>
              <h2 id="about-title">Make it clear.<br /><span>Make it useful.</span></h2>
            </div>
          </div>
          <div className="about-layout">
            <div className="about-story">
              <p className="about-lead">{profile.about}</p>
              <p>{profile.approach}</p>
              <div className="about-signature"><strong>{portfolio.name}</strong></div>
            </div>
            <div className="focus-panel glass-surface">
              <h3>What I work on</h3>
              <ul>{profile.focus.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="resume-section section-wrap" id="resume" aria-labelledby="resume-title">
          <div className="resume-card glass-surface">
            <div className="resume-copy">
              <h2 id="resume-title">Experience and background</h2>
              <p>{resumeHref ? "Download my resume for a closer look at my background and experience." : "My resume will be available here soon."}</p>
            </div>
            {resumeHref ? (
              <a className="button button-primary resume-button" href={resumeHref} download={portfolio.resumeFileName}>Download resume<ArrowIcon /></a>
            ) : (
              <span className="resume-pending">Resume coming soon</span>
            )}
          </div>
        </section>

        <section className="contact-section section-wrap" id="contact" aria-labelledby="contact-title">
          <div className="section-heading contact-heading">
            <div>
              <h2 id="contact-title">Let’s make<br /><span>something useful.</span></h2>
              <p className="section-intro">Tell me a little about what you’re working on. I’d be glad to hear from you.</p>
            </div>
          </div>
          <div className="contact-layout">
            <div className="contact-details">
              <h3>Get in touch</h3>
              <p>Reach out directly or find me on other platforms.</p>
              <div className="social-list">
                {contactLinks.map((link) => <ContactLink key={link.type} {...link} />)}
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter isHome />
    </>
  );
}
