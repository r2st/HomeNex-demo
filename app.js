// ===========================================================================
// HomeNex Interactive Demo — tour engine + screen rendering
// Standalone, no backend. All data from data.js.
// ===========================================================================
import {
  AGENT, STATS, WORKLIST, ACTIVITY, LEADS, PIPELINE_STAGES,
  CONVERSATION, LEAD_DETAIL, PROPERTIES,
} from './data.js'

const REAL_APP_URL = 'https://homenex.aiknol.com/'
const PRODUCT_SITE_URL = 'https://homenex-site.pages.dev' // live marketing site

// --- tiny html helper -------------------------------------------------------
const h = (strings, ...vals) => strings.map((s, i) => s + (vals[i] ?? '')).join('')
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
const el = (id) => document.getElementById(id)

const tempEmoji = (t) => (t === 'Hot' ? '🔥' : t === 'Warm' ? '☀️' : '❄️')

// ---------------------------------------------------------------------------
// SCREEN RENDERERS
// ---------------------------------------------------------------------------

function screenDashboard() {
  const kpis = [
    { lbl: 'Waiting for reply', v: STATS.waiting, accent: true },
    { lbl: 'Hot leads', v: STATS.hot, accent: true },
    { lbl: "Today's follow-ups", v: STATS.followups, accent: false },
    { lbl: "Today's site visits", v: STATS.visits, accent: false },
  ]
  const dateStr = 'Sunday, 13 July'
  return h`
  <div class="panel" data-screen="dashboard">
    <div class="px" style="padding-top:26px">
      <div class="flex between items-center">
        <span class="eyebrow">${dateStr}</span>
        <span class="fs11 b faint" style="text-decoration:underline;text-underline-offset:2px">Sign out</span>
      </div>
      <h1 class="h1 big mt4">Good morning, ${esc(AGENT.name.split(' ')[0])}</h1>
      <p class="fs13 muted mt6" style="line-height:1.35">
        <b style="color:var(--brand-deep)">${STATS.newToday}</b> new leads today ·
        <b style="color:var(--brand-deep)">${STATS.active24h}</b> active conversations
      </p>

      <div class="mt16" data-tour="wa-chip" style="display:inline-flex">
        <span class="wa-chip">
          <span class="live-dot"></span>
          <svg class="wa-ico" viewBox="0 0 24 24"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Z"/></svg>
          WhatsApp connected · ${esc(AGENT.wa_phone)}
        </span>
      </div>

      <div class="onb-done mt14" data-tour="onboarding">
        <span class="tick">✓</span>
        <div class="g1">
          <p class="fs13 b" style="color:var(--ink)">You're all set up</p>
          <p class="fs12 muted">WhatsApp number connected · 6 properties added · AI replies live</p>
        </div>
      </div>

      <div class="kpis mt20" data-tour="kpis">
        ${kpis.map((k) => h`
          <div class="kpi ${k.accent ? 'accent' : ''}">
            <p class="num">${k.v}</p>
            <p class="lbl">${k.lbl}</p>
          </div>`).join('')}
      </div>

      <div class="mt28" data-tour="worklist">
        <div class="flex items-center gap8">
          <span class="section-head">YOUR DAY — WHAT TO DO NEXT</span>
          <span class="count-pill">${WORKLIST.length}</span>
        </div>
        <div class="mt12" style="display:flex;flex-direction:column;gap:10px">
          ${WORKLIST.map((w) => h`
            <div class="card">
              <div class="work-item">
                <span class="pri ${w.priority}">${w.label}</span>
                <div class="g1" style="min-width:0">
                  <p class="b fs13" style="color:var(--ink)">${esc(w.title)}</p>
                  <p class="fs12 muted mt4" style="line-height:1.35">${esc(w.reason)}</p>
                </div>
                <span class="arrow">→</span>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <div class="mt28" data-tour="activity">
        <div class="flex items-center gap8">
          <span style="position:relative;display:inline-flex;width:8px;height:8px">
            <span style="position:absolute;inset:0;border-radius:999px;background:var(--hot);opacity:.6;animation:focuspulse 1.6s infinite"></span>
            <span style="position:relative;width:8px;height:8px;border-radius:999px;background:var(--hot)"></span>
          </span>
          <span class="fs11 b8" style="letter-spacing:.18em;color:var(--ink)">LIVE <span class="faint" style="font-weight:600">Activity</span></span>
        </div>
        <div class="card mt12 divide">
          ${ACTIVITY.map((a) => h`
            <div class="row" style="padding:11px 16px;align-items:flex-start">
              <span style="flex:0 0 auto;width:6px;height:6px;border-radius:999px;margin-top:6px;background:${a.kind === 'ai' ? 'var(--brand)' : a.kind === 'hot' ? 'var(--hot)' : a.kind === 'agent' ? 'var(--amber)' : 'var(--ink-faint)'}"></span>
              <p class="fs12 g1" style="line-height:1.35;color:var(--ink)">${esc(a.text)}</p>
              <span class="fs11 faint tabnum" style="flex:0 0 auto">${esc(a.ago)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`
}

function leadCard(l) {
  const initials = l.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return h`
    <div class="lead-card">
      <div class="top">
        <span class="avatar sm">${initials}</span>
        <div class="g1" style="min-width:0">
          <p class="nm truncate">${esc(l.name)}</p>
          <p class="sub truncate">${esc(l.bhk)} · ${esc(l.budget)} · ${esc(l.locality)}</p>
        </div>
      </div>
      <div class="meta">
        <span class="temp ${l.temp}">${tempEmoji(l.temp)} ${l.score}</span>
        <span class="fs11 faint">${esc(l.ago)}</span>
      </div>
    </div>`
}

function screenLeads() {
  const byStage = (st) => LEADS.filter((l) => l.stage === st)
  const pipelines = [
    { id: 'buy', label: 'Buy (Primary)', n: LEADS.filter((l) => l.pipeline === 'Buy (Primary)').length },
    { id: 'resale', label: 'Buy (Resale)', n: 0 },
    { id: 'rental', label: 'Rental', n: LEADS.filter((l) => l.pipeline === 'Rental').length },
  ]
  return h`
  <div class="panel" data-screen="leads">
    <div class="px" style="padding-top:26px">
      <h1 class="h1">Leads</h1>
      <p class="fs13 muted mt4">5 open in this pipeline · qualified by HomeNex AI</p>
    </div>
    <div class="chips mt16 px" data-tour="pipelines">
      ${pipelines.map((p, i) => h`
        <span class="chip ${i === 0 ? 'active' : ''}">${p.label}${p.n ? h`<span class="c-badge">${p.n}</span>` : ''}</span>`).join('')}
    </div>
    <div class="board mt16" data-tour="board">
      ${PIPELINE_STAGES.map((st) => {
        const col = byStage(st)
        return h`
        <div class="col" ${st === 'New' ? 'data-tour="col-new"' : ''}>
          <div class="col-head">
            <span class="st">${esc(st)}</span>
            <span class="cnt">${col.length}</span>
          </div>
          ${col.map(leadCard).join('') || h`<div style="border:1px dashed var(--line);border-radius:16px;min-height:64px;display:grid;place-items:center;text-align:center;padding:10px"><span class="fs11 faint">Nothing here yet</span></div>`}
        </div>`
      }).join('')}
    </div>
  </div>`
}

function screenInbox() {
  const c = CONVERSATION
  const initials = c.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return h`
  <div class="panel" data-screen="inbox">
    <div class="chat-header">
      <span class="avatar sm">${initials}</span>
      <div class="g1" style="min-width:0">
        <p class="b fs13" style="color:var(--ink)">${esc(c.name)}</p>
        <p class="fs11 faint">${esc(c.wa)} · via WhatsApp</p>
      </div>
      <span class="temp Warm">☀️ 75</span>
    </div>

    <div class="chat-texture" data-tour="chat">
      ${c.messages.map((m, i) => {
        if (m.role === 'buyer') {
          return h`
          <div class="msg-wrap">
            <div class="msg buyer">${esc(m.text)}<div class="t">${esc(m.time)}</div></div>
          </div>`
        }
        const isAI = m.role === 'ai'
        const badgeCls = isAI ? 'ai' : 'you'
        const badgeTxt = m.mode
        return h`
        <div class="msg-wrap out" ${i === 1 ? 'data-tour="first-ai"' : ''}>
          <span class="mode-badge ${badgeCls}">${isAI ? '⚡ ' : ''}${esc(badgeTxt)}</span>
          <div class="msg out">${esc(m.text)}<div class="t">${esc(m.time)}</div></div>
          ${m.meta ? h`<span class="meta-ai">✓ ${esc(m.meta)}</span>` : ''}
        </div>`
      }).join('')}
    </div>

    <div class="px" style="padding-top:16px;padding-bottom:20px" data-tour="captured">
      <div class="flex items-center between">
        <span class="section-head" style="color:var(--brand-deep)">✨ AI CAPTURED PREFERENCES</span>
        <span class="mode-badge ai">Auto</span>
      </div>
      <div class="card mt12" style="padding:14px 16px">
        <dl class="captured">
          ${c.captured.map((p) => h`<dt>${esc(p.k)}</dt><dd>${esc(p.v)}</dd>`).join('')}
        </dl>
        <p class="fs11 muted mt12" style="line-height:1.4">Extracted automatically from the chat — no form-filling. Feeds the lead score & property matching.</p>
      </div>
    </div>
  </div>`
}

function scoreRing(score) {
  const size = 48, r = (size - 6) / 2, c = 2 * Math.PI * r
  const color = score >= 80 ? 'var(--hot)' : score >= 55 ? 'var(--brand)' : 'var(--ink-faint)'
  return h`
    <div class="score-ring">
      <svg width="${size}" height="${size}" style="transform:rotate(-90deg)">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="4"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="4"
          stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - score / 100)}"/>
      </svg>
      <span class="val" style="color:${color}">${score}</span>
    </div>`
}

function screenDetail() {
  const d = LEAD_DETAIL
  return h`
  <div class="panel" data-screen="detail">
    <div class="detail-head">
      <span class="avatar sm">←</span>
      <div class="g1" style="min-width:0">
        <p class="font-display b fs13" style="font-size:17px;color:var(--ink)">${esc(d.name)}</p>
        <p class="fs11 faint truncate">${esc(d.pipeline)} · ${esc(d.wa)} · ${esc(d.updated)}</p>
      </div>
      ${scoreRing(d.score)}
    </div>

    <div class="px" style="padding-top:18px;display:flex;flex-direction:column;gap:16px">

      <div class="card" style="padding:16px" data-tour="briefing">
        <div class="flex items-center between">
          <span class="section-head" style="color:var(--ink-soft)">📞 BEFORE YOU CALL</span>
          <span class="temp Warm">${d.briefing.temperature} ${d.score}</span>
        </div>
        ${d.briefing.points.map((p) => h`<div class="briefing-pt ${p.tone}">${esc(p.text)}</div>`).join('')}
        <p class="fs12 muted mt12"><b style="color:var(--ink)">Still to learn:</b> ${d.briefing.missing.map(esc).join(' · ')}</p>
      </div>

      <div style="background:var(--brand-wash);border:1px solid rgba(22,101,52,.2);border-radius:18px;padding:16px" data-tour="capture">
        <div class="flex items-center between" style="margin-bottom:8px">
          <span class="section-head" style="color:var(--brand-deep)">✨ AI CAPTURE</span>
          <span class="temp Warm" style="text-transform:uppercase">${d.ai_score}</span>
        </div>
        <dl class="captured">
          ${d.capture.map((p) => h`<dt style="width:78px">${esc(p.k)}</dt><dd>${esc(p.v)}${p.note ? h` <span class="muted">— ${esc(p.note)}</span>` : ''}</dd>`).join('')}
        </dl>
        <p class="fs12 muted mt12"><b style="color:var(--ink)">Why ${esc(d.ai_score)}:</b> ${esc(d.ai_score_reason)}</p>
        <p class="fs12 muted mt6"><b style="color:var(--ink)">Next step:</b> ${esc(d.next_step)}</p>
      </div>

      <div class="card" style="padding:16px" data-tour="breakdown">
        <p class="section-head" style="color:var(--ink-soft);margin-bottom:12px">SCORE BREAKDOWN · ${d.score}/100</p>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${d.breakdown.map((s) => h`
            <div>
              <div class="flex between fs12" style="margin-bottom:5px">
                <span class="b" style="color:var(--ink)">${esc(s.label)}</span>
                <span class="b tabnum muted">${s.value}</span>
              </div>
              <div class="bar"><span class="${s.value >= 80 ? 'high' : ''}" style="width:${s.value}%"></span></div>
            </div>`).join('')}
        </div>
      </div>

      <div class="card" data-tour="followups">
        <p class="section-head" style="color:var(--ink-soft);padding:16px 16px 4px">FOLLOW-UPS</p>
        <div class="divide">
          ${d.followups.map((f) => h`
            <div class="row" style="padding:11px 16px">
              <span class="check ${f.done ? 'done' : ''}">✓</span>
              <div class="g1" style="min-width:0">
                <p class="fs13 b truncate" style="color:${f.done ? 'var(--ink-faint)' : 'var(--ink)'};${f.done ? 'text-decoration:line-through' : ''}">${esc(f.note)}</p>
              </div>
              <span class="fs11 faint tabnum" style="flex:0 0 auto">${esc(f.due)}</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="card" data-tour="visits" style="margin-bottom:8px">
        <p class="section-head" style="color:var(--ink-soft);padding:16px 16px 4px">SITE VISITS</p>
        <div class="divide">
          ${d.visits.map((v) => h`
            <div class="row" style="padding:12px 16px">
              <span style="font-size:18px">🏗️</span>
              <div class="g1" style="min-width:0">
                <p class="fs13 b truncate" style="color:var(--ink)">${esc(v.property)}</p>
                <p class="fs12 muted">${esc(v.when)} · ${esc(v.status)}${v.pickup ? ' · 🚗 pickup' : ''}</p>
              </div>
            </div>`).join('')}
        </div>
      </div>

    </div>
  </div>`
}

function screenProperties() {
  const bands = ['Any price', '< ₹50L', '₹50L–1Cr', '₹1–2.5Cr', '> ₹2.5Cr']
  const statusLabel = (s) => (s === 'ready' ? '✅ Ready to move' : '🏗️ Under construction')
  return h`
  <div class="panel" data-screen="properties">
    <div class="px" style="padding-top:26px">
      <h1 class="h1">Properties</h1>
      <p class="fs13 muted mt4">6 listings · auto-matched to every lead's budget & locality</p>
    </div>
    <div class="chips mt16 px" data-tour="prop-filters">
      ${bands.map((b, i) => h`<span class="chip ${i === 0 ? 'active' : ''}">${b}</span>`).join('')}
    </div>
    <div class="mt16" data-tour="prop-list">
      <div class="card" style="margin:0 20px" >
        <div class="divide">
          ${PROPERTIES.map((p) => h`
            <div class="prop">
              <span class="thumb">${p.status === 'ready' ? '🏢' : '🏗️'}</span>
              <div class="g1" style="min-width:0">
                <p class="p-title truncate">${esc(p.title)}</p>
                <p class="p-sub truncate">${esc(p.bhk)} · ${esc(p.type)} · ${esc(p.locality)} · ${esc(p.area)}</p>
                <p class="p-status">${statusLabel(p.status)}${p.rera ? ' · RERA ✓' : ''}${p.match ? h` · <span class="match-pill">✨ ${esc(p.match)}</span>` : ''}</p>
              </div>
              <span class="p-price">${esc(p.price)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
    <div style="height:20px"></div>
  </div>`
}

// ---------------------------------------------------------------------------
// BOTTOM NAV
// ---------------------------------------------------------------------------
function bottomNav() {
  const ico = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
    leads: '<rect x="3" y="4" width="5" height="16" rx="1.2"/><rect x="10" y="4" width="5" height="10" rx="1.2"/><rect x="17" y="4" width="4" height="13" rx="1.2"/>',
    properties: '<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  }
  const svg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`
  return h`
  <nav class="botnav">
    <button data-nav="dashboard">${svg(ico.home)}<span>Home</span></button>
    <button data-nav="leads">${svg(ico.leads)}<span>Leads</span></button>
    <button data-nav="inbox" class="fab">
      <span class="fab-circle"><svg viewBox="0 0 24 24"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Zm0 3.1 1.1 2.9 3 .3-2.3 2 .7 3-2.5-1.7-2.5 1.7.7-3-2.3-2 3-.3L12 5.3Z"/></svg></span>
      <span>Inbox</span>
    </button>
    <button data-nav="properties">${svg(ico.properties)}<span>Properties</span></button>
    <button data-nav="more"><span class="badge">3</span>${svg(ico.more)}<span>More</span></button>
  </nav>`
}

// ---------------------------------------------------------------------------
// TOUR STEPS
// ---------------------------------------------------------------------------
const STEPS = [
  { intro: true },
  {
    screen: 'dashboard', focus: null, nav: 'dashboard',
    title: 'The home screen',
    body: 'Every morning opens here. HomeNex greets the broker and summarises overnight activity — because buyers message on WhatsApp at all hours, and every one became a lead automatically.',
    ai: 'The AI answered inbound WhatsApp messages through the night, so nothing sat unread until morning.',
  },
  {
    screen: 'dashboard', focus: 'kpis',
    title: 'Four numbers that run the day',
    body: 'Waiting for reply, hot leads, follow-ups due, and site visits — the only stats a busy broker needs at a glance. The amber tiles are the ones that need action now.',
    ai: 'AI keeps “waiting for reply” low by auto-answering in seconds — the 12 here are ones flagged for a human touch.',
  },
  {
    screen: 'dashboard', focus: 'wa-chip',
    title: 'WhatsApp, always connected',
    body: 'A single compact chip confirms the WhatsApp Business number is live. Buyers only ever see WhatsApp — this dashboard is the broker\'s private cockpit behind it.',
    ai: 'One Meta number powers everything; replies go out from the broker\'s own WhatsApp identity.',
  },
  {
    screen: 'dashboard', focus: 'worklist',
    title: 'Your day, prioritised',
    body: '“What to do next” ranks every pending action by urgency — NOW, HIGH, SOON — so the broker works the highest-value lead first instead of scrolling a flat list.',
    ai: 'Priority is computed from lead score, wait time, and pipeline stage — not manual tagging.',
  },
  {
    screen: 'leads', focus: 'board', nav: 'leads',
    title: 'The lead pipeline',
    body: 'A drag-and-drop kanban across stages — New, Qualified, Site Visit, Negotiation. Six live buyers here, each captured from a WhatsApp chat and dropped into the right column.',
    ai: 'Leads self-qualify: the AI extracts budget, location, timeline & config from conversation and advances the stage.',
  },
  {
    screen: 'leads', focus: 'col-new',
    title: 'Auto-captured, auto-scored',
    body: 'Every card shows BHK, budget, locality, a temperature (🔥/☀️/❄️) and a 0–100 score. Rahul Sharma just messaged about a 2BHK in Whitefield — already scored 75.',
    ai: 'No data entry. Cards populate themselves from the buyer\'s own words in WhatsApp.',
  },
  {
    screen: 'inbox', focus: 'chat', nav: 'inbox',
    title: 'The WhatsApp inbox',
    body: 'Here is the actual conversation. Rahul asked for “a 2BHK in Whitefield under 80 lakhs” — and got a helpful, on-brand reply before he could switch tabs.',
    ai: 'The AI understands intent, pulls matching listings, and writes like the broker would.',
  },
  {
    screen: 'inbox', focus: 'first-ai',
    title: 'Answered in 22 seconds',
    body: 'The green ⚡ Auto-reply badge marks messages the AI sent on its own. It suggested three real matching properties and asked the right qualifying question — instantly, even at 2 AM.',
    ai: 'Every lead answered in under 30 seconds. Speed-to-lead is the #1 driver of conversion in real estate.',
  },
  {
    screen: 'inbox', focus: 'captured',
    title: 'Auto-reply vs. You replied',
    body: 'When the broker steps in, the badge switches to the amber “You replied” — a clear record of what was automated and what was personal. Below, the AI has already filled the buyer profile.',
    ai: 'Budget, location, config & timeline are captured silently as the chat unfolds — feeding the score and matching.',
  },
  {
    screen: 'detail', focus: 'briefing', nav: 'leads',
    title: '“Before you call” coaching',
    body: 'Open any lead and HomeNex briefs the broker before they dial — urgency, family context, budget guardrails, and what to lead with. No scrolling old chats to remember who this is.',
    ai: 'Talking points are generated from the full conversation history, ranked by what will move the deal.',
  },
  {
    screen: 'detail', focus: 'capture',
    title: 'The buyer profile & score',
    body: 'The BLTC profile (Budget · Location · Timeline · Config) and the reasoning behind the score sit together, with a clear “next step” the broker can act on immediately.',
    ai: 'The AI explains its own score — “why warm” — instead of showing an opaque number.',
  },
  {
    screen: 'detail', focus: 'breakdown',
    title: 'How the 75 is built',
    body: 'The score breaks down into budget clarity, location fit, timeline urgency, engagement and loan readiness — so the broker sees exactly what to shore up (here: confirm the home loan).',
    ai: 'Transparent scoring the broker can trust and coach against — not a black box.',
  },
  {
    screen: 'detail', focus: 'followups',
    title: 'Follow-ups & site visits',
    body: 'Scheduled touch-points and booked visits live on the lead. Nothing slips: the Saturday 11 AM visit at Brigade Cornerstone is already on the calendar with a pickup arranged.',
    ai: 'The AI proposes follow-up timing based on buyer heat — hot leads get chased sooner.',
  },
  {
    screen: 'properties', focus: 'prop-list', nav: 'properties',
    title: 'Your property inventory',
    body: 'Six listings with everything Indian buyers ask for — locality, BHK, carpet area, price in L/Cr, RERA status. The green ✨ tags show which lead each property already matches.',
    ai: 'Every property is auto-matched to every lead\'s budget & location, so the right suggestion is one tap away — exactly what powered Rahul\'s instant reply.',
  },
  { outro: true },
]

// ---------------------------------------------------------------------------
// TOUR ENGINE
// ---------------------------------------------------------------------------
let current = 0
let annotEl, appbodyEl

function showScreen(name) {
  document.querySelectorAll('.panel').forEach((p) => p.classList.toggle('active', p.dataset.screen === name))
  document.querySelectorAll('.botnav button').forEach((b) => b.classList.toggle('active', b.dataset.nav === name))
  appbodyEl.scrollTop = 0
}

function clearFocus() {
  document.querySelectorAll('.tour-focus').forEach((e) => e.classList.remove('tour-focus'))
}

function applyFocus(sel) {
  clearFocus()
  if (!sel) return
  const target = document.querySelector(`[data-tour="${sel}"]`)
  if (!target) return
  target.classList.add('tour-focus')
  // scroll target into view within the phone body
  setTimeout(() => {
    const top = target.offsetTop - 90
    appbodyEl.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }, 60)
}

function renderAnnot() {
  const step = STEPS[current]
  const total = STEPS.length

  if (step.intro) {
    annotEl.innerHTML = introOutroCard('intro')
    hideHero(false)
    el('hero-slot').innerHTML = heroOverlay('intro')
    wireHero()
    return
  }
  if (step.outro) {
    annotEl.innerHTML = introOutroCard('outro')
    el('hero-slot').innerHTML = heroOverlay('outro')
    hideHero(false)
    wireHero()
    return
  }

  hideHero(true)
  el('hero-slot').innerHTML = ''
  showScreen(step.nav || step.screen)
  applyFocus(step.focus)

  const stepNum = current // 1-based excluding intro handled below
  const pct = Math.round((current / (total - 1)) * 100)
  const contentSteps = STEPS.filter((s) => !s.intro && !s.outro).length
  const contentIdx = current // since intro is index 0, content steps are 1..N

  annotEl.innerHTML = h`
    <div class="sheet-handle" id="sheet-handle"></div>
    <div class="step-of">Step ${contentIdx} of ${contentSteps} · ${screenLabel(step.screen)}</div>
    <h2>${esc(step.title)}</h2>
    <p class="body">${step.body}</p>
    ${step.ai ? h`<div class="ai-note"><b>⚡ AI capability</b>${step.ai}</div>` : ''}
    <div class="progress-track"><span style="width:${pct}%"></span></div>
    <div class="nav">
      <button class="btn btn-ghost" id="prev" ${current === 0 ? 'disabled' : ''}>← Back</button>
      <button class="btn btn-primary" id="next">${current === total - 1 ? 'Finish' : 'Next →'}</button>
    </div>
    <div class="dots-nav" id="dots"></div>`

  renderDots()
  wireNav()
}

function screenLabel(s) {
  return { dashboard: 'Dashboard', leads: 'Lead Pipeline', inbox: 'Inbox', detail: 'Lead Detail', properties: 'Properties' }[s] || ''
}

function renderDots() {
  const dots = el('dots')
  if (!dots) return
  dots.innerHTML = STEPS.map((_, i) => `<i class="${i === current ? 'on' : ''}" data-dot="${i}"></i>`).join('')
  dots.querySelectorAll('[data-dot]').forEach((d) => d.addEventListener('click', () => goTo(+d.dataset.dot)))
}

function introOutroCard(kind) {
  if (kind === 'intro') {
    return h`
      <div class="step-of">Interactive product tour</div>
      <h2>Welcome to HomeNex</h2>
      <p class="body">A guided walk-through of the AI-powered WhatsApp lead manager built for Indian real estate brokers. Everything you'll see is a live-styled demo with sample data.</p>
      <div class="ai-note"><b>⚡ What HomeNex does</b>Every buyer who messages your WhatsApp number becomes a lead — answered by AI in seconds, qualified, scored, and handed to you when it matters.</div>
      <div class="nav"><button class="btn btn-primary" id="next">Start the tour →</button></div>
      <div class="dots-nav" id="dots"></div>`
  }
  return h`
    <div class="step-of">That's the tour</div>
    <h2>Every lead answered<br>in 30 seconds</h2>
    <p class="body">You've seen the dashboard, pipeline, AI inbox, lead intelligence and property matching. This was sample data — the real app connects your own WhatsApp number and runs it all for you.</p>
    <div class="cta-links">
      <a class="cta primary" href="${REAL_APP_URL}" target="_blank" rel="noopener">Try the real app →</a>
      <a class="cta secondary" href="${PRODUCT_SITE_URL}">← Back to product site</a>
    </div>
    <div class="nav" style="margin-top:14px"><button class="btn btn-ghost" id="prev">← Back</button><button class="btn btn-primary" id="restart">Restart tour ↺</button></div>
    <div class="dots-nav" id="dots"></div>`
}

function heroOverlay(kind) {
  if (kind === 'intro') {
    return h`
      <div class="hero-overlay">
        <span class="big-emoji">🏡</span>
        <span class="badge2">HOMENEX · DEMO</span>
        <h1>Every lead answered<br>in 30 seconds.<br>Even at 2 AM.</h1>
        <p>AI-powered WhatsApp lead management for Indian real estate brokers.</p>
        <div class="stat-line">
          <div><div class="n">30s</div><div class="l">avg reply</div></div>
          <div><div class="n">24×7</div><div class="l">AI on call</div></div>
          <div><div class="n">0</div><div class="l">leads missed</div></div>
        </div>
        <button class="start-btn" id="hero-start">Start the tour →</button>
        <span class="mini">Sample data · no login needed</span>
      </div>`
  }
  return h`
    <div class="hero-overlay">
      <span class="big-emoji">✅</span>
      <span class="badge2">TOUR COMPLETE</span>
      <h1>Ready to never miss<br>a lead again?</h1>
      <p>Connect your WhatsApp Business number and let HomeNex answer, qualify and score every buyer.</p>
      <button class="start-btn" id="hero-cta">Try the real app →</button>
      <span class="mini" id="hero-restart" style="cursor:pointer;text-decoration:underline">Restart the tour</span>
    </div>`
}

function hideHero(hidden) {
  const slot = el('hero-slot')
  if (slot) slot.style.display = hidden ? 'none' : 'block'
}

function wireHero() {
  const start = el('hero-start')
  if (start) start.addEventListener('click', () => goTo(1))
  const cta = el('hero-cta')
  if (cta) cta.addEventListener('click', () => window.open(REAL_APP_URL, '_blank'))
  const hr = el('hero-restart')
  if (hr) hr.addEventListener('click', () => goTo(0))
  wireNav()
}

function wireNav() {
  const next = el('next'); const prev = el('prev'); const restart = el('restart')
  if (next) next.addEventListener('click', () => goTo(current + 1))
  if (prev) prev.addEventListener('click', () => goTo(current - 1))
  if (restart) restart.addEventListener('click', () => goTo(0))
}

function goTo(i) {
  current = Math.max(0, Math.min(STEPS.length - 1, i))
  // collapse mobile sheet expanded state on step change
  annotEl.classList.remove('collapsed')
  renderAnnot()
}

// ---------------------------------------------------------------------------
// BOOT
// ---------------------------------------------------------------------------
function boot() {
  el('app').innerHTML = h`
    <div class="stage">
      <div class="phone-col">
        <div class="brandbar">
          <span class="logo">🏡</span>
          <div>
            <div class="name">HomeNex</div>
            <div class="tag">Interactive product tour</div>
          </div>
          <span class="demo-pill">DEMO</span>
        </div>
        <div class="device">
          <div class="screen">
            <div class="notch"></div>
            <div class="statusbar">
              <span>9:41</span>
              <span class="dots">📶 &nbsp;🔋</span>
            </div>
            <div class="appbody" id="appbody">
              ${screenDashboard()}
              ${screenLeads()}
              ${screenInbox()}
              ${screenDetail()}
              ${screenProperties()}
              <div id="hero-slot"></div>
            </div>
            ${bottomNav()}
          </div>
        </div>
      </div>
      <aside class="annot" id="annot"></aside>
    </div>`

  annotEl = el('annot')
  appbodyEl = el('appbody')

  // bottom-nav is interactive: jump to the first tour step on that screen
  document.querySelectorAll('.botnav button').forEach((b) => {
    b.addEventListener('click', () => {
      const scr = b.dataset.nav
      const idx = STEPS.findIndex((s) => (s.nav || s.screen) === scr && !s.intro && !s.outro)
      if (idx >= 0) goTo(idx)
    })
  })

  // mobile: tap the handle to collapse/expand the annotation sheet
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'sheet-handle') annotEl.classList.toggle('collapsed')
  })

  // keyboard arrows
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(current + 1)
    if (e.key === 'ArrowLeft') goTo(current - 1)
  })

  showScreen('dashboard')
  renderAnnot()
}

boot()
