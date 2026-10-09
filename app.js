// ===========================================================================
// HomeNex — Viral Property Search Tool for Indian Buyers
// No login, no backend. Pure client-side. WhatsApp sharing everywhere.
// ===========================================================================
import {
  CITIES, LOCALITIES, PROPERTIES, AREA_GUIDES, STAMP_DUTY_RATES,
  STATE_FOR_CITY, BANK_RATES, SITE_URL,
} from './data.js'

const $ = (s, root = document) => root.querySelector(s)
const $$ = (s, root = document) => [...root.querySelectorAll(s)]
const h = (strings, ...vals) => strings.map((s, i) => s + (vals[i] ?? '')).join('')
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))
const fmt = (n) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : `₹${(n / 100000).toFixed(0)} L`
const fmtNum = (n) => new Intl.NumberFormat('en-IN').format(Math.round(n))

let currentScreen = 'home'
let selectedCity = 'Bengaluru'
let filters = { bhk: 'Any', priceMax: Infinity, priceMin: 0, status: 'Any' }
let compareList = JSON.parse(localStorage.getItem('hn_compare') || '[]')
let favorites = JSON.parse(localStorage.getItem('hn_favs') || '[]')

// ---------------------------------------------------------------------------
// ROUTING — handle shareable URLs via hash
// ---------------------------------------------------------------------------
function parseHash() {
  const hash = location.hash.slice(1)
  if (!hash) return { screen: 'home' }
  const [screen, ...rest] = hash.split('/')
  return { screen, param: rest.join('/') }
}

function navigate(screen, param) {
  const hash = param ? `${screen}/${param}` : screen
  location.hash = hash
}

window.addEventListener('hashchange', () => {
  const { screen, param } = parseHash()
  renderScreen(screen, param)
})

// ---------------------------------------------------------------------------
// WHATSAPP SHARE HELPERS
// ---------------------------------------------------------------------------
function waShareProperty(p) {
  const emi = calcEMI(p.price * 0.8, 8.5, 20)
  const msg = `🏠 Check out this ${p.bhk} in ${p.locality}, ${p.city} for ${p.priceLabel} | EMI from ₹${fmtNum(emi)}/mo

${p.title} — ${p.area} sq.ft
${p.status === 'ready' ? '✅ Ready to move' : '🏗️ Under construction'}${p.rera ? ' | RERA ✓' : ''}

👉 ${SITE_URL}#property/${p.id}`
  return `https://wa.me/?text=${encodeURIComponent(msg)}`
}

function waShareComparison(ids) {
  const props = ids.map(id => PROPERTIES.find(p => p.id === id)).filter(Boolean)
  let msg = `🏠 Property Comparison from HomeNex\n\n`
  props.forEach((p, i) => {
    msg += `${i + 1}. ${p.title} — ${p.bhk}, ${p.locality}\n   ${p.priceLabel} | ${p.area} sq.ft\n\n`
  })
  msg += `Compare all → ${SITE_URL}#compare/${ids.join(',')}`
  return `https://wa.me/?text=${encodeURIComponent(msg)}`
}

function waShareEMI(price, rate, years, emi) {
  const msg = `💰 EMI Calculator Result from HomeNex

Property Value: ₹${fmtNum(price)}
Loan Amount (80%): ₹${fmtNum(price * 0.8)}
Interest Rate: ${rate}%
Tenure: ${years} years

📊 Monthly EMI: ₹${fmtNum(emi)}
Total Interest: ₹${fmtNum(emi * years * 12 - price * 0.8)}
Total Payment: ₹${fmtNum(emi * years * 12)}

Try it yourself 👉 ${SITE_URL}#emi`
  return `https://wa.me/?text=${encodeURIComponent(msg)}`
}

function waShareStampDuty(state, price, duty, reg) {
  const msg = `📋 Stamp Duty Calculator — ${state}

Property Value: ₹${fmtNum(price)}
Stamp Duty: ₹${fmtNum(duty)}
Registration: ₹${fmtNum(reg)}
Total Extra Cost: ₹${fmtNum(duty + reg)}

Calculate yours 👉 ${SITE_URL}#stamp-duty`
  return `https://wa.me/?text=${encodeURIComponent(msg)}`
}

// ---------------------------------------------------------------------------
// EMI CALCULATION
// ---------------------------------------------------------------------------
function calcEMI(principal, annualRate, years) {
  const r = annualRate / 12 / 100
  const n = years * 12
  if (r === 0) return principal / n
  return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
}

// ---------------------------------------------------------------------------
// FAVORITES & COMPARE (localStorage, no login)
// ---------------------------------------------------------------------------
function toggleFav(id) {
  const idx = favorites.indexOf(id)
  if (idx >= 0) favorites.splice(idx, 1)
  else favorites.push(id)
  try { localStorage.setItem('hn_favs', JSON.stringify(favorites)) } catch {}
  renderScreen(currentScreen)
}

function toggleCompare(id) {
  const idx = compareList.indexOf(id)
  if (idx >= 0) compareList.splice(idx, 1)
  else if (compareList.length < 4) compareList.push(id)
  try { localStorage.setItem('hn_compare', JSON.stringify(compareList)) } catch {}
  renderScreen(currentScreen)
}

