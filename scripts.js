/* =====================================================
   Données locales des annonces (remplace les données statiques HTML)
   ===================================================== */
const ADS_STORAGE_KEY = "la_bonne_seed_ads_v3";
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=900&q=80";

const DEFAULT_ADS = [
  {
    id: "ad-1",
    title: "Pack Féminisées collector",
    description: "Pack premium en sachets scellés. Idéal collectionneurs.",
    price: 39,
    category: "Feminisées",
    seller: "GrowShopLyon",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
    createdAt: Date.now() - 90000,
  },
  {
    id: "ad-2",
    title: "Auto mix edition limitée",
    description: "Lot de références auto, très propre et bien conservé.",
    price: 29,
    category: "Auto",
    seller: "SeedCollector13",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80",
    createdAt: Date.now() - 70000,
  },
  {
    id: "ad-3",
    title: "Regular vintage 2019",
    description: "Série regular millésimée, emballage d'origine.",
    price: 24,
    category: "Regular",
    seller: "VintageSeeds",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    createdAt: Date.now() - 40000,
  },
  {
    id: "ad-4",
    title: "Packs découverte 4 variétés",
    description: "Lot de packs prêt à échanger ou vendre entre particuliers.",
    price: 49,
    category: "Packs",
    seller: "UrbanGrower",
    image: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80",
    createdAt: Date.now() - 20000,
  },
];

function getAds() {
  const raw = localStorage.getItem(ADS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(DEFAULT_ADS));
    return [...DEFAULT_ADS];
  }

  try {
    const parsed = JSON.parse(raw);
    // Si le stockage est vide/corrompu, on remet un jeu de données par défaut.
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(DEFAULT_ADS));
      return [...DEFAULT_ADS];
    }

    return parsed;
  } catch {
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(DEFAULT_ADS));
    return [...DEFAULT_ADS];
  }
}

function saveAds(ads) {
  localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(ads));
}

function escapeHtml(value) {
  const span = document.createElement("span");
  span.textContent = value;
  return span.innerHTML;
}

/* =====================================================
   Prompt #1 : génération carte annonce (image/titre/prix/bouton)
   ===================================================== */
function adCardTemplate(ad) {
  return `
    <article class="ad-card">
      <img class="ad-thumb" src="${ad.image || PLACEHOLDER_IMAGE}" alt="Image annonce ${escapeHtml(ad.title)}" loading="lazy" />
      <span class="pill">${escapeHtml(ad.category)}</span>
      <h3>${escapeHtml(ad.title)}</h3>
      <p>${escapeHtml(ad.description.slice(0, 70))}${ad.description.length > 70 ? "..." : ""}</p>
      <p class="price">${ad.price} €</p>
      <a class="card-link card-link-btn" href="detail-annonce.html?id=${encodeURIComponent(ad.id)}">Voir l’annonce</a>
    </article>
  `;
}

function initHomepage() {
  const featuredGrid = document.querySelector("#featured-grid");
  if (!featuredGrid) return;

  const ads = getAds()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 4);

  featuredGrid.innerHTML = ads.map(adCardTemplate).join("");
}

/* =====================================================
   Prompt #1 bis : filtres + tri dynamiques sur annonces.html
   ===================================================== */
