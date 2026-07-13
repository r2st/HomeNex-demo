// ---------------------------------------------------------------------------
// HomeNex Interactive Demo — hardcoded dummy data (no backend).
// Indian real estate; money shown in lakhs (L) / crores (Cr).
// Everything below is illustrative sample data for the guided product tour.
// ---------------------------------------------------------------------------

export const AGENT = {
  name: 'Arjun Mehta',
  firm: 'Skyline Realty · Bengaluru',
  wa_phone: '+91 98450 12345',
}

// Home dashboard KPIs (matches the tour spec).
export const STATS = {
  waiting: 12,
  hot: 5,
  followups: 8,
  visits: 3,
  newToday: 4,
  active24h: 9,
}

// "Your day — what to do next" worklist.
export const WORKLIST = [
  {
    priority: 'critical',
    label: 'NOW',
    title: 'Rahul Sharma is waiting',
    reason: 'Asked about 2BHK in Whitefield · unanswered 3 min · AI drafted a reply',
    action: 'reply',
  },
  {
    priority: 'high',
    label: 'HIGH',
    title: 'Call Deepa Reddy',
    reason: 'In Negotiation · counter-offer pending on Banjara Hills 3BHK',
    action: 'lead',
  },
  {
    priority: 'medium',
    label: 'SOON',
    title: 'Confirm Vikram Singh site visit',
    reason: 'Jubilee Hills 4BHK · scheduled tomorrow 11:00 AM',
    action: 'lead',
  },
]

// Live activity feed on the dashboard.
export const ACTIVITY = [
  { kind: 'ai', text: 'HomeNex AI replied to Rahul Sharma in 22 seconds', ago: 'now' },
  { kind: 'hot', text: 'Priya Patel marked 🔥 Hot — budget confirmed ₹1.2 Cr', ago: '4m' },
  { kind: 'lead', text: 'New lead Amit Kumar captured from WhatsApp', ago: '18m' },
  { kind: 'agent', text: 'You scheduled a follow-up with Neha Gupta', ago: '1h' },
  { kind: 'ai', text: 'AI qualified Deepa Reddy · BLTC complete', ago: '2h' },
]

// ---- Lead pipeline (Buy · Primary) -----------------------------------------
// stage: New | Qualified | Site Visit | Negotiation
export const LEADS = [
  { id: 'rahul',  name: 'Rahul Sharma',  stage: 'New',         bhk: '2 BHK', budget: '₹80 L',   locality: 'Whitefield',       temp: 'Warm', score: 75, ago: '3m',  pipeline: 'Buy (Primary)' },
  { id: 'priya',  name: 'Priya Patel',   stage: 'New',         bhk: '3 BHK', budget: '₹1.2 Cr', locality: 'Koramangala',      temp: 'Hot',  score: 88, ago: '4m',  pipeline: 'Buy (Primary)' },
  { id: 'amit',   name: 'Amit Kumar',    stage: 'Qualified',   bhk: '2 BHK', budget: '₹50 L',   locality: 'Electronic City',  temp: 'Warm', score: 68, ago: '18m', pipeline: 'Buy (Primary)' },
  { id: 'neha',   name: 'Neha Gupta',    stage: 'Qualified',   bhk: '1 BHK', budget: 'Rental',  locality: 'Indiranagar',      temp: 'Warm', score: 64, ago: '1h',  pipeline: 'Rental' },
  { id: 'vikram', name: 'Vikram Singh',  stage: 'Site Visit',  bhk: '4 BHK', budget: '₹2 Cr',   locality: 'Jubilee Hills',    temp: 'Hot',  score: 91, ago: '3h',  pipeline: 'Buy (Primary)' },
  { id: 'deepa',  name: 'Deepa Reddy',   stage: 'Negotiation', bhk: '3 BHK', budget: '₹95 L',   locality: 'Banjara Hills',    temp: 'Hot',  score: 84, ago: '5h',  pipeline: 'Buy (Primary)' },
]

export const PIPELINE_STAGES = ['New', 'Qualified', 'Site Visit', 'Negotiation']

// ---- Inbox conversation (Rahul Sharma) -------------------------------------
// role: buyer | ai | agent   ·   mode badge appears on outbound messages
export const CONVERSATION = {
  leadId: 'rahul',
  name: 'Rahul Sharma',
  wa: '+91 98867 45231',
  messages: [
    {
      role: 'buyer',
      text: "Hi, I'm looking for a 2BHK in Whitefield under 80 lakhs",
      time: '10:42 AM',
    },
    {
      role: 'ai',
      mode: 'Auto-reply',
      text:
        "Hi Rahul! 👋 I'm from Skyline Realty. Great choice — Whitefield has excellent options in your budget. I have 3 ready-to-move 2BHKs under ₹80L:\n\n• Brigade Cornerstone Utopia — ₹78L, 1180 sq.ft\n• Sobha Dream Acres — ₹62L, 1010 sq.ft\n• Purva Zenium — ₹48L (nearby Hosur Rd)\n\nAre you looking to move in soon, or planning ahead? And is this your first home or an investment?",
      time: '10:42 AM',
      meta: 'Replied in 22 seconds',
    },
    {
      role: 'buyer',
      text: "Planning to move in the next 3 months. First home for my family.",
      time: '10:51 AM',
    },
    {
      role: 'ai',
      mode: 'Auto-reply',
      text:
        "Perfect — for a family moving in soon, Brigade Cornerstone Utopia is ideal: ready-to-move, RERA-registered, with a clubhouse and kids' play area. Would Saturday 11 AM work for a site visit? I can also share the floor plan on WhatsApp right now.",
      time: '10:52 AM',
    },
    {
      role: 'buyer',
      text: "Saturday works. Please share the floor plan.",
      time: '11:03 AM',
    },
    {
      role: 'agent',
      mode: 'You replied',
      text:
        "Hi Rahul, Arjun here 😊 I'll personally take you around on Saturday at 11. Sending the Brigade floor plan and a short video now. See you then!",
      time: '11:09 AM',
    },
  ],
  // Preferences the AI captured automatically from the chat.
  captured: [
    { k: '🎯 Intent', v: 'Buy · first home (end-use)' },
    { k: '💰 Budget', v: 'Up to ₹80 L' },
    { k: '📍 Location', v: 'Whitefield' },
    { k: '🏠 Config', v: '2 BHK' },
    { k: '⏱ Timeline', v: 'Move in ~3 months' },
  ],
}

