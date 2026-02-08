// we want to keep track of user preferences in an object as asked in the instructions
let userPreferences = {
  vegetarian: false,
  glutenFree: false,
  lactoseFree: false,
  organic: false,
  local: false,
  ecoFriendly: false,
  maxPrice: 25,
  largeText: false,
}

// we want to wait until the DOM is fully loaded before initializing the app
document.addEventListener('DOMContentLoaded', function () {
  initializeNavigation()
  initializeCustomerPage()
  loadPreferences()

  initializeProductsPage()
  loadCart()
  updateCartCount()
  renderCart()

  const clearBtn = document.getElementById('clear-cart')
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart = []
      saveCart()
      updateCartCount()
      renderCart()
    })
  }
})

// our navigation system
function initializeNavigation() {
  const navCustomer = document.getElementById('nav-customer')
  const navProducts = document.getElementById('nav-products')
  const navCart = document.getElementById('nav-cart')

  navCustomer.addEventListener('click', () => showSection('customer-section'))
  navProducts.addEventListener('click', () => showSection('products-section'))
  navCart.addEventListener('click', () => showSection('cart-section'))
}

function showSection(sectionId) {
  const sections = document.querySelectorAll('.page-section')
  sections.forEach((section) => section.classList.remove('active'))

  const navButtons = document.querySelectorAll('.nav-btn')
  navButtons.forEach((btn) => btn.classList.remove('active'))

  // Show the selected section
  const selectedSection = document.getElementById(sectionId)
  if (selectedSection) {
    selectedSection.classList.add('active')
  }

  // we want to highlight the current navigation section as active
  if (sectionId === 'customer-section') {
    document.getElementById('nav-customer').classList.add('active')
  } else if (sectionId === 'products-section') {
    document.getElementById('nav-products').classList.add('active')
  } else if (sectionId === 'cart-section') {
    document.getElementById('nav-cart').classList.add('active')
  }

  // for breadcrumbs
  if (sectionId === "customer-section") {
    updateBreadcrumbs([
      { label: "Home" }
    ]);
  }

  if (sectionId === "products-section") {
    updateBreadcrumbs([
      { label: "Home", section: "customer-section" },
      { label: "Products" }
    ]);
  }

  if (sectionId === "cart-section") {
    updateBreadcrumbs([
      { label: "Home", section: "customer-section" },
      { label: "Cart" }
    ]);
  }  
}

// to update breadcrumbs
function updateBreadcrumbs(path) {
  const container = document.getElementById("breadcrumbs");
  if (!container) return;

  container.innerHTML = path.map((item, index) => {
    if (item.section) {
      return `<span data-section="${item.section}">${item.label}</span>`;
    } else {
      return `<span>${item.label}</span>`;
    }
  }).join(" / ");

  // attach click events
  container.querySelectorAll("[data-section]").forEach(el => {
    el.addEventListener("click", () => {
      showSection(el.dataset.section);
    });
  });
}

// customer section functionality
function initializeCustomerPage() {
  const saveBtn = document.getElementById('save-preferences')
  const largeTextCheckbox = document.getElementById('large-text')
  const priceSlider = document.getElementById('price-range')

  saveBtn.addEventListener('click', savePreferences)

  largeTextCheckbox.addEventListener('change', function () {
    if (this.checked) {
      document.body.classList.add('large-text')
    } else {
      document.body.classList.remove('large-text')
    }
  })

  // this is the functionality of our new slider
  if (priceSlider) {
    priceSlider.addEventListener('input', function () {
      const value = this.value
      document.getElementById('price-range-value').textContent =
        `$0 - $${value}`
    })
  }
}

function savePreferences() {
  userPreferences.vegetarian = document.getElementById('vegetarian').checked
  userPreferences.glutenFree = document.getElementById('gluten-free').checked
  userPreferences.lactoseFree = document.getElementById('lactose-free').checked

  userPreferences.organic = document.getElementById('organic').checked
  userPreferences.local = document.getElementById('local').checked
  userPreferences.ecoFriendly = document.getElementById('eco-friendly').checked

  userPreferences.maxPrice = parseFloat(
    document.getElementById('price-range').value,
  )
  userPreferences.largeText = document.getElementById('large-text').checked

  localStorage.setItem('go5Preferences', JSON.stringify(userPreferences))

  if (userPreferences.largeText) {
    document.body.classList.add('large-text')
  } else {
    document.body.classList.remove('large-text')
  }

  alert('Your preferences have been saved!')

  // now the save preferences button will send the user to the products page
  showSection('products-section')
  renderProducts()
}