function initListingsPage() {
  const grid = document.querySelector("#ads-grid");
  if (!grid) return;

  const searchInput = document.querySelector("#search-input");
  const categoryFilter = document.querySelector("#category-filter");
  const minPriceFilter = document.querySelector("#min-price-filter");
  const maxPriceFilter = document.querySelector("#max-price-filter");
  const sortFilter = document.querySelector("#sort-filter");
  const clearBtn = document.querySelector("#clear-filters");
  const resultsCount = document.querySelector("#results-count");
  const emptyMessage = document.querySelector("#empty-message");

  function render() {
    const query = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const minPrice = minPriceFilter.value === "" ? 0 : Number(minPriceFilter.value);
    const maxPrice = maxPriceFilter.value === "" ? Infinity : Number(maxPriceFilter.value);
    const sortValue = sortFilter.value;

    let ads = getAds().filter((ad) => {
      // Recherche en temps réel par titre ou catégorie.
      const matchText =
        ad.title.toLowerCase().includes(query) ||
        ad.category.toLowerCase().includes(query);
      const matchCategory = category === "" || ad.category === category;
      const matchPrice = ad.price >= minPrice && ad.price <= maxPrice;
      return matchText && matchCategory && matchPrice;
    });

    if (sortValue === "price-asc") {
      ads = ads.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-desc") {
      ads = ads.sort((a, b) => b.price - a.price);
    } else {
      ads = ads.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    grid.innerHTML = ads.map(adCardTemplate).join("");
    resultsCount.textContent = `${ads.length} annonce${ads.length > 1 ? "s" : ""}`;
    emptyMessage.hidden = ads.length !== 0;
  }

  [searchInput, categoryFilter, minPriceFilter, maxPriceFilter, sortFilter].forEach((element) => {
    const eventType = element.tagName === "INPUT" ? "input" : "change";
    element.addEventListener(eventType, render);
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    minPriceFilter.value = "";
    maxPriceFilter.value = "";
    sortFilter.value = "recent";
    render();
  });

  render();
}

/* =====================================================
   Prompt #2 : page detail-annonce.html
   ===================================================== */
function initDetailPage() {
  const wrapper = document.querySelector("#detail-wrapper");
  if (!wrapper) return;

  const detailEmpty = document.querySelector("#detail-empty");
  const params = new URLSearchParams(window.location.search);
  const adId = params.get("id");

  const ad = getAds().find((item) => item.id === adId);
  if (!ad) {
    detailEmpty.hidden = false;
    wrapper.innerHTML = "";
    return;
  }

  wrapper.innerHTML = `
    <article>
      <img class="detail-image" src="${ad.image || PLACEHOLDER_IMAGE}" alt="Image principale ${escapeHtml(ad.title)}" />
    </article>
    <article class="detail-panel">
      <span class="pill">${escapeHtml(ad.category)}</span>
      <h1>${escapeHtml(ad.title)}</h1>
      <p class="price">Prix : ${ad.price} €</p>
      <p>${escapeHtml(ad.description)}</p>
      <p><strong>Catégorie :</strong> ${escapeHtml(ad.category)}</p>
      <p><strong>Vendeur :</strong> ${escapeHtml(ad.seller)}</p>
      <a class="card-link contact-btn" href="mailto:contact@labonneseed.local?subject=Annonce%20${encodeURIComponent(ad.title)}">Contacter le vendeur</a>
    </article>
  `;
}

/* =====================================================
   Prompt #3 : formulaire poster-annonce + validation JS
   ===================================================== */
function initPostFormPage() {
  const form = document.querySelector("#post-form");
  if (!form) return;

  const imageUrlInput = document.querySelector("#image-url-input");
  const imagePreview = document.querySelector("#image-preview");
  const feedback = document.querySelector("#form-feedback");

  function isValidImageUrl(url) {
    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i.test(url);
  }

  imageUrlInput.addEventListener("input", () => {
    const imageUrl = imageUrlInput.value.trim();

    if (!imageUrl || !isValidImageUrl(imageUrl)) {
      imagePreview.hidden = true;
      imagePreview.removeAttribute("src");
      return;
    }

    imagePreview.src = imageUrl;
    imagePreview.hidden = false;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const imageUrl = imageUrlInput.value.trim();
    const title = document.querySelector("#title-input").value.trim();
    const description = document.querySelector("#description-input").value.trim();
    const price = Number(document.querySelector("#price-input").value);
    const category = document.querySelector("#seed-type-input").value;

    if (!imageUrl || !title || !description || Number.isNaN(price) || price < 0) {
      feedback.textContent = "Merci de remplir correctement tous les champs obligatoires.";
      return;
    }

    if (!isValidImageUrl(imageUrl)) {
      feedback.textContent = "Merci de renseigner une URL d'image valide (jpg, png, webp, gif, avif).";
      return;
    }

    const ads = getAds();
    ads.unshift({
      id: `ad-${Date.now()}`,
      title,
      description,
      price,
      category,
      seller: "Particulier",
      image: imageUrl,
      createdAt: Date.now(),
    });

    saveAds(ads);
    form.reset();
    imagePreview.hidden = true;
    imagePreview.removeAttribute("src");
    feedback.textContent = "Annonce publiée ✅";
  });
}

initHomepage();
initListingsPage();
initDetailPage();
initPostFormPage();
