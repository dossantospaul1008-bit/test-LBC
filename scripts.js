/*
  Configuration Supabase + PayPal.
  Priorité: window.APP_CONFIG (config.js) -> placeholders fallback.
*/
const APP_CONFIG = window.APP_CONFIG || {};
const SUPABASE_URL = APP_CONFIG.supabaseUrl || "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = APP_CONFIG.supabaseAnonKey || "YOUR_SUPABASE_ANON_KEY";
const PAYPAL_CLIENT_ID = APP_CONFIG.paypalClientId || "YOUR_PAYPAL_CLIENT_ID";
const supabase =
  window.supabase && SUPABASE_URL.startsWith("http")
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const FALLBACK_ADS = [
  {
    id: "demo-1",
    title: "Pack découverte collector",
    description: "Pack complet pour collectionneurs.",
    price: 49,
    category: "Packs",
    image_url: "https://via.placeholder.com/800x500?text=Annonce+1",
    seller_name: "Alice Demo",
    seller_id: "demo-user",
    created_at: new Date().toISOString(),
  },
];

function ensurePaypalSdk() {
  if (window.paypal || PAYPAL_CLIENT_ID === "YOUR_PAYPAL_CLIENT_ID") return;

  const script = document.createElement("script");
  script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(PAYPAL_CLIENT_ID)}&currency=EUR`;
  script.async = true;
  document.head.appendChild(script);
}

function currency(v) {
  return `${Number(v).toFixed(2)} €`;
}

function adCardTemplate(ad) {
  return `
    <article class="ad-card">
      <img class="ad-thumb" src="${ad.image_url}" alt="${ad.title}" loading="lazy" />
      <span class="pill">${ad.category}</span>
      <h3>${ad.title}</h3>
      <p>${ad.description.slice(0, 80)}${ad.description.length > 80 ? "..." : ""}</p>
      <p class="price">${currency(ad.price)}</p>
      <a class="card-link card-link-btn" href="detail-annonce.html?id=${ad.id}">Voir l'annonce</a>
    </article>
  `;
}

async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

async function loadListings() {
  if (!supabase) return FALLBACK_ADS;
  const { data, error } = await supabase
    .from("listings")
    .select("id,title,description,price,category,image_url,seller_id,created_at,profiles!listings_seller_id_fkey(display_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return FALLBACK_ADS;
  }

  return data.map((item) => ({
    ...item,
    seller_name: item.profiles?.display_name || "Vendeur",
  }));
}

function mountPaypalButton(selector, amount) {
  if (!window.paypal || !document.querySelector(selector)) return;
  window.paypal
    .Buttons({
      createOrder: (_data, actions) =>
        actions.order.create({
          purchase_units: [{ amount: { value: Number(amount).toFixed(2) } }],
        }),
      onApprove: async (_data, actions) => {
        await actions.order.capture();
        alert("Paiement validé ✅");
      },
    })
    .render(selector)
    .catch((err) => console.warn("PayPal indisponible:", err.message));
}

function setupFilters(allAds, renderFn) {
  const searchInput = document.querySelector("#search-input");
  const categoryFilter = document.querySelector("#category-filter");
  const minPriceFilter = document.querySelector("#min-price-filter");
  const maxPriceFilter = document.querySelector("#max-price-filter");
  const sortFilter = document.querySelector("#sort-filter");
  const clearBtn = document.querySelector("#clear-filters");

  if (!searchInput) return;

  const apply = () => {
    const q = searchInput.value.trim().toLowerCase();
    const c = categoryFilter.value;
    const min = minPriceFilter.value ? Number(minPriceFilter.value) : 0;
    const max = maxPriceFilter.value ? Number(maxPriceFilter.value) : Number.POSITIVE_INFINITY;

    let ads = allAds.filter((ad) => {
      const mText = ad.title.toLowerCase().includes(q) || ad.category.toLowerCase().includes(q);
      const mCat = !c || ad.category === c;
      const mPrice = Number(ad.price) >= min && Number(ad.price) <= max;
      return mText && mCat && mPrice;
    });

    if (sortFilter.value === "price-asc") ads.sort((a, b) => a.price - b.price);
    else if (sortFilter.value === "price-desc") ads.sort((a, b) => b.price - a.price);

    renderFn(ads);
  };

  [searchInput, categoryFilter, minPriceFilter, maxPriceFilter, sortFilter].forEach((el) => {
    el.addEventListener(el.tagName === "INPUT" ? "input" : "change", apply);
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    minPriceFilter.value = "";
    maxPriceFilter.value = "";
    sortFilter.value = "recent";
    apply();
  });

  apply();
}

async function initAuth() {
  const signupForm = document.querySelector("#signup-form");
  const loginForm = document.querySelector("#login-form");
  const logoutBtn = document.querySelector("#logout-btn");
  const authStatus = document.querySelector("#auth-status");
  if (!authStatus) return;

  if (!supabase) {
    authStatus.textContent = "Supabase non configuré (mode démo local).";
    return;
  }

  const updateStatus = async () => {
    const session = await getSession();
    authStatus.textContent = session?.user?.email
      ? `Connecté: ${session.user.email}`
      : "Non connecté.";
  };

  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.querySelector("#signup-email").value;
    const password = document.querySelector("#signup-password").value;
    const displayName = document.querySelector("#signup-display-name").value;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);

    if (data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, display_name: displayName });
      alert("Compte créé, vérifiez votre email si confirmation activée.");
    }
    updateStatus();
  });

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    updateStatus();
  });

  logoutBtn?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    updateStatus();
  });

  supabase.auth.onAuthStateChange(() => updateStatus());
  updateStatus();
}

async function initHomepage() {
  const grid = document.querySelector("#featured-grid");
  if (!grid) return;

  const homeSearch = document.querySelector("#home-search");
  const allAds = await loadListings();

  const render = (ads) => {
    grid.innerHTML = ads.slice(0, 6).map(adCardTemplate).join("");
  };

  homeSearch?.addEventListener("input", () => {
    const q = homeSearch.value.trim().toLowerCase();
    const filtered = allAds.filter(
      (ad) => ad.title.toLowerCase().includes(q) || ad.category.toLowerCase().includes(q),
    );
    render(filtered);
  });

  render(allAds);
}

async function initListingsPage() {
  const grid = document.querySelector("#ads-grid");
  if (!grid) return;

  const resultsCount = document.querySelector("#results-count");
  const emptyMessage = document.querySelector("#empty-message");
  const allAds = await loadListings();

  const render = (ads) => {
    grid.innerHTML = ads.map(adCardTemplate).join("");
    resultsCount.textContent = `${ads.length} annonce${ads.length > 1 ? "s" : ""}`;
    emptyMessage.hidden = ads.length !== 0;
  };

  setupFilters(allAds, render);
}

async function initDetailPage() {
  const wrapper = document.querySelector("#detail-wrapper");
  if (!wrapper) return;

  const inboxList = document.querySelector("#inbox-list");
  const feedback = document.querySelector("#message-feedback");
  const messageForm = document.querySelector("#message-form");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const allAds = await loadListings();
  const ad = allAds.find((item) => String(item.id) === String(id)) || allAds[0];

  if (!ad) {
    document.querySelector("#detail-empty").hidden = false;
    return;
  }

  wrapper.innerHTML = `
    <article><img class="detail-image" src="${ad.image_url}" alt="${ad.title}" /></article>
    <article class="detail-panel">
      <span class="pill">${ad.category}</span>
      <h1>${ad.title}</h1>
      <p class="price">${currency(ad.price)}</p>
      <p>${ad.description}</p>
      <p><strong>Vendeur:</strong> ${ad.seller_name}</p>
      <div id="paypal-button-container" class="paypal-slot"></div>
    </article>
  `;

  mountPaypalButton("#paypal-button-container", ad.price);

  messageForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = document.querySelector("#message-content").value.trim();
    if (!content) return;

    if (!supabase) {
      feedback.textContent = "Message simulé (Supabase non configuré).";
      return;
    }

    const session = await getSession();
    if (!session) {
      feedback.textContent = "Connectez-vous pour envoyer un message.";
      return;
    }

    const { error } = await supabase.from("messages").insert({
      listing_id: ad.id,
      sender_id: session.user.id,
      receiver_id: ad.seller_id,
      content,
    });

    feedback.textContent = error ? error.message : "Message envoyé ✅";
    messageForm.reset();
    loadInbox(inboxList);
  });

  loadInbox(inboxList);
}

async function loadInbox(container) {
  if (!container) return;

  if (!supabase) {
    container.innerHTML = '<p class="muted">Messagerie démo inactive sans Supabase.</p>';
    return;
  }

  const session = await getSession();
  if (!session) {
    container.innerHTML = '<p class="muted">Connectez-vous pour voir vos messages.</p>';
    return;
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id,content,created_at,listings(title)")
    .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    container.innerHTML = `<p class="muted">${error.message}</p>`;
    return;
  }

  if (!data.length) {
    container.innerHTML = '<p class="muted">Aucun message pour le moment.</p>';
    return;
  }

  container.innerHTML = data
    .map(
      (msg) => `
      <article class="message-item">
        <p><strong>Annonce:</strong> ${msg.listings?.title || "-"}</p>
        <p>${msg.content}</p>
        <p class="muted">${new Date(msg.created_at).toLocaleString("fr-FR")}</p>
      </article>
    `,
    )
    .join("");
}

async function initPostFormPage() {
  const form = document.querySelector("#post-form");
  if (!form) return;

  const preview = document.querySelector("#image-preview");
  const feedback = document.querySelector("#form-feedback");
  const imageInput = document.querySelector("#image-url-input");

  imageInput.addEventListener("input", () => {
    const url = imageInput.value.trim();
    const valid = /^https?:\/\/.+/i.test(url);
    preview.hidden = !valid;
    if (valid) preview.src = url;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      title: document.querySelector("#title-input").value.trim(),
      description: document.querySelector("#description-input").value.trim(),
      price: Number(document.querySelector("#price-input").value),
      category: document.querySelector("#seed-type-input").value,
      image_url: imageInput.value.trim(),
    };

    if (!payload.title || !payload.description || !payload.image_url || Number.isNaN(payload.price)) {
      feedback.textContent = "Tous les champs sont obligatoires.";
      return;
    }

    if (!supabase) {
      feedback.textContent = "Supabase non configuré. Publication simulée.";
      form.reset();
      preview.hidden = true;
      return;
    }

    const session = await getSession();
    if (!session) {
      feedback.textContent = "Connectez-vous pour publier.";
      return;
    }

    const { error } = await supabase.from("listings").insert({
      ...payload,
      seller_id: session.user.id,
    });

    feedback.textContent = error ? error.message : "Annonce publiée ✅";
    if (!error) {
      form.reset();
      preview.hidden = true;
    }
  });
}

initAuth();
initHomepage();
initListingsPage();
initDetailPage();
initPostFormPage();
ensurePaypalSdk();
