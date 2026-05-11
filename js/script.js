// Product stores the data for each item in the store catalog.
class Product {
  constructor(id, name, price, icon) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.icon = icon;
  }
}

// ShoppingCartItem stores the product and the quantity selected by the user.
class ShoppingCartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  // Calculates the total price for one cart item row.
  getTotalPrice() {
    return this.product.price * this.quantity;
  }
}

// ShoppingCart keeps the collection of ShoppingCartItem objects and exposes cart operations.
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      return;
    }

    this.items.push(new ShoppingCartItem(product, quantity));
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.product.id !== productId);
  }

  clear() {
    this.items = [];
  }

  displayCartItems() {
    return this.items;
  }
}

const products = [
  new Product(1, "Wireless Headphones", 89.99, "fa-headphones-simple"),
  new Product(2, "Smart Watch", 129.99, "fa-clock"),
  new Product(3, "Portable Speaker", 74.5, "fa-music"),
  new Product(4, "Laptop Stand", 39.99, "fa-laptop"),
];

const cart = new ShoppingCart();

const productsGrid = document.getElementById("productsGrid");
const cartItems = document.getElementById("cartItems");
const cartItemCount = document.getElementById("cartItemCount");
const cartQuantity = document.getElementById("cartQuantity");
const cartTotal = document.getElementById("cartTotal");
const cartFooterTotal = document.getElementById("cartFooterTotal");
const clearCartBtn = document.getElementById("clearCartBtn");

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function renderProducts() {
  productsGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-icon"><i class="fa-solid ${product.icon}"></i></div>
          <h3>${product.name}</h3>
          <p>Premium quality with a modern OOJ cart experience.</p>
          <div class="product-meta">
            <span class="price-tag">${formatMoney(product.price)}</span>
            <button class="primary-btn" type="button" data-add-product="${product.id}">
              <i class="fa-solid fa-cart-plus"></i>
              Add
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCart() {
  const items = cart.displayCartItems();

  cartItemCount.textContent = cart.getTotalItems();
  cartQuantity.textContent = cart.getTotalItems();
  cartTotal.textContent = formatMoney(cart.getTotalPrice());
  cartFooterTotal.textContent = formatMoney(cart.getTotalPrice());

  if (items.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <div>
          <i class="fa-solid fa-bag-shopping fa-2x"></i>
          <p style="margin-top: 16px; margin-bottom: 0;">Your cart is empty. Add a product to get started.</p>
        </div>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = items
    .map(
      (item) => `
        <article class="cart-item">
          <div>
            <h3>${item.product.name}</h3>
            <p>${formatMoney(item.product.price)} each · ${formatMoney(item.getTotalPrice())} total</p>
            <div class="item-controls">
              <span class="quantity-pill">Qty ${item.quantity}</span>
            </div>
          </div>
          <div class="item-controls">
            <button class="small-btn" type="button" data-decrease-qty="${item.product.id}" title="Decrease quantity">
              <i class="fa-solid fa-minus"></i>
            </button>
            <button class="small-btn" type="button" data-increase-qty="${item.product.id}" title="Increase quantity">
              <i class="fa-solid fa-plus"></i>
            </button>
            <button class="small-btn" type="button" data-remove-item="${item.product.id}" title="Remove item">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function getProductById(productId) {
  return products.find((product) => product.id === Number(productId));
}

productsGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product]");
  if (!addButton) {
    return;
  }

  const product = getProductById(addButton.dataset.addProduct);
  if (!product) {
    return;
  }

  cart.addItem(product, 1);
  renderCart();
});

cartItems.addEventListener("click", (event) => {
  const increaseButton = event.target.closest("[data-increase-qty]");
  const decreaseButton = event.target.closest("[data-decrease-qty]");
  const removeButton = event.target.closest("[data-remove-item]");

  if (increaseButton) {
    const product = getProductById(increaseButton.dataset.increaseQty);
    if (product) {
      cart.addItem(product, 1);
      renderCart();
    }
    return;
  }

  if (decreaseButton) {
    const productId = Number(decreaseButton.dataset.decreaseQty);
    const item = cart.items.find((cartItem) => cartItem.product.id === productId);

    if (!item) {
      return;
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.removeItem(productId);
    }

    renderCart();
    return;
  }

  if (removeButton) {
    cart.removeItem(Number(removeButton.dataset.removeItem));
    renderCart();
  }
});

clearCartBtn.addEventListener("click", () => {
  cart.clear();
  renderCart();
});

// Initial render proves the classes work and loads the demo data.
renderProducts();
renderCart();
