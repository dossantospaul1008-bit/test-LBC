/* =====================================================
   Source de données locale + persistance navigateur
   ===================================================== */
const ADS_STORAGE_KEY = "la_bonne_seed_ads_v2";
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=900&q=80";

const DEFAULT_ADS = [
  {
    id: "ad-1",
    title: "Pack découverte féminisées",
    shortDescription: "Lot de 5 références pour collectionneurs.",
    description:
      "Pack complet avec 5 variétés différentes. Conservation à sec, emballages scellés et étiquetés.",
    price: 35,
    category: "Feminisées",
    dealType: "Vente",
    seller: "GreenCollector75",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
    createdAt: Date.now() - 100000,
  },
  {
    id: "ad-2",
    title: "Auto mix premium",
    shortDescription: "Série auto en édition limitée.",
    description:
      "Collection de graines auto premium, stock limité. Idéal pour les passionnés qui recherchent des références rares.",
    price: 42,
    category: "Auto",
    dealType: "Vente",
    seller: "SeedSwapLyon",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80",
    createdAt: Date.now() - 90000,
  },
  {
    id: "ad-3",
    title: "Regular vintage 2018",
    shortDescription: "Série regular conservée en sachets origine.",
    description:
      "Série de collection regular millésime 2018. Provenance vérifiée, conservation stable, lot jamais ouvert.",
    price: 28,
    category: "Regular",
    dealType: "Echange",
    seller: "VintageGrower",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    createdAt: Date.now() - 80000,
  },
  {
    id: "ad-4",
    title: "Mega packs collection",
    shortDescription: "Packs multi-catégories pour échanges.",
    description:
      "Sélection de packs multi-catégories orientée échange entre particuliers. Détails du contenu sur demande.",
    price: 55,
    category: "Packs",
    dealType: "Vente",
    seller: "UrbanSeedMarket",
    image: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80",
    createdAt: Date.now() - 70000,
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
    return Array.isArray(parsed) ? parsed : [...DEFAULT_ADS];
  } catch {
    return [...DEFAULT_ADS];
  }
}

function saveAds(ads) {
  localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(ads));
}

/* =====================================================
   Helpers de rendu
   ===================================================== */
function adCardTemplate(ad) {
  return `
    <article class="ad-card">
      <img class="ad-thumb" src="${ad.image || PLACEHOLDER_IMAGE}" alt="Image de l'annonce ${escapeHtml(ad.title)}" loading="lazy" />
      <div class="badges-row">
        <span class="pill">${escapeHtml(ad.category)}</span>
        <span class="pill pill-soft">${escapeHtml(ad.dealType)}</span>
      </div>
      <h3>${escapeHtml(ad.title)}</h3>
      <p>${escapeHtml(ad.shortDescription)}</p>
      <p class="price">${ad.price} €</p>
      <a class="card-link" href="detail-annonce.html?id=${encodeURIComponent(ad.id)}">Voir annonce</a>
    </article>
  `;
}

function escapeHtml(value) {
  const span = document.createElement("span");
  span.textContent = value;
  return span.innerHTML;
}

/* =====================================================
   Page index.html : annonces vedette
   ===================================================== */
function initHomepage() {
  const featuredGrid = document.querySelector("#featured-grid");
  if (!featuredGrid) return;

  const ads = getAds()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 4);
  featuredGrid.innerHTML = ads.map(adCardTemplate).join("");
}

/* =====================================================
   Page annonces.html : filtres et tri dynamiques
   ===================================================== */