// ---------------------------------------------------------------------------
// SCREEN: HOME
// ---------------------------------------------------------------------------
function screenHome() {
  const trending = PROPERTIES.filter(p => p.city === selectedCity).slice(0, 4)
  return h`
  <div class="screen-content" data-screen="home">
    <header class="hero">
      <div class="hero-inner">
        <div class="hero-badge">🏡 HomeNex</div>
        <h1>Find your dream home<br>in India</h1>
        <p>Search properties, calculate EMI, check stamp duty — all free, no login needed</p>
        <div class="hero-search">
          <div class="search-row">
            <select id="city-select" class="search-select">
              ${CITIES.map(c => h`<option value="${esc(c)}" ${c === selectedCity ? 'selected' : ''}>${esc(c)}</option>`).join('')}
            </select>
            <button class="btn-search" onclick="window._hn.search()">Search Properties →</button>
          </div>
        </div>
        <div class="hero-stats">
          <div><span class="n">${PROPERTIES.length}+</span><span class="l">Properties</span></div>
          <div><span class="n">${CITIES.length}</span><span class="l">Cities</span></div>
          <div><span class="n">100%</span><span class="l">Free</span></div>
        </div>
      </div>
    </header>

    <section class="section">
      <h2 class="section-title">Free Tools for Home Buyers</h2>
      <div class="tools-grid">
        <div class="tool-card" onclick="window._hn.nav('emi')">
          <span class="tool-icon">🧮</span>
          <h3>EMI Calculator</h3>
          <p>Calculate monthly EMI for any property. Compare bank rates.</p>
        </div>
        <div class="tool-card" onclick="window._hn.nav('stamp-duty')">
          <span class="tool-icon">📋</span>
          <h3>Stamp Duty Calculator</h3>
          <p>Know exact stamp duty & registration charges for your state.</p>
        </div>
        <div class="tool-card" onclick="window._hn.nav('areas')">
          <span class="tool-icon">📍</span>
          <h3>Area Guides</h3>
          <p>Price trends, connectivity, schools & hospitals — area-wise.</p>
        </div>
        <div class="tool-card" onclick="window._hn.nav('search')">
          <span class="tool-icon">🔍</span>
          <h3>Property Search</h3>
          <p>Filter by city, BHK, budget, status. Share via WhatsApp.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="flex between items-center">
        <h2 class="section-title" style="margin-bottom:0">Trending in ${esc(selectedCity)}</h2>
        <button class="link-btn" onclick="window._hn.nav('search')">View all →</button>
      </div>
      <div class="property-scroll">
        ${trending.map(p => propertyCard(p)).join('')}
      </div>
    </section>

    <section class="section cta-section">
      <h2>Share with family on WhatsApp</h2>
      <p>Found the perfect home? Share any listing, EMI calculation, or comparison with your family — one tap.</p>
      <div class="wa-badge-big">
        <svg viewBox="0 0 24 24" class="wa-icon-big"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Z"/></svg>
        Every feature has a WhatsApp share button
      </div>
    </section>
  </div>`
}

// ---------------------------------------------------------------------------
// PROPERTY CARD (reused everywhere)
// ---------------------------------------------------------------------------
function propertyCard(p) {
  const isFav = favorites.includes(p.id)
  const isComp = compareList.includes(p.id)
  const emi = calcEMI(p.price * 0.8, 8.5, 20)
  return h`
  <div class="prop-card" data-id="${p.id}">
    <div class="prop-card-top">
      <div class="prop-thumb">${p.img}</div>
      <div class="prop-card-actions">
        <button class="icon-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation();window._hn.fav('${p.id}')" title="Save">
          ${isFav ? '❤️' : '🤍'}
        </button>
        <button class="icon-btn ${isComp ? 'active' : ''}" onclick="event.stopPropagation();window._hn.compare('${p.id}')" title="Compare">
          ⚖️
        </button>
      </div>
    </div>
    <div class="prop-card-body" onclick="window._hn.nav('property/${p.id}')">
      <h3 class="prop-card-title">${esc(p.title)}</h3>
      <p class="prop-card-loc">${esc(p.bhk)} · ${esc(p.locality)}, ${esc(p.city)} · ${p.area} sq.ft</p>
      <div class="prop-card-bottom">
        <div>
          <span class="prop-card-price">${esc(p.priceLabel)}</span>
          <span class="prop-card-emi">EMI ₹${fmtNum(emi)}/mo</span>
        </div>
        <div class="prop-card-tags">
          ${p.status === 'ready' ? '<span class="tag ready">Ready</span>' : '<span class="tag uc">Under Construction</span>'}
          ${p.rera ? '<span class="tag rera">RERA</span>' : ''}
        </div>
      </div>
    </div>
    <div class="prop-card-share">
      <a href="${waShareProperty(p)}" target="_blank" rel="noopener" class="wa-share-btn" onclick="event.stopPropagation()">
        <svg viewBox="0 0 24 24" class="wa-icon-sm"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Z"/></svg>
        Share on WhatsApp
      </a>
    </div>
  </div>`
}

