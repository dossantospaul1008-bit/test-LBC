const STORAGE_KEY = "grainotheque_listings_v2";
const DEFAULT_LISTINGS = [
  {
    id: crypto.randomUUID(),
    title: "Lot vintage • Variétés européennes",
    location: "Lyon",
    type: "vente",
    price: 25,
    description: "Collection scellée, millésime 2019, stockage sec.",
    createdAt: new Date().toISOString(),
    reports: 0,
  },
  {
    id: crypto.randomUUID(),
    title: "Échange collectionneurs • Série US",
    location: "Toulouse",
    type: "echange",
    price: 0,
    description: "Recherche lot équivalent ancien, uniquement collection.",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    reports: 0,
  },
  {
    id: crypto.randomUUID(),
    title: "Pack rare • Banque privée",
    location: "Nantes",
    type: "vente",
    price: 48,
    description: "4 sachets en édition limitée, état neuf.",
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    reports: 0,
  },
];

const grid = document.querySelector("#listings-grid");
const searchForm = document.querySelector("#search-form");
const publishForm = document.querySelector("#publish-form");
const count = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const feedback = document.querySelector("#form-feedback");
const resetFiltersBtn = document.querySelector("#reset-filters");
const clearLocalBtn = document.querySelector("#clear-local");

let listings = loadListings();

function loadListings() {
  const fromStorage = localStorage.getItem(STORAGE_KEY);
  if (!fromStorage) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LISTINGS));
    return [...DEFAULT_LISTINGS];
  }

  try {
    const parsed = JSON.parse(fromStorage);
    if (!Array.isArray(parsed)) throw new Error("Invalid storage shape");
    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LISTINGS));
    return [...DEFAULT_LISTINGS];
  }
}

function saveListings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

function render(items) {
  grid.innerHTML = "";

  if (items.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  items
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <h3>${escapeHtml(item.title)}</h3>
        <p class="meta">${escapeHtml(item.location)} • ${item.type === "vente" ? "Vente" : "Échange"}</p>
        <p class="price">${item.price > 0 ? `${item.price} €` : "Échange"}</p>
        <p>${escapeHtml(item.description)}</p>
        <p class="meta">Publiée le ${formatDate(item.createdAt)} • Signalements: ${item.reports}</p>
        <span class="tag">Collection</span>
        <div class="card-actions">
          <button class="small-btn alert" data-action="report" data-id="${item.id}" type="button">Signaler</button>
          <button class="small-btn" data-action="delete" data-id="${item.id}" type="button">Supprimer</button>
        </div>
      `;
      grid.append(card);
    });

  count.textContent = `${items.length} résultat${items.length > 1 ? "s" : ""}`;
}

function getFilters() {
  const keyword = document.querySelector("#keyword").value.toLowerCase().trim();
  const type = document.querySelector("#type").value;
  const city = document.querySelector("#city").value.toLowerCase().trim();
  const maxPriceInput = document.querySelector("#max-price").value;
  const maxPrice = maxPriceInput === "" ? Infinity : Number(maxPriceInput);

  return { keyword, type, city, maxPrice };
}

function applyFilters() {
  const { keyword, type, city, maxPrice } = getFilters();

  const filtered = listings.filter((item) => {
    const matchesKeyword =
      keyword.length === 0 ||
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);

    const matchesType = type === "all" || item.type === type;
    const matchesCity = city.length === 0 || item.location.toLowerCase().includes(city);
    const matchesPrice = item.price <= maxPrice;

    return matchesKeyword && matchesType && matchesCity && matchesPrice;
  });

  render(filtered);
}

function showFeedback(message, variant = "success") {
  feedback.textContent = message;
  feedback.classList.remove("hidden", "success", "error");
  feedback.classList.add(variant);
}

function hideFeedback() {
  feedback.classList.add("hidden");
  feedback.textContent = "";
  feedback.classList.remove("success", "error");
}

function escapeHtml(text) {
  const span = document.createElement("span");
  span.textContent = text;
  return span.innerHTML;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilters();
});

resetFiltersBtn.addEventListener("click", () => {
  searchForm.reset();
  applyFilters();
});

publishForm.addEventListener("submit", (event) => {
  event.preventDefault();
  hideFeedback();

  const title = document.querySelector("#new-title").value.trim();
  const location = document.querySelector("#new-location").value.trim();
  const type = document.querySelector("#new-type").value;
  const price = Number(document.querySelector("#new-price").value || 0);
  const description = document.querySelector("#new-description").value.trim();

  if (!title || !location || !description) {
    showFeedback("Merci de remplir tous les champs obligatoires.", "error");
    return;
  }

  if (price < 0) {
    showFeedback("Le prix ne peut pas être négatif.", "error");
    return;
  }

  if (type === "echange") {
    // For exchange, force a price of 0 for consistency.
    document.querySelector("#new-price").value = "0";
  }

  const newListing = {
    id: crypto.randomUUID(),
    title,
    location,
    type,
    price: type === "echange" ? 0 : price,
    description,
    createdAt: new Date().toISOString(),
    reports: 0,
  };

  listings.push(newListing);
  saveListings();
  publishForm.reset();
  applyFilters();
  showFeedback("Annonce publiée localement avec succès ✅", "success");
});

grid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;
  const id = target.dataset.id;

  if (!action || !id) return;

  const listingIndex = listings.findIndex((item) => item.id === id);
  if (listingIndex === -1) return;

  if (action === "report") {
    listings[listingIndex].reports += 1;
    saveListings();
    applyFilters();
    return;
  }

  if (action === "delete") {
    listings.splice(listingIndex, 1);
    saveListings();
    applyFilters();
  }
});

clearLocalBtn.addEventListener("click", () => {
  listings = [...DEFAULT_LISTINGS];
  saveListings();
  publishForm.reset();
  searchForm.reset();
  hideFeedback();
  applyFilters();
});

applyFilters();
