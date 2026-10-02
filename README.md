# IASAPPS Portfolio

A Next.js portfolio with a homepage and six project pages, exported as static files for GitHub Pages. The contact form submits from the visitor's browser to Web3Forms; the site has no backend or API route.

## Run the site locally

Open PowerShell in this folder (`C:\dev\Portfolio`) and run:

```powershell
npm.cmd install
npm.cmd run dev
```

Then open **http://localhost:3000** in your browser. Leave the PowerShell window running while you work. Press **Ctrl+C** in that window to stop the site.

To enable contact form submissions locally, copy `.env.example` to `.env.local` and add your Web3Forms access key as `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. Restart the dev server after changing the key. Without a key, the form displays an error when submitted and keeps the entered message.

To make the static Pages build locally, run `npm.cmd run build`. Next.js writes the exported site to `out/`.

## Finish the portfolio details

Edit `src/data/portfolio.ts`:

- Add your email address.
- Confirm the GitHub and LinkedIn profile links and project statuses.
- Update the project summaries and detail content as the work changes. Each Selected Work card opens its own page at `/work/<project-id>/`.
- Add each live website URL and App Store link when ready. Missing links are omitted.
- Put your PDF at `public/Isaiah-Resume.pdf`, then set `resumeHref` to `/Isaiah-Resume.pdf`.

The catalog covers the four website and iOS projects plus Developmental Baseball and JPTraining. Project pages are generated at build time from the typed local catalog. The header keeps the four main section links; project pages are reached through Selected Work cards.

## GitHub Pages

The site is configured for the `isaiaha09.github.io` repository pattern and serves from the domain root without a `basePath`.

1. Create a GitHub repository named `isaiaha09.github.io` and push this project to its `main` branch.
2. In repository **Settings > Pages**, select **GitHub Actions** as the publishing source.
3. To enable the contact form on the deployed site, add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` as a repository variable. The workflow compiles this public key into the static client bundle.
4. Push to `main`. The workflow builds the `out/` folder and publishes it to Pages.

GitHub Pages is intended here for a personal, informational portfolio. Keep checkout, paid services, or SaaS functionality on a host designed to support it.