// ---------------------------------------------------------------------------
// SCREEN: SEARCH / LISTINGS
// ---------------------------------------------------------------------------
function screenSearch() {
  let results = PROPERTIES.filter(p => p.city === selectedCity)
  if (filters.bhk !== 'Any') results = results.filter(p => p.bhk.startsWith(filters.bhk.replace(' BHK','')))
  if (filters.priceMax < Infinity) results = results.filter(p => p.price <= filters.priceMax)
  if (filters.priceMin > 0) results = results.filter(p => p.price >= filters.priceMin)
  if (filters.status !== 'Any') results = results.filter(p => p.status === filters.status)

  return h`
  <div class="screen-content" data-screen="search">
    <div class="search-header">
      <h1>Properties in ${esc(selectedCity)}</h1>
      <p>${results.length} properties found</p>
    </div>

    <div class="filter-bar">
      <select id="filter-city" class="filter-select" onchange="window._hn.setCity(this.value)">
        ${CITIES.map(c => h`<option value="${esc(c)}" ${c === selectedCity ? 'selected' : ''}>${esc(c)}</option>`).join('')}
      </select>
      <select id="filter-bhk" class="filter-select" onchange="window._hn.setBhk(this.value)">
        <option value="Any" ${filters.bhk === 'Any' ? 'selected' : ''}>Any BHK</option>
        <option value="1" ${filters.bhk === '1' ? 'selected' : ''}>1 BHK</option>
        <option value="2" ${filters.bhk === '2' ? 'selected' : ''}>2 BHK</option>
        <option value="3" ${filters.bhk === '3' ? 'selected' : ''}>3 BHK</option>
        <option value="4" ${filters.bhk === '4' ? 'selected' : ''}>4 BHK</option>
      </select>
      <select id="filter-price" class="filter-select" onchange="window._hn.setPrice(this.value)">
        <option value="0-Infinity" ${filters.priceMax === Infinity ? 'selected' : ''}>Any Price</option>
        <option value="0-5000000">Under ₹50L</option>
        <option value="5000000-10000000">₹50L – 1Cr</option>
        <option value="10000000-25000000">₹1Cr – 2.5Cr</option>
        <option value="25000000-Infinity">Above ₹2.5Cr</option>
      </select>
      <select id="filter-status" class="filter-select" onchange="window._hn.setStatus(this.value)">
        <option value="Any" ${filters.status === 'Any' ? 'selected' : ''}>Any Status</option>
        <option value="ready" ${filters.status === 'ready' ? 'selected' : ''}>Ready to Move</option>
        <option value="uc" ${filters.status === 'uc' ? 'selected' : ''}>Under Construction</option>
      </select>
    </div>

    <div class="property-grid">
      ${results.length ? results.map(p => propertyCard(p)).join('') : '<div class="empty-state"><span class="empty-icon">🏠</span><p>No properties match your filters. Try changing the city or budget.</p></div>'}
    </div>

    ${compareList.length >= 2 ? h`
    <div class="compare-fab" onclick="window._hn.nav('compare/${compareList.join(',')}')">
      ⚖️ Compare ${compareList.length} properties
    </div>` : ''}
  </div>`
}

