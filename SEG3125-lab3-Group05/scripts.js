// we want to keep track of user preferences in an object as asked in the instructions
let userPreferences = {
    vegetarian: false,
    glutenFree: false,
    organicPreference: 'all',
    largeText: false
};

// we want to wait until the DOM is fully loaded before initializing the app
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCustomerPage();
    loadPreferences();

    initializeProductsPage();
    loadCart();
    updateCartCount();
    renderCart();

    const clearBtn = document.getElementById("clear-cart");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
      cart = [];
      saveCart();
      updateCartCount();
      renderCart();
    });
  }
});

// our navigation system
function initializeNavigation() {
    const navCustomer = document.getElementById('nav-customer');
    const navProducts = document.getElementById('nav-products');
    const navCart = document.getElementById('nav-cart');

    navCustomer.addEventListener('click', () => showSection('customer-section'));
    navProducts.addEventListener('click', () => showSection('products-section'));
    navCart.addEventListener('click', () => showSection('cart-section'));
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => section.classList.remove('active'));

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // we want to highlight the current navigation section as active
    if (sectionId === 'customer-section') {
        document.getElementById('nav-customer').classList.add('active');
    } else if (sectionId === 'products-section') {
        document.getElementById('nav-products').classList.add('active');
    } else if (sectionId === 'cart-section') {
        document.getElementById('nav-cart').classList.add('active');
    }
}

// customer section functionality 
function initializeCustomerPage() {
    const saveBtn = document.getElementById('save-preferences');
    const largeTextCheckbox = document.getElementById('large-text');

    saveBtn.addEventListener('click', savePreferences);
    
    largeTextCheckbox.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
        }
    });
}

function savePreferences() {
    userPreferences.vegetarian = document.getElementById('vegetarian').checked;
    userPreferences.glutenFree = document.getElementById('gluten-free').checked;

    const organicRadio = document.querySelector('input[name="preference"]:checked');
    userPreferences.organicPreference = organicRadio ? organicRadio.value : 'all';

    userPreferences.largeText = document.getElementById('large-text').checked;

    localStorage.setItem('go5Preferences', JSON.stringify(userPreferences));

    if (userPreferences.largeText) {
        document.body.classList.add('large-text');
    } else {
        document.body.classList.remove('large-text');
    }

    // refresh products to apply preferences immediately
    if (document.getElementById("products-grid")) {
      renderProducts();
    }

    alert('Your preferences have been saved!');
}

