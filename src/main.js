import './style.css'

// Product Data
const PRODUCTS = [
  { id: 1, name: 'Sunlight Sunflower Oil', category: 'Health & Wellness', price: 180, image: './assets/sunflower.png' },
  { id: 2, name: 'Heritage Olive Oil', category: 'Imported Premium', price: 950, image: './assets/olive.png' },
  { id: 3, name: 'Traditional Sesame Oil', category: 'Local Extraction', price: 450, image: './assets/sesame.png' },
  { id: 4, name: 'Rustic Mustard Oil', category: 'Spicy & Pure', price: 210, image: './assets/sunflower.png' },
  { id: 5, name: 'Golden Groundnut Oil', category: 'Cold Pressed', price: 240, image: './assets/sesame.png' },
  { id: 6, name: 'Premium Red Chilli Powder', category: 'Indian Spices', price: 120, image: '/images/turmeric.jpg' },
  { id: 7, name: 'Pure Turmeric Powder', category: 'Health Spices', price: 80, image: '/images/turmeric.jpg' },
];

let cart = [];

// DOM Elements
const productGrid = document.querySelector('#product-grid');
const cartBtn = document.querySelector('#cart-btn');
const cartDrawer = document.querySelector('#cart-drawer');
const closeDrawer = document.querySelector('.close-drawer');
const cartItemsContainer = document.querySelector('#cart-items');
const cartCount = document.querySelector('#cart-count');
const cartTotalAmount = document.querySelector('#cart-total-amount');
const orderWhatsappBtn = document.querySelector('#order-whatsapp');
const splashScreen = document.querySelector('#splash-screen');

// Initialize
window.addEventListener('load', () => {
  setTimeout(() => {
    splashScreen.classList.add('hidden');
  }, 2000);

  renderProducts();
  updateCartUI();
});

// Render Products
function renderProducts() {
  productGrid.innerHTML = PRODUCTS.map(product => `
    <div class="product-card">
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
        <div class="product-badge">${product.category}</div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-meta">
           <span class="product-price">₹${product.price}</span>
           <span class="product-unit"> / unit</span>
        </div>
        <button class="btn-add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// Cart Logic
window.addToCart = (productId) => {
  const product = PRODUCTS.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  openCart();
};

window.removeFromCart = (productId) => {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
};

window.updateQuantity = (productId, delta) => {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartUI();
    }
  }
};

function updateCartUI() {
  // Update count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update items list
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty</div>';
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">₹${item.price}</div>
          <div class="cart-item-controls">
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.id})" class="remove-item">&times;</button>
      </div>
    `).join('');
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotalAmount.textContent = `₹${total}`;
}

// Drawer Controls
const openCart = () => cartDrawer.classList.add('open');
const closeCart = () => cartDrawer.classList.remove('open');

cartBtn.addEventListener('click', openCart);
closeDrawer.addEventListener('click', closeCart);
document.querySelector('.drawer-overlay').addEventListener('click', closeCart);

// WhatsApp Integration
orderWhatsappBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Please add products to your cart first.');
    return;
  }

  const nameInput = document.querySelector('#cust-name');
  const addressInput = document.querySelector('#cust-address');

  const name = nameInput.value.trim();
  const address = addressInput.value.trim();

  if (!name || !address) {
    alert('Please provide your Full Name and Delivery Address.');
    if (!name) nameInput.focus();
    else addressInput.focus();
    return;
  }

  const phoneNumber = '8328628506';
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let message = `*NEW ORDER FROM SSV OILS*%0A%0A`;
  message += `*Customer Details:*%0A`;
  message += `• Name: ${name}%0A`;
  message += `• Address: ${address}%0A%0A`;

  message += `*Order Items:*%0A`;
  cart.forEach(item => {
    message += `• ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}%0A`;
  });

  message += `%0A*Total Amount: ₹${total}*`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
});