// ---------------------------------------------------------------------------
// SCREEN: PROPERTY DETAIL
// ---------------------------------------------------------------------------
function screenProperty(id) {
  const p = PROPERTIES.find(x => x.id === id)
  if (!p) return '<div class="screen-content"><div class="section"><h1>Property not found</h1></div></div>'
  const emi = calcEMI(p.price * 0.8, 8.5, 20)
  const guide = AREA_GUIDES[p.locality]
  const similar = PROPERTIES.filter(x => x.city === p.city && x.id !== p.id && x.bhk === p.bhk).slice(0, 3)

  return h`
  <div class="screen-content" data-screen="property">
    <button class="back-btn" onclick="history.back()">← Back</button>

    <div class="detail-hero">
      <div class="detail-thumb">${p.img}</div>
      <div class="detail-actions">
        <button class="icon-btn-lg ${favorites.includes(p.id) ? 'active' : ''}" onclick="window._hn.fav('${p.id}')">
          ${favorites.includes(p.id) ? '❤️ Saved' : '🤍 Save'}
        </button>
        <a href="${waShareProperty(p)}" target="_blank" rel="noopener" class="wa-share-btn-lg">
          <svg viewBox="0 0 24 24" class="wa-icon-sm"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Z"/></svg>
          Share on WhatsApp
        </a>
      </div>
    </div>

    <div class="detail-body">
      <h1>${esc(p.title)}</h1>
      <p class="detail-sub">${esc(p.bhk)} · ${esc(p.type)} · ${esc(p.locality)}, ${esc(p.city)}</p>

      <div class="detail-price-row">
        <div>
          <span class="detail-price">${esc(p.priceLabel)}</span>
          <span class="detail-emi">EMI from ₹${fmtNum(emi)}/mo</span>
        </div>
        <div class="detail-tags">
          ${p.status === 'ready' ? '<span class="tag ready">✅ Ready to Move</span>' : '<span class="tag uc">🏗️ Under Construction</span>'}
          ${p.rera ? `<span class="tag rera">RERA ✓</span>` : ''}
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-item"><span class="detail-label">Area</span><span class="detail-value">${p.area} sq.ft</span></div>
        <div class="detail-item"><span class="detail-label">Builder</span><span class="detail-value">${esc(p.builder)}</span></div>
        <div class="detail-item"><span class="detail-label">Floor</span><span class="detail-value">${esc(p.floors)}</span></div>
        <div class="detail-item"><span class="detail-label">Facing</span><span class="detail-value">${esc(p.facing)}</span></div>
        <div class="detail-item"><span class="detail-label">Parking</span><span class="detail-value">${p.parking} covered</span></div>
        <div class="detail-item"><span class="detail-label">Year</span><span class="detail-value">${p.yearBuilt}</span></div>
        ${p.rera ? h`<div class="detail-item full"><span class="detail-label">RERA No.</span><span class="detail-value" style="font-size:11px">${esc(p.rera)}</span></div>` : ''}
      </div>

      <div class="detail-section">
        <h3>Amenities</h3>
        <div class="amenity-tags">
          ${p.amenities.map(a => h`<span class="amenity-tag">${esc(a)}</span>`).join('')}
        </div>
      </div>

      <div class="detail-section calc-preview">
        <h3>Quick EMI Estimate</h3>
        <div class="emi-preview">
          <div class="emi-row"><span>Property Price</span><span>₹${fmtNum(p.price)}</span></div>
          <div class="emi-row"><span>Down Payment (20%)</span><span>₹${fmtNum(p.price * 0.2)}</span></div>
          <div class="emi-row"><span>Loan Amount</span><span>₹${fmtNum(p.price * 0.8)}</span></div>
          <div class="emi-row"><span>Rate (SBI)</span><span>8.50%</span></div>
          <div class="emi-row emi-total"><span>Monthly EMI</span><span>₹${fmtNum(emi)}</span></div>
        </div>
        <div class="emi-actions">
          <button class="btn-outline" onclick="window._hn.nav('emi')">Full EMI Calculator →</button>
          <a href="${waShareEMI(p.price, 8.5, 20, emi)}" target="_blank" rel="noopener" class="wa-share-btn">
            <svg viewBox="0 0 24 24" class="wa-icon-sm"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Z"/></svg>
            Share EMI
          </a>
        </div>
      </div>

      ${guide ? h`
      <div class="detail-section">
        <h3>📍 ${esc(p.locality)} Area Guide</h3>
        <div class="area-mini">
          <div><strong>Avg Price:</strong> ${esc(guide.avgPrice)}</div>
          <div><strong>Trend:</strong> ${esc(guide.trend)}</div>
          <div><strong>Metro:</strong> ${esc(guide.metro)}</div>
          <div><strong>Vibe:</strong> ${esc(guide.vibe)}</div>
        </div>
        <button class="btn-outline" onclick="window._hn.nav('areas')">Full Area Guide →</button>
      </div>` : ''}

      <div class="detail-section">
        <h3>Contact via WhatsApp</h3>
        <a href="https://wa.me/919845012345?text=${encodeURIComponent(`Hi, I'm interested in ${p.title} (${p.bhk}) in ${p.locality} listed at ${p.priceLabel} on HomeNex.`)}" target="_blank" rel="noopener" class="wa-contact-btn">
          <svg viewBox="0 0 24 24" class="wa-icon-md"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Z"/></svg>
          Chat with Agent on WhatsApp
        </a>
        <a href="${waShareProperty(p)}" target="_blank" rel="noopener" class="wa-family-btn">
          👨‍👩‍👧‍👦 Share with Family on WhatsApp
        </a>
      </div>

      ${similar.length ? h`
      <div class="detail-section">
        <h3>Similar Properties</h3>
        <div class="property-scroll">
          ${similar.map(s => propertyCard(s)).join('')}
        </div>
      </div>` : ''}
    </div>
  </div>`
}

// ---------------------------------------------------------------------------
// SCREEN: EMI CALCULATOR
// ---------------------------------------------------------------------------
function screenEMI() {
  return h`
  <div class="screen-content" data-screen="emi">
    <div class="section">
      <h1 class="tool-title">🧮 EMI Calculator</h1>
      <p class="tool-sub">Calculate monthly home loan EMI instantly. No login needed.</p>

      <div class="calc-card">
        <div class="calc-field">
          <label>Property Price (₹)</label>
          <input type="number" id="emi-price" value="7500000" min="100000" step="100000" oninput="window._hn.recalcEMI()" />
          <input type="range" id="emi-price-range" min="1000000" max="100000000" step="500000" value="7500000" oninput="$('#emi-price').value=this.value;window._hn.recalcEMI()" />
        </div>
        <div class="calc-field">
          <label>Down Payment (%)</label>
          <input type="number" id="emi-dp" value="20" min="0" max="80" oninput="window._hn.recalcEMI()" />
          <input type="range" id="emi-dp-range" min="0" max="80" step="5" value="20" oninput="$('#emi-dp').value=this.value;window._hn.recalcEMI()" />
        </div>
        <div class="calc-field">
          <label>Interest Rate (% p.a.)</label>
          <input type="number" id="emi-rate" value="8.5" min="5" max="15" step="0.05" oninput="window._hn.recalcEMI()" />
          <input type="range" id="emi-rate-range" min="500" max="1500" step="5" value="850" oninput="$('#emi-rate').value=(this.value/100).toFixed(2);window._hn.recalcEMI()" />
        </div>
        <div class="calc-field">
          <label>Loan Tenure (years)</label>
          <input type="number" id="emi-years" value="20" min="1" max="30" oninput="window._hn.recalcEMI()" />
          <input type="range" id="emi-years-range" min="1" max="30" step="1" value="20" oninput="$('#emi-years').value=this.value;window._hn.recalcEMI()" />
        </div>
      </div>

      <div class="calc-result" id="emi-result"></div>

      <div class="section" style="margin-top:28px">
        <h2 class="section-title">Current Home Loan Rates</h2>
        <div class="rates-table">
          <div class="rate-row rate-header">
            <span>Bank</span><span>Rate</span><span>Max Tenure</span>
          </div>
          ${BANK_RATES.map(b => h`
            <div class="rate-row" onclick="$('#emi-rate').value='${b.rate}';window._hn.recalcEMI()">
              <span class="rate-bank">${esc(b.bank)}</span>
              <span class="rate-val">${b.rate}%</span>
              <span>${b.maxTenure} yrs</span>
            </div>`).join('')}
        </div>
        <p class="rates-note">Tap a bank to use its rate. Rates are indicative and subject to change.</p>
      </div>
    </div>
  </div>`
}

function recalcEMI() {
  const price = parseFloat($('#emi-price')?.value) || 0
  const dp = parseFloat($('#emi-dp')?.value) || 20
  const rate = parseFloat($('#emi-rate')?.value) || 8.5
  const years = parseInt($('#emi-years')?.value) || 20
  const loan = price * (1 - dp / 100)
  const emi = calcEMI(loan, rate, years)
  const totalPay = emi * years * 12
  const totalInterest = totalPay - loan

  const el = $('#emi-result')
  if (!el) return

  el.innerHTML = h`
    <div class="result-big">
      <span class="result-label">Monthly EMI</span>
      <span class="result-value">₹${fmtNum(emi)}</span>
    </div>
    <div class="result-grid">
      <div><span class="rg-label">Loan Amount</span><span class="rg-value">₹${fmtNum(loan)}</span></div>
      <div><span class="rg-label">Total Interest</span><span class="rg-value">₹${fmtNum(totalInterest)}</span></div>
      <div><span class="rg-label">Total Payment</span><span class="rg-value">₹${fmtNum(totalPay)}</span></div>
    </div>
    <div class="emi-bar">
      <div class="emi-bar-principal" style="width:${(loan / totalPay * 100).toFixed(1)}%">Principal</div>
      <div class="emi-bar-interest">Interest</div>
    </div>
    <a href="${waShareEMI(price, rate, years, emi)}" target="_blank" rel="noopener" class="wa-share-btn-full">
      <svg viewBox="0 0 24 24" class="wa-icon-sm"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Z"/></svg>
      Share EMI on WhatsApp
    </a>`
}

// ---------------------------------------------------------------------------
// SCREEN: STAMP DUTY CALCULATOR
// ---------------------------------------------------------------------------
function screenStampDuty() {
  const states = Object.keys(STAMP_DUTY_RATES)
  return h`
  <div class="screen-content" data-screen="stamp-duty">
    <div class="section">
      <h1 class="tool-title">📋 Stamp Duty Calculator</h1>
      <p class="tool-sub">Know the exact stamp duty & registration charges before you buy.</p>

      <div class="calc-card">
        <div class="calc-field">
          <label>State</label>
          <select id="sd-state" onchange="window._hn.recalcSD()">
            ${states.map(s => h`<option value="${esc(s)}">${esc(s)}</option>`).join('')}
          </select>
        </div>
        <div class="calc-field">
          <label>Property Value (₹)</label>
          <input type="number" id="sd-price" value="7500000" min="100000" step="100000" oninput="window._hn.recalcSD()" />
          <input type="range" id="sd-price-range" min="1000000" max="100000000" step="500000" value="7500000" oninput="$('#sd-price').value=this.value;window._hn.recalcSD()" />
        </div>
        <div class="calc-field">
          <label>Buyer Gender</label>
          <div class="radio-group">
            <label class="radio"><input type="radio" name="sd-gender" value="male" checked onchange="window._hn.recalcSD()" /> Male</label>
            <label class="radio"><input type="radio" name="sd-gender" value="female" onchange="window._hn.recalcSD()" /> Female</label>
            <label class="radio"><input type="radio" name="sd-gender" value="joint" onchange="window._hn.recalcSD()" /> Joint</label>
          </div>
        </div>
      </div>

      <div class="calc-result" id="sd-result"></div>

      <div class="section" style="margin-top:28px">
        <h2 class="section-title">Stamp Duty Rates by State</h2>
        <div class="rates-table">
          <div class="rate-row rate-header">
            <span>State</span><span>Male</span><span>Female</span><span>Reg.</span>
          </div>
          ${states.map(s => {
            const r = STAMP_DUTY_RATES[s]
            return h`
            <div class="rate-row">
              <span class="rate-bank">${esc(s)}</span>
              <span>${r.male}%</span>
              <span>${r.female}%</span>
              <span>${r.reg}%</span>
            </div>`
          }).join('')}
        </div>
      </div>
    </div>
  </div>`
}

function recalcSD() {
  const state = $('#sd-state')?.value || 'Karnataka'
  const price = parseFloat($('#sd-price')?.value) || 0
  const gender = document.querySelector('input[name="sd-gender"]:checked')?.value || 'male'
  const rates = STAMP_DUTY_RATES[state]
  if (!rates) return

  const sdRate = rates[gender] + (rates.cess || 0)
  const regRate = rates.reg
  const stampDuty = price * sdRate / 100
  const regCharges = price * regRate / 100
  const total = stampDuty + regCharges

  const el = $('#sd-result')
  if (!el) return

  el.innerHTML = h`
    <div class="result-big">
      <span class="result-label">Total Extra Cost</span>
      <span class="result-value">₹${fmtNum(total)}</span>
    </div>
    <div class="result-grid">
      <div><span class="rg-label">Stamp Duty (${sdRate}%)</span><span class="rg-value">₹${fmtNum(stampDuty)}</span></div>
      <div><span class="rg-label">Registration (${regRate}%)</span><span class="rg-value">₹${fmtNum(regCharges)}</span></div>
      <div><span class="rg-label">Property Value</span><span class="rg-value">₹${fmtNum(price)}</span></div>
    </div>
    <p class="sd-tip">💡 Tip: In ${esc(state)}, female buyers ${rates.female < rates.male ? 'save ' + (rates.male - rates.female) + '% on stamp duty!' : 'pay the same rate as male buyers.'}</p>
    <a href="${waShareStampDuty(state, price, stampDuty, regCharges)}" target="_blank" rel="noopener" class="wa-share-btn-full">
      <svg viewBox="0 0 24 24" class="wa-icon-sm"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Z"/></svg>
      Share on WhatsApp
    </a>`
}

// ---------------------------------------------------------------------------
// SCREEN: AREA GUIDES
// ---------------------------------------------------------------------------
function screenAreas() {
  const areas = Object.entries(AREA_GUIDES)
  return h`
  <div class="screen-content" data-screen="areas">
    <div class="section">
      <h1 class="tool-title">📍 Area Guides</h1>
      <p class="tool-sub">Price trends, connectivity, schools & hospitals for popular localities.</p>

      <div class="area-cards">
        ${areas.map(([name, g]) => h`
          <div class="area-card">
            <h3>${esc(name)}</h3>
            <p class="area-vibe">${esc(g.vibe)}</p>
            <div class="area-stats">
              <div><span class="as-label">Avg Price</span><span class="as-value">${esc(g.avgPrice)}</span></div>
              <div><span class="as-label">Trend</span><span class="as-value trend-up">${esc(g.trend)}</span></div>
              <div><span class="as-label">Metro</span><span class="as-value">${esc(g.metro)}</span></div>
            </div>
            <div class="area-details">
              <p><strong>Schools:</strong> ${esc(g.schools)}</p>
              <p><strong>Hospitals:</strong> ${esc(g.hospitals)}</p>
            </div>
            <div class="area-actions">
              <button class="btn-outline" onclick="window._hn.searchLocality('${esc(name)}')">View Properties →</button>
              <a href="https://wa.me/?text=${encodeURIComponent(`📍 Area Guide: ${name}\n\nAvg Price: ${g.avgPrice}\nTrend: ${g.trend}\n${g.vibe}\n\nExplore more → ${SITE_URL}#areas`)}" target="_blank" rel="noopener" class="wa-share-btn">
                <svg viewBox="0 0 24 24" class="wa-icon-sm"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Z"/></svg>
                Share
              </a>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>`
}

// ---------------------------------------------------------------------------
// SCREEN: COMPARE
// ---------------------------------------------------------------------------
function screenCompare(idsStr) {
  const ids = idsStr ? idsStr.split(',') : compareList
  const props = ids.map(id => PROPERTIES.find(p => p.id === id)).filter(Boolean)

  if (props.length < 2) {
    return h`
    <div class="screen-content" data-screen="compare">
      <div class="section" style="text-align:center;padding-top:60px">
        <span style="font-size:48px">⚖️</span>
        <h1 style="margin-top:16px">Compare Properties</h1>
        <p class="tool-sub">Select 2–4 properties from search results to compare side by side.</p>
        <button class="btn-primary" onclick="window._hn.nav('search')" style="margin-top:20px">Browse Properties →</button>
      </div>
    </div>`
  }

  return h`
  <div class="screen-content" data-screen="compare">
    <div class="section">
      <div class="flex between items-center" style="flex-wrap:wrap;gap:12px">
        <div>
          <h1 class="tool-title" style="margin-bottom:4px">⚖️ Property Comparison</h1>
          <p class="tool-sub">Comparing ${props.length} properties side by side</p>
        </div>
        <a href="${waShareComparison(ids)}" target="_blank" rel="noopener" class="wa-share-btn-lg">
          <svg viewBox="0 0 24 24" class="wa-icon-sm"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Z"/></svg>
          Share Comparison
        </a>
      </div>

      <div class="compare-table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th></th>
              ${props.map(p => h`<th><div class="ct-head">${p.img}<br>${esc(p.title)}</div></th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr><td>Price</td>${props.map(p => h`<td class="ct-price">${esc(p.priceLabel)}</td>`).join('')}</tr>
            <tr><td>EMI/mo</td>${props.map(p => h`<td>₹${fmtNum(calcEMI(p.price * 0.8, 8.5, 20))}</td>`).join('')}</tr>
            <tr><td>Config</td>${props.map(p => h`<td>${esc(p.bhk)}</td>`).join('')}</tr>
            <tr><td>Area</td>${props.map(p => h`<td>${p.area} sq.ft</td>`).join('')}</tr>
            <tr><td>₹/sq.ft</td>${props.map(p => h`<td>₹${fmtNum(p.price / p.area)}</td>`).join('')}</tr>
            <tr><td>Location</td>${props.map(p => h`<td>${esc(p.locality)}, ${esc(p.city)}</td>`).join('')}</tr>
            <tr><td>Builder</td>${props.map(p => h`<td>${esc(p.builder)}</td>`).join('')}</tr>
            <tr><td>Status</td>${props.map(p => h`<td>${p.status === 'ready' ? '✅ Ready' : '🏗️ UC'}</td>`).join('')}</tr>
            <tr><td>RERA</td>${props.map(p => h`<td>${p.rera ? '✓' : '—'}</td>`).join('')}</tr>
            <tr><td>Floor</td>${props.map(p => h`<td>${esc(p.floors)}</td>`).join('')}</tr>
            <tr><td>Facing</td>${props.map(p => h`<td>${esc(p.facing)}</td>`).join('')}</tr>
            <tr><td>Parking</td>${props.map(p => h`<td>${p.parking}</td>`).join('')}</tr>
            <tr><td>Year</td>${props.map(p => h`<td>${p.yearBuilt}</td>`).join('')}</tr>
          </tbody>
        </table>
      </div>

      <div class="compare-cta">
        <a href="${waShareComparison(ids)}" target="_blank" rel="noopener" class="wa-family-btn">
          👨‍👩‍👧‍👦 Share comparison with family on WhatsApp
        </a>
      </div>
    </div>
  </div>`
}

// ---------------------------------------------------------------------------
// SCREEN: FAVORITES (local, no login)
// ---------------------------------------------------------------------------
function screenFavorites() {
  const props = favorites.map(id => PROPERTIES.find(p => p.id === id)).filter(Boolean)
  return h`
  <div class="screen-content" data-screen="favorites">
    <div class="section">
      <h1 class="tool-title">❤️ Saved Properties</h1>
      <p class="tool-sub">${props.length ? `${props.length} saved properties (stored in your browser)` : 'No saved properties yet. Browse and tap ❤️ to save.'}</p>

      ${props.length ? h`
        <div class="property-grid">
          ${props.map(p => propertyCard(p)).join('')}
        </div>
        <div style="margin-top:20px;text-align:center">
          <a href="${waShareComparison(favorites)}" target="_blank" rel="noopener" class="wa-share-btn-full" style="display:inline-flex">
            <svg viewBox="0 0 24 24" class="wa-icon-sm"><path d="M12 2.2C6.6 2.2 2.2 6.4 2.2 11.6c0 1.9.6 3.7 1.6 5.2L2.4 21l4.4-1.3c1.5.9 3.3 1.4 5.2 1.4 5.4 0 9.8-4.2 9.8-9.4S17.4 2.2 12 2.2Z"/></svg>
            Share all saved on WhatsApp
          </a>
        </div>
      ` : h`
        <div class="empty-state">
          <span class="empty-icon">🏠</span>
          <p>Browse properties and tap the heart to save them here.</p>
          <button class="btn-primary" onclick="window._hn.nav('search')" style="margin-top:16px">Browse Properties →</button>
        </div>
      `}
    </div>
  </div>`
}

// ---------------------------------------------------------------------------
// EMBEDDABLE WIDGET GENERATOR
// ---------------------------------------------------------------------------
function screenWidget() {
  const code = `<!-- HomeNex Property Rates Widget -->
<div id="homenex-widget" style="max-width:400px;font-family:sans-serif"></div>
<script>
(function(){
  var d=document,s=d.createElement('script');
  s.src='${SITE_URL}/widget.js';
  s.async=true;
  d.getElementById('homenex-widget').appendChild(s);
})();
</script>`

  return h`
  <div class="screen-content" data-screen="widget">
    <div class="section">
      <h1 class="tool-title">🔌 Embed Property Widget</h1>
      <p class="tool-sub">Add live property rates to your blog or portal. Free.</p>

      <div class="widget-preview">
        <div class="widget-demo">
          <div class="widget-demo-header">
            <span>🏡</span> Property Rates · Whitefield, Bengaluru
          </div>
          <div class="widget-demo-body">
            <div class="wd-row"><span>Brigade Cornerstone</span><span>₹78L</span></div>
            <div class="wd-row"><span>Prestige Lakeside</span><span>₹1.35Cr</span></div>
            <div class="wd-row"><span>Sobha Dream Acres</span><span>₹62L</span></div>
          </div>
          <div class="widget-demo-footer">
            Powered by <a href="${SITE_URL}">HomeNex</a> · Updated daily
          </div>
        </div>
      </div>

      <div class="calc-card" style="margin-top:20px">
        <label style="font-weight:700;font-size:13px;color:var(--ink)">Embed Code</label>
        <textarea class="embed-code" id="widget-code" readonly rows="6">${esc(code)}</textarea>
        <button class="btn-primary" style="margin-top:12px" onclick="navigator.clipboard?.writeText(document.getElementById('widget-code').value);this.textContent='Copied!';setTimeout(()=>this.textContent='Copy Embed Code',2000)">Copy Embed Code</button>
      </div>
    </div>
  </div>`
}

// ---------------------------------------------------------------------------
// NAVBAR + FOOTER
// ---------------------------------------------------------------------------
function navbar() {
  return h`
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a class="nav-brand" href="#home" onclick="window._hn.nav('home')">
        <span class="nav-logo">🏡</span>
        <span class="nav-name">HomeNex</span>
      </a>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-links" id="nav-links">
        <a href="#search" onclick="window._hn.nav('search')">Properties</a>
        <a href="#emi" onclick="window._hn.nav('emi')">EMI Calculator</a>
        <a href="#stamp-duty" onclick="window._hn.nav('stamp-duty')">Stamp Duty</a>
        <a href="#areas" onclick="window._hn.nav('areas')">Area Guides</a>
        <a href="#favorites" onclick="window._hn.nav('favorites')" class="nav-fav">❤️ <span id="fav-count">${favorites.length || ''}</span></a>
      </div>
    </div>
  </nav>`
}

function footer() {
  return h`
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span>🏡</span> HomeNex
        <p>Smart property search for Indian home buyers. 100% free, no login needed.</p>
      </div>
      <div class="footer-links">
        <div>
          <h4>Tools</h4>
          <a href="#emi">EMI Calculator</a>
          <a href="#stamp-duty">Stamp Duty Calculator</a>
          <a href="#areas">Area Guides</a>
          <a href="#widget">Embed Widget</a>
        </div>
        <div>
          <h4>Cities</h4>
          ${CITIES.map(c => h`<a href="#search" onclick="window._hn.setCity('${esc(c)}')">${esc(c)}</a>`).join('')}
        </div>
      </div>
      <div class="footer-bottom">
        <p>Made with ❤️ for Indian home buyers · <a href="https://doaide.com" target="_blank" rel="noopener">DoAide</a></p>
      </div>
    </div>
  </footer>`
}

// ---------------------------------------------------------------------------
// RENDER ENGINE
// ---------------------------------------------------------------------------
function renderScreen(screen, param) {
  currentScreen = screen
  let content = ''

  switch (screen) {
    case 'home': content = screenHome(); break
    case 'search': content = screenSearch(); break
    case 'property': content = screenProperty(param); break
    case 'emi': content = screenEMI(); break
    case 'stamp-duty': content = screenStampDuty(); break
    case 'areas': content = screenAreas(); break
    case 'compare': content = screenCompare(param); break
    case 'favorites': content = screenFavorites(); break
    case 'widget': content = screenWidget(); break
    default: content = screenHome(); screen = 'home'
  }

  const app = $('#app')
  app.innerHTML = navbar() + `<main id="main">${content}</main>` + footer()

  // Update active nav
  $$('.nav-links a').forEach(a => {
    const href = a.getAttribute('href')?.replace('#', '')
    a.classList.toggle('active', href === screen)
  })

  // Update fav count
  const favCount = $('#fav-count')
  if (favCount) favCount.textContent = favorites.length || ''

  // Hamburger
  const hamburger = $('#hamburger')
  const navLinks = $('#nav-links')
  if (hamburger) {
    hamburger.onclick = () => {
      navLinks.classList.toggle('open')
      hamburger.classList.toggle('open')
    }
  }

  // Scroll to top
  window.scrollTo(0, 0)

  // Post-render calculators
  if (screen === 'emi') setTimeout(recalcEMI, 0)
  if (screen === 'stamp-duty') setTimeout(recalcSD, 0)

  // Track page view with Umami
  if (typeof umami !== 'undefined') {
    try { umami.track(props => ({ ...props, url: `/${screen}${param ? '/' + param : ''}` })) } catch {}
  }
}

// ---------------------------------------------------------------------------
// GLOBAL API (called from inline handlers)
// ---------------------------------------------------------------------------
window._hn = {
  nav: (target) => navigate(target.split('/')[0], target.split('/').slice(1).join('/')),
  search: () => {
    const city = $('#city-select')?.value
    if (city) selectedCity = city
    navigate('search')
  },
  setCity: (c) => { selectedCity = c; renderScreen('search') },
  setBhk: (v) => { filters.bhk = v; renderScreen('search') },
  setPrice: (v) => {
    const [min, max] = v.split('-').map(Number)
    filters.priceMin = min || 0
    filters.priceMax = max === Infinity || isNaN(max) ? Infinity : max
    renderScreen('search')
  },
  setStatus: (v) => { filters.status = v; renderScreen('search') },
  fav: toggleFav,
  compare: toggleCompare,
  recalcEMI: recalcEMI,
  recalcSD: recalcSD,
  searchLocality: (name) => {
    const prop = PROPERTIES.find(p => p.locality === name)
    if (prop) selectedCity = prop.city
    navigate('search')
  },
}

// Make $ global for inline oninput handlers
window.$ = $

// ---------------------------------------------------------------------------
// BOOT
// ---------------------------------------------------------------------------
function boot() {
  const { screen, param } = parseHash()
  renderScreen(screen || 'home', param)
}

boot()