function loadPreferences() {
  const saved = localStorage.getItem('go5Preferences')
  if (saved) {
    userPreferences = JSON.parse(saved)
    // added new preferences/categories

    document.getElementById('vegetarian').checked = userPreferences.vegetarian
    document.getElementById('gluten-free').checked = userPreferences.glutenFree
    document.getElementById('lactose-free').checked =
      userPreferences.lactoseFree

    document.getElementById('organic').checked = userPreferences.organic
    document.getElementById('local').checked = userPreferences.local
    document.getElementById('eco-friendly').checked =
      userPreferences.ecoFriendly

    document.getElementById('price-range').value =
      userPreferences.maxPrice || 25
    document.getElementById('price-range-value').textContent =
      `$0 - $${userPreferences.maxPrice || 25}`

    document.getElementById('large-text').checked = userPreferences.largeText

    if (userPreferences.largeText) {
      document.body.classList.add('large-text')
    }
  }
}
// our products and cart data
let products = [
  {
    id: 1,
    name: 'Banana',
    category: 'fruit',
    price: 0.5,
    image: 'imagess/banana1.png',
    organic: false,
    glutenFree: true,
    vegetarian: true,
    lactoseFree: true,
    local: true,
    ecoFriendly: false,
  },
  {
    id: 2,
    name: 'Spinach',
    category: 'vegetable',
    price: 1.25,
    image: 'imagess/spinach1.png',
    organic: true,
    glutenFree: true,
    vegetarian: true,
    lactoseFree: true,
    local: true,
    ecoFriendly: true,
  },
  {
    id: 3,
    name: 'White Bread',
    category: 'bakery',
    price: 1.25,
    image: 'imagess/whitebread1.png',
    organic: false,
    glutenFree: false,
    vegetarian: true,
    lactoseFree: true,
    local: false,
    ecoFriendly: false,
  },
  {
    id: 4,
    name: 'Pasta (Wheat)',
    category: 'pantry',
    price: 2.75,
    image: 'imagess/pasta1.png',
    organic: false,
    glutenFree: false,
    vegetarian: true,
    lactoseFree: true,
    local: false,
    ecoFriendly: false,
  },
  {
    id: 5,
    name: 'Canned Beans',
    category: 'pantry',
    price: 3.0,
    image: 'imagess/cannedbeans1.png',
    organic: false,
    glutenFree: true,
    vegetarian: true,
    lactoseFree: true,
    local: false,
    ecoFriendly: false,
  },
  {
    id: 6,
    name: 'Tofu',
    category: 'protein',
    price: 3.5,
    image: 'imagess/tofu1.png',
    organic: true,
    glutenFree: true,
    vegetarian: true,
    lactoseFree: true,
    local: true,
    ecoFriendly: true,
  },
  {
    id: 7,
    name: 'Greek Yogurt',
    category: 'dairy',
    price: 4.0,
    image: 'imagess/greekyogurt1.png',
    organic: false,
    glutenFree: true,
    vegetarian: false,
    lactoseFree: false,
    local: false,
    ecoFriendly: false,
  },
  {
    id: 8,
    name: 'Milk',
    category: 'dairy',
    price: 4.5,
    image: 'imagess/milk1.png',
    organic: false,
    glutenFree: true,
    vegetarian: true,
    lactoseFree: false,
    local: true,
    ecoFriendly: false,
  },
  {
    id: 9,
    name: 'Free-Range Eggs',
    category: 'dairy',
    price: 5.0,
    image: 'imagess/eggs1.png',
    organic: true,
    glutenFree: true,
    vegetarian: true,
    lactoseFree: true,
    local: true,
    ecoFriendly: true,
  },
  {
    id: 10,
    name: 'Quinoa',
    category: 'grain',
    price: 5.5,
    image: 'imagess/quinoa1.png',
    organic: true,
    glutenFree: true,
    vegetarian: true,
    lactoseFree: true,
    local: false,
    ecoFriendly: true,
  },
  {
    id: 11,
    name: 'Cheddar Cheese',
    category: 'dairy',
    price: 6.0,
    image: 'imagess/cheddarcheese1.png',
    organic: false,
    glutenFree: true,
    vegetarian: true,
    lactoseFree: false,
    local: false,
    ecoFriendly: false,
  },
  {
    id: 12,
    name: 'Chicken Thighs',
    category: 'meat',
    price: 7.5,
    image: 'imagess/chickenthighs1.png',
    organic: false,
    glutenFree: true,
    vegetarian: false,
    lactoseFree: true,
    local: false,
    ecoFriendly: false,
  },
  {
    id: 13,
    name: 'Almond Butter',
    category: 'pantry',
    price: 8.0,
    image: 'imagess/almondbutter1.png',
    organic: true,
    glutenFree: true,
    vegetarian: true,
    lactoseFree: true,
    local: false,
    ecoFriendly: true,
  },
  {
    id: 14,
    name: 'Ground Beef',
    category: 'meat',
    price: 9.0,
    image: 'imagess/groundbeef1.png',
    organic: false,
    glutenFree: true,
    vegetarian: false,
    lactoseFree: true,
    local: true,
    ecoFriendly: false,
  },
  {
    id: 15,
    name: 'Frozen Pizza',
    category: 'frozen',
    price: 10.0,
    image: 'imagess/frozenpizza1.png',
    organic: false,
    glutenFree: false,
    vegetarian: true,
    lactoseFree: false,
    local: false,
    ecoFriendly: false,
  },
  {
    id: 16,
    name: 'Chicken Breast',
    category: 'meat',
    price: 11.5,
    image: 'imagess/chickenbreast1.png',
    organic: true,
    glutenFree: true,
    vegetarian: false,
    lactoseFree: true,
    local: true,
    ecoFriendly: true,
  },
  {
    id: 17,
    name: 'Atlantic Salmon',
    category: 'seafood',
    price: 13.0,
    image: 'imagess/salmon1.png',
    organic: false,
    glutenFree: true,
    vegetarian: false,
    lactoseFree: true,
    local: false,
    ecoFriendly: false,
  },
  {
    id: 18,
    name: 'Honey',
    category: 'pantry',
    price: 14.0,
    image: 'imagess/honey1.png',
    organic: true,
    glutenFree: true,
    vegetarian: true,
    lactoseFree: true,
    local: true,
    ecoFriendly: true,
  },
  {
    id: 19,
    name: 'Ribeye Steak',
    category: 'meat',
    price: 18.0,
    image: 'imagess/steak1.png',
    organic: false,
    glutenFree: true,
    vegetarian: false,
    lactoseFree: true,
    local: false,
    ecoFriendly: false,
  },
  {
    id: 20,
    name: 'Olive Oil',
    category: 'pantry',
    price: 22.0,
    image: 'imagess/oliveoil1.png',
    organic: true,
    glutenFree: true,
    vegetarian: true,
    lactoseFree: true,
    local: false,
    ecoFriendly: true,
  },
]

