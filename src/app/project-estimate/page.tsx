import type { Metadata } from "next";
import { ProjectEstimateForm } from "@/components/project-estimate-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { portfolio } from "@/data/portfolio";
import "./project-estimate.css";

export const metadata: Metadata = {
  title: "Get a Project Estimate — IASAPPS",
  description: "Describe your website or iOS app, explore the features you need, and get a preliminary development range from Isaiah at IASAPPS.",
};

export default function ProjectEstimatePage() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader currentPage="estimate" />
      <main id="main" className="estimate-page section-wrap">
        <div className="estimate-intro" id="top">
          <a className="detail-back-link" href="/"><span aria-hidden="true">←</span> Back to portfolio</a>
          <h1>Let’s shape <span>your project.</span></h1>
          <p>Tell me what you have in mind. Explore the features you need, see a preliminary development range, and send your project details directly to me.</p>
        </div>
        <ProjectEstimateForm />
        <noscript>
          <p className="estimate-no-script">This calculator needs JavaScript. You can also describe your project by emailing <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a>.</p>
        </noscript>
      </main>
      <SiteFooter />
    </>
  );
}
