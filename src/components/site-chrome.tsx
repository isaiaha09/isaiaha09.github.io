import { portfolio } from "@/data/portfolio";

export function SiteHeader({ isHome = false, currentPage }: { isHome?: boolean; currentPage?: "estimate" }) {
  const homePrefix = isHome ? "" : "/";

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href={isHome ? "#top" : "/"} aria-label={`${portfolio.brandName} home`}>
          {portfolio.brandName}
        </a>
        <nav aria-label="Main navigation">
          <a href={`${homePrefix}#work`}>Work</a>
          <a href={`${homePrefix}#about`}>About</a>
          <a href={`${homePrefix}#resume`}>Resume</a>
          <a href={`${homePrefix}#contact`}>Contact</a>
          <a className="estimate-nav-link" href="/project-estimate/" aria-current={currentPage === "estimate" ? "page" : undefined}>Get an Estimate</a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ isHome = false }: { isHome?: boolean }) {
  return (
    <footer className="site-footer section-wrap">
      <a className="wordmark" href={isHome ? "#top" : "/"}>{portfolio.brandName}</a>
      <a className="back-top" href="#top">Back to top <span aria-hidden="true">↑</span></a>
      <small>© {new Date().getFullYear()} {portfolio.name}</small>
    </footer>
  );
}