let cart = [] // { productId, qty }

// our product page
function initializeProductsPage() {
  const grid = document.getElementById('products-grid')
  if (!grid) return

  const searchInput = document.getElementById('product-search')
  const categoryFilter = document.getElementById('category-filter')
  const resetBtn = document.getElementById('reset-filters')

  // initial render
  renderProducts()

  searchInput.addEventListener('input', renderProducts)
  categoryFilter.addEventListener('change', renderProducts)
  resetBtn.addEventListener('click', () => {
    searchInput.value = ''
    categoryFilter.value = 'all'
    renderProducts()
  })
}

function renderProducts() {
  const grid = document.getElementById('products-grid')
  if (!grid) return

  const searchText = (document.getElementById('product-search')?.value || '')
    .toLowerCase()
    .trim()
  const category = document.getElementById('category-filter')?.value || 'all'

  let filtered = products.filter((p) => {
    // category filter
    if (category !== 'all' && p.category !== category) return false

    // search filter
    if (searchText && !p.name.toLowerCase().includes(searchText)) return false

    // preference filters for the customer page
    if (userPreferences.vegetarian && !p.vegetarian) return false
    if (userPreferences.glutenFree && !p.glutenFree) return false
    if (userPreferences.lactoseFree && !p.lactoseFree) return false

    // product preferences heuristics
    if (userPreferences.organic && !p.organic) return false
    if (userPreferences.local && !p.local) return false
    if (userPreferences.ecoFriendly && !p.ecoFriendly) return false

    // filtering the price
    if (p.price > userPreferences.maxPrice) return false

    return true
  })

  // render cards
  filtered.sort((a, b) => a.price - b.price)

  grid.innerHTML = filtered.map(productCardHTML).join('')

  // add-to-cart buttons
  filtered.forEach((p) => {
    const btn = document.getElementById(`add-${p.id}`)
    if (btn) btn.addEventListener('click', () => addToCart(p.id))
  })

  // empty state
  if (filtered.length === 0) {
    grid.innerHTML = `<p style="text-align:center; color: var(--text-light); grid-column: 1 / -1;">
      No products match your filters.
    </p>`
  }

  // open product detail when image is clicked
  grid.querySelectorAll('[data-open-product]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openProductPage(Number(btn.dataset.openProduct))
    })
  })
}

