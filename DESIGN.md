---
version: alpha
name: "IASAPPS Portfolio"
description: "A portfolio with selected work, dedicated project pages, and direct contact for Isaiah's web and iOS work."
colors:
  background: "#0b0d10"
  surface: "#13171d"
  raised: "#191e25"
  glass-surface: "rgba(12, 21, 36, .52)"
  glass-border: "rgba(148, 192, 246, .42)"
  border: "#2a3039"
  text: "#f5f6f8"
  body: "#d0d4da"
  muted: "#a0a7b1"
  primary: "#1675ff"
  accent: "#4190ff"
typography:
  sans:
    fontFamily: "Arial, Helvetica, sans-serif"
rounded:
  DEFAULT: "7px"
  sm: "6px"
  md: "12px"
  lg: "14px"
spacing:
  page-gutter: "2rem"
  hero-column-gap: "24px"
  about-column-gap: "48px"
  contact-column-gap: "48px"
  hero-max-width: "1000px"
  about-max-width: "930px"
components:
  button:
    min-height: "50px"
    radius: "7px"
  card:
    radius: "13px"
    border: "1px solid rgba(148, 192, 246, .42)"
  focus-panel:
    radius: "12px"
    border: "1px solid rgba(148, 192, 246, .42)"
---

# IASAPPS Portfolio Design System

## Overview

### Creative North Star

Treat the page like a compact independent software studio portfolio: the creator's blue and white IASAPPS mark anchors a dark canvas, while short copy and realistic project previews let the work carry the detail. A restrained blue particle horizon supports the mark as the site's visual signature. Keep surrounding surfaces quiet and useful.

### Product context and register

- **Audience and primary job:** Hiring teams, collaborators, and potential clients scan Isaiah's work, understand his focus, and find a direct way to contact him.
- **Target market(s) and evidence:** English-speaking portfolio visitors; the site copy and portfolio content are in English. No country-specific workflow is offered.
- **Locale(s) and language policy:** English (`en`) only.
- **Usage scene:** A public, read-first portfolio used on desktop and mobile, often during a short review.
- **Register:** Brand and informational content site.
- **Memorable signature:** The IASAPPS logo beside a direct statement of the work.
- **Restraint:** Keep navigation, project metadata, and contact actions obvious. Use blue for action, emphasis, and the approved particle atmosphere; omit ornamental code references, background rules, and fine-print decoration.
- **Anti-references:** Terminal or editor motifs, invented technical labels, dense tiny text, and decorative background grids; they distract from the actual software work and were rejected by the site owner.
- **Token ownership/runtime mapping:** `src/app/globals.css` is the runtime source of truth. This file documents its accepted values. CSS custom properties in `:root` flow directly into site sections and controls; responsive overrides live beside their media queries. No generated token export is used.

## Colors

The dark canvas (`background`) holds the page, `surface` marks grouped content, and `raised` is reserved for a surface that needs another level. `border` separates cards without adding visual noise. `text`, `body`, and `muted` form the reading hierarchy. `primary` is the main action blue and `accent` highlights selected words, focus, and small marks. Scrollbars use the global thumb and track tokens in `globals.css`; forced-colors mode returns them to system colors.

## Typography

Use the established Arial, Helvetica, sans-serif stack throughout. Strong, tightly spaced headings set hierarchy; body copy stays at a comfortable reading size with generous line height. Keep technical details and status labels at normal readable sizes rather than using a decorative monospace face or tiny annotation text. The document language is English.

## Layout

The project gallery and Contact section use nearly the full viewport width with a 32px desktop gutter, 20px medium-width gutter, and 16px mobile gutter. The hero is a centered group no wider than 1000px, with the statement and logo separated by at most 24px. About aligns its heading, story, and content-sized focus card inside a centered 930px group. The resume card fits its content and is centered. Contact uses its original full-width layout with a 38/62 column split; its heading and intro are left aligned at the section gutter. The hero and About widths are implemented by `--hero-content` and `--about-content` in `src/app/globals.css`; the column gaps above are their desktop upper bounds. Vertical section spacing remains in place. At narrow widths, columns stack and cards stay within the viewport. Standalone website previews get a little more vertical room on mobile so their real brand marks and labels stay legible. Detail pages center a project-specific preview beside the project summary, then place overview, platforms, and highlights in readable sections below.

## Elevation & Depth

Use translucent charcoal with a blue-gray glass edge on the focus panel, resume card, contact form, detail panels, and the outer project previews. Layer accent color, a narrow specular highlight, and inset edge reflections so the panels read as curved glass over the particle field. Each project frame keeps its own accent color. When the pointer approaches either color field, that field moves in the opposite direction in two dimensions and returns when the pointer leaves. The website and phone previews rise slightly while their frame is hovered or keyboard focused. Keep the simulated website and iOS screens and form fields opaque for readability. The surface opacity lets more of the particle field show through; CSS backdrop blur has a solid-color fallback. The site owner's approved black and blue particle field spans the viewport behind all routes, with a low blue horizon that fades gradually into the dark canvas, short outward-moving streaks, and faint reflections. Pre-rendered wide and mobile frames in `public/particle-poster-*.webp` appear before the canvas starts, then fade into the moving field; stretch the poster to the viewport so its horizon stays aligned with the canvas, and regenerate both frames when the particle drawing changes. Darken the reading area so body copy remains clear. The sticky header and footer have no background color or filter by default, letting the particle field show through. Hovering or keyboard focusing them adds a dark translucent surface.

## Shapes

Actions use the compact 7px default radius. Content panels use 12–13px radii, while project previews may use 14px. Borders remain thin and subdued. Focus rings use a high-contrast blue outline with offset; never remove them.

## Components

### Foundational visual states

Links and buttons have a visible hover treatment, a global keyboard focus outline, and a clear pressed state. Unavailable contact details do not react to hover. Disabled form actions retain their dimensions and use the existing disabled treatment. Contact feedback is shown inline so it remains close to the form.

### Buttons and actions

Use a solid blue button for the primary action and a dark outlined button for the secondary action. Buttons are at least 50px high on desktop and remain large enough to activate on touch devices. Keep icon placement consistent and preserve the button's size while sending a form.

### Navigation and data display

The sticky top navigation keeps Work, About, Resume, and Contact on every route. Each Selected Work card opens one project page; the header does not list individual projects. A return link on the project page leads back to Selected Work. Paired projects show their website and iOS app together on one page. Live destination links sit on the project page, while unavailable links are omitted. Status and technology remain textual and readable at narrow widths.

### Forms and overlays

Contact fields have visible labels, a dark field surface, and inline success or error feedback. Preserve entered values on a failed send. There are no dialogs, drawers, or toast overlays in this portfolio.

### Iconography

Use small inline SVG marks for arrows and contact links. Icons support text labels and are hidden from assistive technology when decorative.

### Motion

Use brief transitions for hover feedback. The approved particle field is the only ambient animation; it pauses while the tab is hidden and becomes a still image under `prefers-reduced-motion: reduce`. Disable smooth scrolling and nonessential transitions for that preference too.

### Content and data visualization

Use plain first-person copy and familiar labels. Project previews explain the shape of the product; status and stack text provide concrete supporting detail. No chart system is needed.

## Do's and Don'ts

- **Do:** Keep the logo, hero statement, and next action visually connected.
- **Do:** Keep social links and resume access easy to scan, with their real destination URLs.
- **Don't:** Reintroduce faint code labels, background lines, or terminal decoration.
- **Don't:** use reduced text sizes as decoration or let generous viewport space push related sections apart.
