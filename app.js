const repo = "barmaiyadevu/madhya-taxi-site"
const listingsEl = document.getElementById('listings');
const addTaxiBtn = document.getElementById('addTaxiBtn');

// helper to create WhatsApp link
function waLink(number, text = "") {
  const cleaned = number.replace(/\D/g,'');
  const msg = encodeURIComponent(text || "Hello, I want to rent your taxi.");
  return `https://wa.me/${cleaned}?text=${msg}`;
}

async function loadTaxis() {
  try {
    const resp = await fetch('data/taxis.json', {cache: "no-store"});
    const taxis = await resp.json();
    // Featured first
    taxis.sort((a,b) => {
      if (a.isFeatured === b.isFeatured) return new Date(b.createdAt) - new Date(a.createdAt);
      return a.isFeatured ? -1 : 1;
    });
    renderTaxis(taxis);
  } catch (e) {
    listingsEl.innerHTML = "<p>Unable to load listings.</p>";
    console.error(e);
  }
}

function renderTaxis(taxis) {
  listingsEl.innerHTML = taxis.map(t => renderTaxi(t)).join("\n");
}

function renderTaxi(t) {
  const photo = (t.photos && t.photos[0]) ? t.photos[0] : 'https://via.placeholder.com/300x200?text=No+Image';
  const featuredClass = t.isFeatured ? 'card featured' : 'card';
  return `
    <article class="${featuredClass}">
      <img src="${photo}" alt="${escapeHtml(t.title)}" />
      <div class="meta">
        <h3>${escapeHtml(t.title)} ${t.isFeatured ? '<small>⭐ Featured</small>' : ''}</h3>
        <p>${escapeHtml(t.description || '')}</p>
        <p><strong>Type:</strong> ${escapeHtml(t.taxiType || '')} &nbsp;|&nbsp; <strong>Price/day:</strong> ${escapeHtml(t.pricePerDay || '-')}</p>
        <p><strong>Location:</strong> ${escapeHtml(t.location?.city || '')}, ${escapeHtml(t.location?.state || '')}</p>
        <div class="contact">
          ${t.whatsapp ? `<a href="${waLink(t.whatsapp,'Hi, I want to rent this taxi')}" target="_blank">WhatsApp</a>` : ''}
          ${t.phone ? `<a href="tel:${t.phone}">Call</a>` : ''}
          ${t.email ? `<a href="mailto:${t.email}">Email</a>` : ''}
        </div>
      </div>
    </article>
  `;
}

// small HTML escape
function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

// create a prefilled GitHub issue URL for submissions
function openPrefilledIssue() {
  // Issue title and body template
  const title = encodeURIComponent("New taxi listing: [City] - Taxi name");
  const body = encodeURIComponent(
`Please fill the details below and attach photos as image URLs (imgur/ibb/your-host).
---
**Title**: 
**Taxi Type**:
**Description**:
**Photos** (comma-separated URLs):
**WhatsApp**:
**Phone**:
**Email**:
**Owner Name**:
**City**:
**State**:
**PricePerDay**:
**Availability** (example: 2025-11-01 to 2025-11-10)
---
*Note: Submissions will be reviewed by the site owner before going live.*`
  );

  // Create the "new issue" link
  const url = `https://github.com/${repo}/issues/new?title=${title}&body=${body}`;
  window.open(url, '_blank');
}

addTaxiBtn.addEventListener('click', openPrefilledIssue);

// load on start
loadTaxis();