// ---- Lead detail (Rahul Sharma) --------------------------------------------
export const LEAD_DETAIL = {
  id: 'rahul',
  name: 'Rahul Sharma',
  wa: '+91 98867 45231',
  pipeline: 'Buy (Primary)',
  stage: 'New',
  score: 75,
  temp: 'Warm',
  updated: '3 min ago',
  briefing: {
    temperature: 'Warm',
    days: 0,
    points: [
      { tone: 'hot',  text: '🔥 Move-in timeline is just 3 months — high urgency, prioritise the Saturday visit.' },
      { tone: 'warm', text: '👨‍👩‍👧 First home for the family — lead with schools, clubhouse & safety, not ROI.' },
      { tone: 'warm', text: '💰 Budget ₹80L is firm — Brigade Cornerstone (₹78L) fits; avoid pushing above.' },
      { tone: 'info', text: '📍 Wants Whitefield specifically — mention metro Phase-2 connectivity as a plus.' },
    ],
    missing: ['Loan pre-approval status', 'Preferred floor / facing'],
  },
  capture: [
    { k: '💬 Summary', v: 'Family end-user, ready-to-move 2BHK in Whitefield, moving in ~3 months.' },
    { k: '🎯 Intent', v: 'Buy — first home' },
    { k: '📍 Location', v: 'Whitefield', note: 'flexible up to 3 km' },
    { k: '🏠 Config', v: '2 BHK', note: '≥ 1100 sq.ft preferred' },
  ],
  ai_score: 'warm',
  ai_score_reason: 'Clear budget, location & config with a near-term timeline, but loan status unconfirmed.',
  next_step: 'Confirm Saturday 11 AM site visit at Brigade Cornerstone Utopia.',
  breakdown: [
    { label: 'Budget clarity', value: 85 },
    { label: 'Location fit', value: 90 },
    { label: 'Timeline urgency', value: 80 },
    { label: 'Engagement', value: 70 },
    { label: 'Loan readiness', value: 45 },
  ],
  followups: [
    { note: 'Share Brigade floor plan + walkthrough video', due: 'Today, 12:00 PM', done: true },
    { note: 'Confirm Saturday site visit & arrange pickup', due: 'Fri, 6:00 PM', done: false },
    { note: 'Ask about home-loan pre-approval', due: 'Sat, after visit', done: false },
  ],
  visits: [
    { property: 'Brigade Cornerstone Utopia', when: 'Sat, 11:00 AM', status: 'Scheduled', pickup: true },
  ],
}

// ---- Properties ------------------------------------------------------------
// status: ready | uc (under construction)
export const PROPERTIES = [
  { title: 'Brigade Cornerstone Utopia', bhk: '2 BHK', type: 'Apartment', locality: 'Whitefield',   price: '₹78 L',   status: 'ready', rera: true,  match: 'Matches Rahul Sharma', area: '1,180 sq.ft' },
  { title: 'Prestige Lakeside Habitat',  bhk: '3 BHK', type: 'Apartment', locality: 'Whitefield',   price: '₹1.35 Cr', status: 'uc',    rera: true,  match: null,                  area: '1,650 sq.ft' },
  { title: 'Sobha Dream Acres',          bhk: '2 BHK', type: 'Apartment', locality: 'Panathur',     price: '₹62 L',   status: 'ready', rera: true,  match: 'Matches Amit Kumar',  area: '1,010 sq.ft' },
  { title: 'Godrej Splendour',           bhk: '3 BHK', type: 'Apartment', locality: 'Whitefield',   price: '₹1.1 Cr',  status: 'uc',    rera: true,  match: null,                  area: '1,485 sq.ft' },
  { title: 'Purva Zenium',               bhk: '1 BHK', type: 'Apartment', locality: 'Hosur Road',   price: '₹48 L',   status: 'ready', rera: false, match: 'Matches Neha Gupta',  area: '660 sq.ft' },
  { title: 'Embassy Lake Terraces',      bhk: '4 BHK', type: 'Penthouse', locality: 'Hebbal',       price: '₹3.2 Cr',  status: 'uc',    rera: true,  match: 'Matches Vikram Singh', area: '3,400 sq.ft' },
]
