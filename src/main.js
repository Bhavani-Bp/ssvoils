import './style.css'

// Product Data
const PRODUCTS = [
  { id: 1, name: 'Sunlight Sunflower Oil', category: 'Health & Wellness', price: 180, image: '/images/sunflower.png' },
  { id: 2, name: 'Heritage Olive Oil', category: 'Imported Premium', price: 950, image: '/images/olive.png' },
  { id: 3, name: 'Traditional Sesame Oil', category: 'Local Extraction', price: 450, image: '/images/sesame.png' },
  { id: 4, name: 'Rustic Mustard Oil', category: 'Spicy & Pure', price: 210, image: '/images/sunflower.png' },
  { id: 5, name: 'Golden Groundnut Oil', category: 'Cold Pressed', price: 240, image: '/images/groundnut.png' },
  { id: 6, name: 'Premium Red Chilli Powder', category: 'Indian Spices', price: 120, image: '/images/chilli.png' },
  { id: 7, name: 'Pure Turmeric Powder', category: 'Health Spices', price: 80, image: '/images/turmeric.jpg' },
];

let cart = [];

// DOM Elements
const productGrid = document.querySelector('#product-grid');
const cartBtn = document.querySelector('#cart-btn');
const cartCount = document.querySelector('#cart-count');
const cartTotalAmount = document.querySelector('#cart-total-amount');
const cartItemsContainer = document.querySelector('#cart-items');

const cartScreen = document.querySelector('#cart-screen');
const checkoutScreen = document.querySelector('#checkout-screen');
const splashScreen = document.querySelector('#splash-screen');

const proceedToCheckoutBtn = document.querySelector('#proceed-to-checkout');
const backToShopBtn = document.querySelector('#cart-back-to-shop');
const backToCartBtn = document.querySelector('#back-to-cart');
const orderWhatsappBtn = document.querySelector('#order-whatsapp');

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
        <button class="btn-add-to-cart" onclick="addToCart(event, ${product.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// Cart Logic
window.addToCart = (event, productId) => {
  const button = event.currentTarget;
  const product = PRODUCTS.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  // Animation logic
  const productCard = button.closest('.product-card');
  const productImg = productCard.querySelector('.product-img');
  const cartIcon = document.querySelector('#cart-btn');

  // Create fly item
  const flyItem = document.createElement('img');
  flyItem.src = product.image;
  flyItem.className = 'fly-item';

  const imgRect = productImg.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  flyItem.style.top = `${imgRect.top}px`;
  flyItem.style.left = `${imgRect.left}px`;

  const targetX = cartRect.left - imgRect.left + (cartRect.width / 2);
  const targetY = cartRect.top - imgRect.top + (cartRect.height / 2);

  flyItem.style.setProperty('--target-x', `${targetX}px`);
  flyItem.style.setProperty('--target-y', `${targetY}px`);

  document.body.appendChild(flyItem);

  // Cleanup fly item
  setTimeout(() => flyItem.remove(), 800);

  // Update button state
  const originalText = button.textContent;
  button.classList.add('added');
  button.textContent = 'Added!';
  setTimeout(() => {
    button.classList.remove('added');
    button.textContent = 'Add to Cart';
  }, 1500);

  // Update Cart State
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI(true); // Pass true to trigger pulse
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

function updateCartUI(shouldPulse = false) {
  // Update count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (shouldPulse) {
    cartCount.classList.remove('pulse');
    void cartCount.offsetWidth; // Trigger reflow
    cartCount.classList.add('pulse');
  }

  // Update items list
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty</div>';
    proceedToCheckoutBtn.style.display = 'none';
  } else {
    proceedToCheckoutBtn.style.display = 'block';
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

// Full-Page Navigation Logic
const showCartScreen = () => {
  cartScreen.classList.add('active');
  checkoutScreen.classList.remove('active');
  document.body.style.overflow = 'hidden';
};

const hideCartScreen = () => {
  cartScreen.classList.remove('active');
  document.body.style.overflow = '';
};

const showCheckoutScreen = () => {
  if (cart.length === 0) return;
  cartScreen.classList.remove('active');
  checkoutScreen.classList.add('active');
};

const hideCheckoutScreen = () => {
  checkoutScreen.classList.remove('active');
  showCartScreen(); // Go back to cart from checkout
};

// Event Listeners
cartBtn.addEventListener('click', showCartScreen);
backToShopBtn.addEventListener('click', hideCartScreen);
proceedToCheckoutBtn.addEventListener('click', showCheckoutScreen);
backToCartBtn.addEventListener('click', hideCheckoutScreen);

// WhatsApp Integration
orderWhatsappBtn.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent any default behavior

  if (cart.length === 0) {
    alert('Your cart is empty.');
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

  const phoneNumber = '918328628506';
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Build WhatsApp Message
  let message = `*SSV OILS - NEW ORDER*%0A%0A`;
  message += `*CUSTOMER DETAILS:*%0A`;
  message += `• Name: ${name}%0A`;
  message += `• Address: ${address}%0A%0A`;

  message += `*ITEMS ORDERED:*%0A`;
  cart.forEach(item => {
    message += `• ${item.name} (${item.quantity} units) - ₹${item.price * item.quantity}%0A`;
  });

  message += `%0A*TOTAL BILL: ₹${total}*%0A%0A`;
  message += `Thank you for shopping with SSV Oils!`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  // Open WhatsApp in a new tab
  window.open(whatsappUrl, '_blank');

  // Reset Cart after successful order initiation
  cart = [];
  updateCartUI();
  hideCheckoutScreen(); // Go back to store
  hideCartScreen(); // Ensure all overlays are closed

  alert('Order details sent to WhatsApp! Your cart has been cleared.');
});
