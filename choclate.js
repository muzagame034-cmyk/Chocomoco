// Sample products data
const products = [
    {
        id: 1,
        name: 'Dark Chocolate Truffles',
        price: 12.99,
        emoji: '🍫',
        description: 'Rich and smooth dark chocolate truffles'
    },
    {
        id: 2,
        name: 'Milk Chocolate Bars',
        price: 8.99,
        emoji: '🍫',
        description: 'Creamy milk chocolate bars'
    },
    {
        id: 3,
        name: 'White Chocolate Bliss',
        price: 10.99,
        emoji: '🍫',
        description: 'Delicate white chocolate delights'
    },
    {
        id: 4,
        name: 'Chocolate Fudge',
        price: 9.99,
        emoji: '🍫',
        description: 'Decadent chocolate fudge'
    },
    {
        id: 5,
        name: 'Hazelnut Chocolate',
        price: 11.99,
        emoji: '🍫',
        description: 'Premium hazelnut filled chocolate'
    },
    {
        id: 6,
        name: 'Mint Chocolate Delight',
        price: 10.49,
        emoji: '🍫',
        description: 'Refreshing mint and chocolate combination'
    }
];

// Shopping cart
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupCartModal();
    loadCart();
});

// Load and display products
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-quantity">
                    <button onclick="decrementQuantity(${product.id})">-</button>
                    <input type="number" id="qty-${product.id}" value="1" min="1">
                    <button onclick="incrementQuantity(${product.id})">+</button>
                </div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Quantity control functions
function incrementQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    input.value = parseInt(input.value) + 1;
}

function decrementQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Display cart items
function displayCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
        document.getElementById('cart-total').textContent = '0.00';
        return;
    }
    
    cartItemsDiv.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</div>
            </div>
            <button class="btn btn-secondary" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItemsDiv.appendChild(cartItem);
    });
    
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    displayCart();
}

// Cart modal setup
function setupCartModal() {
    const cartLink = document.querySelector('.cart-link');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    cartLink.addEventListener('click', function() {
        cartModal.style.display = 'block';
        displayCart();
    });
    
    closeBtn.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
        } else {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Thank you for your purchase! Total: $${total.toFixed(2)}\n\nThis is a demo store.`);
            cart = [];
            saveCart();
            updateCartCount();
            cartModal.style.display = 'none';
            displayCart();
        }
    });
}

// Local storage functions
function saveCart() {
    localStorage.setItem('chocolateCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('chocolateCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}