function loadPreferences() {
    const saved = localStorage.getItem('go5Preferences');
    if (saved) {
        userPreferences = JSON.parse(saved);

        document.getElementById('vegetarian').checked = userPreferences.vegetarian;
        document.getElementById('gluten-free').checked = userPreferences.glutenFree;
        document.getElementById('large-text').checked = userPreferences.largeText;

        if (userPreferences.organicPreference === 'organic') {
            document.getElementById('organic').checked = true;
        } else if (userPreferences.organicPreference === 'non-organic') {
            document.getElementById('non-organic').checked = true;
        } else {
            document.getElementById('no-preference').checked = true;
        }

        if (userPreferences.largeText) {
            document.body.classList.add('large-text');
        }
    }
}
// our products and cart data
let products = [
  {
    id: 1,
    name: "Banana",
    category: "fruit",
    price: 0.50,
    image: "imagess/banana1.png",
    organic: false,
    glutenFree: true,
    vegetarian: true
  },
  {
    id: 2,
    name: "Spinach",
    category: "vegetable",
    price: 1.25,
    image: "imagess/spinach1.png",
    organic: true,
    glutenFree: true,
    vegetarian: true
  },
  {
    id: 3,
    name: "White Bread",
    category: "bakery",
    price: 1.25,
    image: "imagess/whitebread1.png",
    organic: false,
    glutenFree: false,
    vegetarian: true
  },
  {
    id: 4,
    name: "Pasta (Wheat)",
    category: "pantry",
    price: 2.75,
    image: "imagess/pasta1.png",
    organic: false,
    glutenFree: false,
    vegetarian: true
  },
  {
    id: 5,
    name: "Canned Beans",
    category: "pantry",
    price: 3.00,
    image: "imagess/cannedbeans1.png",
    organic: false,
    glutenFree: true,
    vegetarian: true
  },
  {
    id: 6,
    name: "Tofu",
    category: "protein",
    price: 3.50,
    image: "imagess/tofu1.png",
    organic: true,
    glutenFree: true,
    vegetarian: true
  },
  {
    id: 7,
    name: "Greek Yogurt",
    category: "dairy",
    price: 4.00,
    image: "imagess/greekyogurt1.png",
    organic: false,
    glutenFree: true,
    vegetarian: false
  },
  {
    id: 8,
    name: "Milk",
    category: "dairy",
    price: 4.50,
    image: "imagess/milk1.png",
    organic: false,
    glutenFree: true,
    vegetarian: true
  },
  {
    id: 9,
    name: "Free-Range Eggs",
    category: "dairy",
    price: 5.00,
    image: "imagess/eggs1.png",
    organic: true,
    glutenFree: true,
    vegetarian: true
  },
  {
    id: 10,
    name: "Quinoa",
    category: "grain",
    price: 5.50,
    image: "imagess/quinoa1.png",
    organic: true,
    glutenFree: true,
    vegetarian: true
  },
  {
    id: 11,
    name: "Cheddar Cheese",
    category: "dairy",
    price: 6.00,
    image: "imagess/cheddarcheese1.png",
    organic: false,
    glutenFree: true,
    vegetarian: true
  },
  {
    id: 12,
    name: "Chicken Thighs",
    category: "meat",
    price: 7.50,
    image: "imagess/chickenthighs1.png",
    organic: false,
    glutenFree: true,
    vegetarian: false
  },
  {
    id: 13,
    name: "Almond Butter",
    category: "pantry",
    price: 8.00,
    image: "imagess/almondbutter1.png",
    organic: true,
    glutenFree: true,
    vegetarian: true
  },
  {
    id: 14,
    name: "Ground Beef",
    category: "meat",
    price: 9.00,
    image: "imagess/groundbeef1.png",
    organic: false,
    glutenFree: true,
    vegetarian: false
  },
  {
    id: 15,
    name: "Frozen Pizza",
    category: "frozen",
    price: 10.00,
    image: "imagess/frozenpizza1.png",
    organic: false,
    glutenFree: false,
    vegetarian: true
  },
  {
    id: 16,
    name: "Chicken Breast",
    category: "meat",
    price: 11.50,
    image: "imagess/chickenbreast1.png",
    organic: true,
    glutenFree: true,
    vegetarian: false
  },
  {
    id: 17,
    name: "Atlantic Salmon",
    category: "seafood",
    price: 13.00,
    image: "imagess/salmon1.png",
    organic: false,
    glutenFree: true,
    vegetarian: false
  },{
    id: 18,
    name: "Honey",
    category: "pantry",
    price: 14.00,
    image: "imagess/honey1.png",
    organic: true,
    glutenFree: true,
    vegetarian: true
  },
  {
    id: 19,
    name: "Ribeye Steak",
    category: "meat",
    price: 18.00,
    image: "imagess/steak1.png",
    organic: false,
    glutenFree: true,
    vegetarian: false
  },
  {
    id: 20,
    name: "Olive Oil",
    category: "pantry",
    price: 22.00,
    image: "imagess/oliveoil1.png",
    organic: true,
    glutenFree: true,
    vegetarian: true
  }


];

let cart = []; // { productId, qty }

// our product page
function initializeProductsPage() {
  const grid = document.getElementById("products-grid");
  if (!grid) return; 

  const searchInput = document.getElementById("product-search");
  const categoryFilter = document.getElementById("category-filter");
  const resetBtn = document.getElementById("reset-filters");

  // initial render
  renderProducts();

  searchInput.addEventListener("input", renderProducts);
  categoryFilter.addEventListener("change", renderProducts);
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    renderProducts();
  });
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const searchText = (document.getElementById("product-search")?.value || "").toLowerCase().trim();
  const category = document.getElementById("category-filter")?.value || "all";

  let filtered = products.filter(p => {
    // category filter
    if (category !== "all" && p.category !== category) return false;

    // search filter
    if (searchText && !p.name.toLowerCase().includes(searchText)) return false;

    // preference filters (from Customer Info page)
    if (userPreferences.vegetarian && !p.vegetarian) return false;
    if (userPreferences.glutenFree && !p.glutenFree) return false;
    if (userPreferences.organicPreference === "organic" && !p.organic) return false;
    if (userPreferences.organicPreference === "non-organic" && p.organic) return false;

    return true;
  });

  // render cards
  filtered.sort((a,b) => a.price - b.price);

  grid.innerHTML = filtered.map(productCardHTML).join("");

  // add-to-cart buttons
  filtered.forEach(p => {
    const btn = document.getElementById(`add-${p.id}`);
    if (btn) btn.addEventListener("click", () => addToCart(p.id));
  });

  // empty state
  if (filtered.length === 0) {
    grid.innerHTML = `<p style="text-align:center; color: var(--text-light); grid-column: 1 / -1;">
      No products match your filters.
    </p>`;
  }

  // open product detail when image is clicked
  grid.querySelectorAll("[data-open-product]").forEach(btn => {
    btn.addEventListener("click", () => {
      openProductPage(Number(btn.dataset.openProduct));
    });
  });
}

