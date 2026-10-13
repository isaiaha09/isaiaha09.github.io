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

- Confirm your public email address.
- Confirm the GitHub and LinkedIn profile links, and add your Instagram, TikTok, YouTube, and Stack Overflow profile URLs. Unset profiles are omitted from the Contact section.
- Confirm project statuses.
- Update the project summaries and detail content as the work changes. Each Selected Work card opens its own page at `/work/<project-id>/`.
- Add each live website URL and App Store link when ready. Missing links are omitted.

The downloadable resume is stored at `public/Isaiah-Resume.pdf`.

The catalog covers the four website and iOS projects plus Developmental Baseball and JPTraining. Project pages are generated at build time from the typed local catalog. The header includes the four main section links and Get an Estimate; project pages are reached through Selected Work cards.

## GitHub Pages

The site is configured for the `isaiaha09.github.io` repository pattern and serves from the domain root without a `basePath`.

1. Create a GitHub repository named `isaiaha09.github.io` and push this project to its `main` branch.
2. In repository **Settings > Pages**, select **GitHub Actions** as the publishing source.
3. To enable the contact form on the deployed site, add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` as a repository variable. The workflow compiles this public key into the static client bundle.
4. Push to `main`. The workflow builds the `out/` folder and publishes it to Pages.

GitHub Pages is intended here for a personal, informational portfolio. Keep checkout, paid services, or SaaS functionality on a host designed to support it.

## Project estimate calculator

The dedicated **Get an Estimate** page is available at `/project-estimate/`. It uses the existing React components and static export, with pricing calculated in the visitor's browser. No backend or database is needed.

Edit `src/data/estimate-pricing.ts` to change USD development ranges, scope/design adjustments, feature descriptions, project compatibility, included features, and shared-cost components. Each priced choice uses `range(min, max)` with nonnegative integer USD endpoints; use `range(0)` for included items and `null` for work needing a custom quote. Update the pricing fixtures when changing either endpoint.

The editable business-website base includes basic CMS and its database. Web apps and combined projects include their basic database; backend projects include the basic database, admin system, and API. The base assumes a supplied completed design and the smallest stated scope. Large applications, unknown scope, automated workflows, and external API integrations require custom quotes.

A feature range includes any shared component named in `sharedCosts`. Login/profile setup ($600–$1,000) and Stripe setup ($1,200–$2,500) are charged once. Credits appear as labeled credit ranges in the itemized estimate; calculations subtract the minimum from the subtotal minimum and maximum from the subtotal maximum. These are matching components, not independent intervals. Keep each participating feature range large enough to contain its shared component. The combined web/iOS base already includes shared development. Displayed price ranges use “to” between endpoints so a wrapped range cannot read as subtraction.

The six-step questionnaire preserves compatible answers when project types change. Website size counts distinct page layouts; application size counts main app screens or connected backend modules. A page or screen describes structure, while the feature step prices added behavior. A Contact page layout can fit within the page count; its working inquiry form is a separate feature. Cards, review, and inquiries carry the same scope explanations and ranges. Unpriced work shows a priced-items range; urgency requests review without changing either endpoint or implying unpriced work. Hosting, maintenance, support, third-party fees, and usage costs are quoted separately. Budget, ongoing-service preference, and the optional development-payment preference never change the development range. Monthly development installments are payment arrangements for the agreed project fee, separate from monthly service charges.

Project requests reuse `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, the hidden honeypot, and provider spam filtering, with the subject **IASAPPS project estimate request from [name]**. The separate form sends contact information, requirements and scope notes, itemized ranges/credits, formatted subtotal, numeric minimum/maximum fields, USD currency, review flags, timing, budget, hosting/maintenance and payment preferences, and the project description. Confirmation appears only after Web3Forms confirms success. Errors preserve answers for manual retry. Requests time out after 20 seconds and are never retried automatically.

Drafts remain in page memory and are lost after refresh or navigation. The final step includes the preliminary-estimate disclaimer and required acknowledgment.

### Verification

Use Node.js 22. Run `npm.cmd test` for pricing and mocked delivery tests, `npx.cmd tsc --noEmit` for type checking, and `npm.cmd run build` for the static export. The build produces `out/project-estimate/index.html`.

Browser QA covers all six steps, project type changes, included CMS/admin/API scope, matching-endpoint credits, review edits, optional payment choices, validation, keyboard navigation, reduced motion, and desktop/mobile/320px layouts with long range values. The sticky mobile summary is measured so fields and headings remain below it when focused. Automated submissions mock Web3Forms and do not send email. Check actual inbox delivery manually with the configured service, confirming the distinct subject and complete project details.