function initListingsPage() {
  const grid = document.querySelector("#ads-grid");
  if (!grid) return;

  const searchInput = document.querySelector("#search-input");
  const categoryFilter = document.querySelector("#category-filter");
  const listingTypeFilter = document.querySelector("#listing-type-filter");
  const minPriceFilter = document.querySelector("#min-price-filter");
  const maxPriceFilter = document.querySelector("#max-price-filter");
  const sortFilter = document.querySelector("#sort-filter");
  const clearBtn = document.querySelector("#clear-filters");
  const resultsCount = document.querySelector("#results-count");
  const emptyMessage = document.querySelector("#empty-message");

  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get("q") || "";
  const initialCategory = urlParams.get("type") || "";

  searchInput.value = initialSearch;
  categoryFilter.value = initialCategory;

  function render() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedDealType = listingTypeFilter.value;
    const minPrice = minPriceFilter.value ? Number(minPriceFilter.value) : 0;
    const maxPrice = maxPriceFilter.value ? Number(maxPriceFilter.value) : Infinity;
    const selectedSort = sortFilter.value;

    let filtered = getAds().filter((ad) => {
      const inQuery =
        ad.title.toLowerCase().includes(query) ||
        ad.shortDescription.toLowerCase().includes(query) ||
        ad.seller.toLowerCase().includes(query);
      const inCategory = selectedCategory === "" || ad.category === selectedCategory;
      const inDealType = selectedDealType === "" || ad.dealType === selectedDealType;
      const inPriceRange = ad.price >= minPrice && ad.price <= maxPrice;
      return inQuery && inCategory && inDealType && inPriceRange;
    });

    if (selectedSort === "price-asc") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price-desc") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered = filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    grid.innerHTML = filtered.map(adCardTemplate).join("");
    resultsCount.textContent = `${filtered.length} annonce${filtered.length > 1 ? "s" : ""}`;
    emptyMessage.hidden = filtered.length !== 0;
  }

  [searchInput, categoryFilter, listingTypeFilter, minPriceFilter, maxPriceFilter, sortFilter].forEach((element) => {
    const eventName = element.tagName === "INPUT" ? "input" : "change";
    element.addEventListener(eventName, render);
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    listingTypeFilter.value = "";
    minPriceFilter.value = "";
    maxPriceFilter.value = "";
    sortFilter.value = "recent";
    render();
  });

  render();
}

/* =====================================================
   Page detail-annonce.html : détail d'une annonce
   ===================================================== */
function initDetailPage() {
  const wrapper = document.querySelector("#detail-wrapper");
  if (!wrapper) return;

  const empty = document.querySelector("#detail-empty");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const ad = getAds().find((item) => item.id === id);

  if (!ad) {
    wrapper.innerHTML = "";
    empty.hidden = false;
    return;
  }

  wrapper.innerHTML = `
    <article>
      <img class="detail-image" src="${ad.image || PLACEHOLDER_IMAGE}" alt="Image principale de ${escapeHtml(ad.title)}" />
    </article>
    <article class="detail-panel">
      <div class="badges-row">
        <span class="pill">${escapeHtml(ad.category)}</span>
        <span class="pill pill-soft">${escapeHtml(ad.dealType)}</span>
      </div>
      <h1>${escapeHtml(ad.title)}</h1>
      <p>${escapeHtml(ad.description)}</p>
      <p class="price">Prix : ${ad.price} €</p>
      <p><strong>Vendeur :</strong> ${escapeHtml(ad.seller)}</p>
      <a class="contact-btn card-link" href="mailto:contact@labonneseed.local?subject=Annonce%20${encodeURIComponent(ad.title)}">Contacter vendeur</a>
    </article>
  `;
}

/* =====================================================
   Page poster-annonce.html : création d'annonce
   ===================================================== */
function initPostFormPage() {
  const form = document.querySelector("#post-form");
  if (!form) return;

  const imageInput = document.querySelector("#image-input");
  const imagePreview = document.querySelector("#image-preview");
  const feedback = document.querySelector("#form-feedback");

  let uploadedImageBase64 = "";

  imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (!file) {
      uploadedImageBase64 = "";
      imagePreview.hidden = true;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      uploadedImageBase64 = typeof reader.result === "string" ? reader.result : "";
      imagePreview.src = uploadedImageBase64;
      imagePreview.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.querySelector("#title-input").value.trim();
    const description = document.querySelector("#description-input").value.trim();
    const price = Number(document.querySelector("#price-input").value);
    const category = document.querySelector("#seed-type-input").value;
    const dealType = document.querySelector("#deal-type-input").value;
    const seller = document.querySelector("#seller-input").value.trim();

    if (!title || !description || !seller || Number.isNaN(price) || price < 0) {
      feedback.textContent = "Merci de vérifier les champs du formulaire.";
      return;
    }

    const ads = getAds();
    const newAd = {
      id: `ad-${Date.now()}`,
      title,
      shortDescription: description.slice(0, 80) + (description.length > 80 ? "..." : ""),
      description,
      price,
      category,
      dealType,
      seller,
      image: uploadedImageBase64 || PLACEHOLDER_IMAGE,
      createdAt: Date.now(),
    };

    ads.unshift(newAd);
    saveAds(ads);

    feedback.textContent = "Annonce publiée avec succès ✅";
    form.reset();
    imagePreview.hidden = true;
    uploadedImageBase64 = "";
  });
}

/* =====================================================
   Bootstrap principal
   ===================================================== */
initHomepage();
initListingsPage();
initDetailPage();
initPostFormPage();