function productCardHTML(p) {
  const organicBadge = p.organic ? `<span class="badge organic">Organic</span>` : `<span class="badge">Non-organic</span>`;
  const gfBadge = p.glutenFree ? `<span class="badge gf">Gluten-free</span>` : `<span class="badge">Contains gluten</span>`;

  return `
    <div class="product-card">
      <button class="product-image-btn" data-open-product="${p.id}" type="button">
        <img class="product-image" src="${p.image}" alt="${p.name}">
      </button>
      <div class="product-body">
        <div class="product-name">${p.name}</div>

        <div class="product-meta">
          <div>${organicBadge} ${gfBadge}</div>
          <div class="product-price">$${p.price.toFixed(2)}</div>
        </div>

        <button class="btn-add-cart" id="add-${p.id}" type="button">Add to cart</button>
      </div>
    </div> `;
}

// to render a page for product
function openProductPage(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;

  const detail = document.getElementById("product-detail");
  if (!detail) return;

  detail.innerHTML = `
    <div class="product-detail-wrapper">
      <div class="product-detail-card">

        <div class="product-detail-image">
          <img src="${p.image}" alt="${p.name}">
        </div>

        <div class="product-detail-info">
          <button id="back-to-products" type="button">← Back to products</button>

          <h2>${p.name}</h2>
          <p><strong>Price:</strong> $${p.price.toFixed(2)}</p>
          <p><strong>Category:</strong> ${p.category}</p>
          <p><strong>Organic:</strong> ${p.organic ? "Yes" : "No"}</p>
          <p><strong>Gluten-free:</strong> ${p.glutenFree ? "Yes" : "No"}</p>
          <p><strong>Vegetarian:</strong> ${p.vegetarian ? "Yes" : "No"}</p>

          <button class="btn-add-cart" id="detail-add-${p.id}" type="button">
            Add to cart
          </button>
        </div>

      </div>
    </div>`;

  // wire buttons on the detail page
  document.getElementById("back-to-products")?.addEventListener("click", () => {
    showSection("products-section");
  });

  document.getElementById(`detail-add-${p.id}`)?.addEventListener("click", () => {
    addToCart(p.id);
  });

  // show the detail section
  showSection("product-detail-section");
}

function addToCart(productId) {
  const item = cart.find(x => x.productId === productId);
  if (item) item.qty += 1;
  else cart.push({ productId, qty: 1 });

  updateCartUI();
}

function updateCartCount() {
  const count = getCartCount();
  const el = document.getElementById("cart-count");
  if (el) el.textContent = `(${count})`;
}

function saveCart() {
  localStorage.setItem("go5Cart", JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem("go5Cart");
  cart = saved ? JSON.parse(saved) : [];
}

function renderCart() {
  const cartContent = document.getElementById("cart-content");
  const cartTotalEl = document.getElementById("cart-total");
  if (!cartContent || !cartTotalEl) return;

  if (cart.length === 0) {
    cartContent.innerHTML = `<p style="text-align:center; color: var(--text-light);">Your cart is empty.</p>`;
    cartTotalEl.textContent = "$0.00";
    return;
  }

  let total = 0;

  cartContent.innerHTML = cart.map(item => {
    const p = products.find(prod => prod.id === item.productId);
    if (!p) return "";

    const lineTotal = p.price * item.qty;
    total += lineTotal;

    return `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <div class="cart-item-title">${p.name}</div>
          <div class="cart-item-sub">
            $${p.price.toFixed(2)} each - Total: $${lineTotal.toFixed(2)}
          </div>
        </div>

        <div class="cart-controls">
          <div class="qty-controls">
            <button class="qty-btn" data-action="dec" data-id="${p.id}" type="button">−</button>

            <div class="qty-center">
              <span class="qty-value">${item.qty}</span>
              <button class="remove-btn" data-action="remove" data-id="${p.id}" type="button">Remove</button>
            </div>

            <button class="qty-btn" data-action="inc" data-id="${p.id}" type="button">+</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  cartTotalEl.textContent = `$${total.toFixed(2)}`;

  // hook buttons
  cartContent.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const id = Number(btn.dataset.id);

      if (action === "inc") changeQty(id, +1);
      if (action === "dec") changeQty(id, -1);
      if (action === "remove") removeFromCart(id);
    });
  });
}

function changeQty(productId, delta) {
  const item = cart.find(x => x.productId === productId);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(x => x.productId !== productId);
  }

  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(x => x.productId !== productId);
  updateCartUI();
}

// Helper functions
function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
  saveCart();
  updateCartCount();
  renderCart();
}
