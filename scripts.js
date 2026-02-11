/* =====================================================
   Source de données locale + persistance navigateur
   ===================================================== */
const ADS_STORAGE_KEY = "la_bonne_seed_ads_v1";
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
    type: "Feminisées",
    seller: "GreenCollector75",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ad-2",
    title: "Auto mix premium",
    shortDescription: "Série auto en édition limitée.",
    description:
      "Collection de graines auto premium, stock limité. Idéal pour les passionnés qui recherchent des références rares.",
    price: 42,
    type: "Auto",
    seller: "SeedSwapLyon",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ad-3",
    title: "Regular vintage 2018",
    shortDescription: "Série regular conservée en sachets origine.",
    description:
      "Série de collection regular millésime 2018. Provenance vérifiée, conservation stable, lot jamais ouvert.",
    price: 28,
    type: "Regular",
    seller: "VintageGrower",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ad-4",
    title: "Mega packs collection",
    shortDescription: "Packs multi-catégories pour échanges.",
    description:
      "Sélection de packs multi-catégories orientée échange entre particuliers. Détails du contenu sur demande.",
    price: 55,
    type: "Packs",
    seller: "UrbanSeedMarket",
    image: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80",
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
      <span class="pill">${escapeHtml(ad.type)}</span>
      <h3>${escapeHtml(ad.title)}</h3>
      <p>${escapeHtml(ad.shortDescription)}</p>
      <p class="price">${ad.price} €</p>
      <a class="card-link" href="detail-annonce.html?id=${encodeURIComponent(ad.id)}">Voir l’annonce</a>
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

  const ads = getAds().slice(0, 4);
  featuredGrid.innerHTML = ads.map(adCardTemplate).join("");
}

/* =====================================================
   Page annonces.html : filtres et liste dynamique
   ===================================================== */
function initListingsPage() {
  const grid = document.querySelector("#ads-grid");
  if (!grid) return;

  const searchInput = document.querySelector("#search-input");
  const typeFilter = document.querySelector("#type-filter");
  const clearBtn = document.querySelector("#clear-filters");
  const resultsCount = document.querySelector("#results-count");
  const emptyMessage = document.querySelector("#empty-message");

  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get("q") || "";
  const initialType = urlParams.get("type") || "";

  searchInput.value = initialSearch;
  typeFilter.value = initialType;

  function render() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedType = typeFilter.value;
    const ads = getAds();

    const filtered = ads.filter((ad) => {
      const inQuery =
        ad.title.toLowerCase().includes(query) ||
        ad.shortDescription.toLowerCase().includes(query) ||
        ad.seller.toLowerCase().includes(query);
      const inType = selectedType === "" || ad.type === selectedType;
      return inQuery && inType;
    });

    grid.innerHTML = filtered.map(adCardTemplate).join("");
    resultsCount.textContent = `${filtered.length} annonce${filtered.length > 1 ? "s" : ""}`;
    emptyMessage.hidden = filtered.length !== 0;
  }

  searchInput.addEventListener("input", render);
  typeFilter.addEventListener("change", render);
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "";
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
      <span class="pill">${escapeHtml(ad.type)}</span>
      <h1>${escapeHtml(ad.title)}</h1>
      <p>${escapeHtml(ad.description)}</p>
      <p class="price">Prix : ${ad.price} €</p>
      <p><strong>Vendeur :</strong> ${escapeHtml(ad.seller)}</p>
      <a class="contact-btn card-link" href="mailto:contact@labonneseed.local?subject=Annonce%20${encodeURIComponent(ad.title)}">Contacter le vendeur</a>
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
    const type = document.querySelector("#seed-type-input").value;
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
      type,
      seller,
      image: uploadedImageBase64 || PLACEHOLDER_IMAGE,
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
