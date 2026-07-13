# HomeNex — Interactive Product Tour

A standalone, guided **product tour** for [HomeNex](https://homenex.aiknol.com/) — the AI-powered,
WhatsApp-native lead manager for Indian real estate brokers.

> **This is not the real app.** It's a self-contained demo site that recreates the HomeNex broker
> dashboard with pre-loaded **sample data** and step-by-step annotations, like an interactive
> product walkthrough. No backend, no login, nothing to install.

## What it shows

A phone mockup (full-screen on mobile) walks through five real screens, each with annotation
bubbles, highlighted focus areas, Next/Previous navigation, and a note on the AI capability behind it:

1. **Dashboard** — morning stats (waiting for reply, hot leads, follow-ups, site visits), the compact
   WhatsApp chip, the "all set up" state, and the prioritised "what to do next" worklist.
2. **Lead Pipeline** — a kanban board of six sample buyers across New → Qualified → Site Visit →
   Negotiation, each auto-captured and scored.
3. **Inbox** — a WhatsApp conversation with AI auto-replies (answered in ~22s), the *Auto-reply* vs
   *You replied* badges, and the buyer preferences the AI captured automatically.
4. **Lead Detail** — the "Before you call" AI briefing, the BLTC buyer profile, a 75/100 score
   breakdown, follow-ups and site-visit history.
5. **Properties** — six listings with Indian details (project names, localities, L/Cr pricing, RERA,
   BHK) and the leads each one auto-matches.

## Tech

- Pure static site — **HTML + CSS + vanilla ES modules**. No build step, no framework, no backend.
- All data is hardcoded in [`data.js`](./data.js).
- Design system mirrors the real HomeNex dashboard (Fraunces + Albert Sans, green/white `#166534`).
- Mobile-responsive: a device frame on desktop, full-screen with a bottom-sheet annotation on mobile.
- Keyboard arrows (← →) and the bottom nav also drive the tour.

## Run locally

It uses ES module imports, so it must be served over HTTP (not opened as a `file://`):

```bash
npx serve .          # or:  python3 -m http.server 8080
```

Then open the printed URL.

## Deploy (Cloudflare Pages)

No build needed. Point a Cloudflare Pages project at this repo:

- **Build command:** *(none)*
- **Build output directory:** `/` (repository root)

Every file is static and self-contained, so it also works on Netlify, GitHub Pages, Vercel, or any
static host.

## Links

- Real app: **https://homenex.aiknol.com/**
- Product / marketing site: `/product` *(placeholder — update in `app.js` when the site is live)*