function productCardHTML(p) {
  const organicBadge = p.organic
    ? `<span class="badge organic">Organic</span>`
    : `<span class="badge">Non-organic</span>`
  const gfBadge = p.glutenFree
    ? `<span class="badge gf">Gluten-free</span>`
    : `<span class="badge">Contains gluten</span>`

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
    </div> `
}

// to render a page for product
function openProductPage(productId) {
  const p = products.find((x) => x.id === productId)
  if (!p) return

  const detail = document.getElementById('product-detail')
  if (!detail) return

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
          <p><strong>Organic:</strong> ${p.organic ? 'Yes' : 'No'}</p>
          <p><strong>Gluten-free:</strong> ${p.glutenFree ? 'Yes' : 'No'}</p>
          <p><strong>Vegetarian:</strong> ${p.vegetarian ? 'Yes' : 'No'}</p>

          <button class="btn-add-cart" id="detail-add-${p.id}" type="button">
            Add to cart
          </button>
        </div>

      </div>
    </div>`

  // wire buttons on the detail page
  document.getElementById('back-to-products')?.addEventListener('click', () => {
    showSection('products-section')
  })

  document
    .getElementById(`detail-add-${p.id}`)
    ?.addEventListener('click', () => {
      addToCart(p.id)
    })
  
  // breadcrumbs
  updateBreadcrumbs([
    { label: "Home", section: "customer-section" },
    { label: "Products", section: "products-section" },
    { label: p.name }
  ]);

  // show the detail section
  showSection('product-detail-section')
}

function addToCart(productId) {
  const item = cart.find((x) => x.productId === productId)
  if (item) item.qty += 1
  else cart.push({ productId, qty: 1 })

  updateCartUI()
}

function updateCartCount() {
  const count = getCartCount()
  const el = document.getElementById('cart-count')
  if (el) el.textContent = `(${count})`
}

function saveCart() {
  localStorage.setItem('go5Cart', JSON.stringify(cart))
}

function loadCart() {
  const saved = localStorage.getItem('go5Cart')
  cart = saved ? JSON.parse(saved) : []
}

function renderCart() {
  const cartContent = document.getElementById('cart-content')
  const cartTotalEl = document.getElementById('cart-total')
  if (!cartContent || !cartTotalEl) return

  if (cart.length === 0) {
    cartContent.innerHTML = `<p style="text-align:center; color: var(--text-light);">Your cart is empty.</p>`
    cartTotalEl.textContent = '$0.00'
    return
  }

  let total = 0

  cartContent.innerHTML = cart
    .map((item) => {
      const p = products.find((prod) => prod.id === item.productId)
      if (!p) return ''

      const lineTotal = p.price * item.qty
      total += lineTotal

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
    `
    })
    .join('')

  // get tip
  const tipPercent = parseFloat(
    document.querySelector('input[name="tip"]:checked')?.value || 0
  );
  const finalTotal = total*(1 + tipPercent)
  cartTotalEl.textContent = `$${finalTotal.toFixed(2)}`

  // hook buttons
  cartContent.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action
      const id = Number(btn.dataset.id)

      if (action === 'inc') changeQty(id, +1)
      if (action === 'dec') changeQty(id, -1)
      if (action === 'remove') removeFromCart(id)
    })
  })
  
  // recalculate total when tip changes
  document.querySelectorAll('input[name="tip"]').forEach(radio => {
    radio.addEventListener("change", renderCart);
  });
}

function changeQty(productId, delta) {
  const item = cart.find((x) => x.productId === productId)
  if (!item) return

  item.qty += delta

  if (item.qty <= 0) {
    cart = cart.filter((x) => x.productId !== productId)
  }

  updateCartUI()
}

function removeFromCart(productId) {
  cart = cart.filter((x) => x.productId !== productId)
  updateCartUI()
}

// Helper functions
function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0)
}

function updateCartUI() {
  saveCart()
  updateCartCount()
  renderCart()
}
