// Dummy Database initialization object
const foodDatabase = [
    { id: 1, name: 'Margherita Dream', category: 'pizza', price: 12.99, rating: 4.8, isPopular: true, img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400' },
    { id: 2, name: 'Smoky BBQ Burger', category: 'burger', price: 9.49, rating: 4.9, isPopular: true, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { id: 3, name: 'Mint Mojito Burst', category: 'drinks', price: 4.99, rating: 4.5, isPopular: false, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400' },
    { id: 4, name: 'Velvet Lava Cake', category: 'desserts', price: 6.99, rating: 4.9, isPopular: true, img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400' },
    { id: 5, name: 'Pepperoni Supreme', category: 'pizza', price: 15.49, rating: 4.7, isPopular: false, img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400' },
    { id: 6, name: 'Crispy Vegan Crunch', category: 'burger', price: 8.99, rating: 4.4, isPopular: false, img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400' }
];

let cart = [];
let appliedDiscount = 0;

// Application Initialization Procedures
document.addEventListener("DOMContentLoaded", () => {
    // Dismiss Loader Animation Window
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
        runAnimatedCounters();
    }, 1000);

    renderMenuGrid(foodDatabase, 'menu-grid');
    renderMenuGrid(foodDatabase.filter(item => item.isPopular), 'popular-grid');
    initAppEvents();
});

// App Event Framework Routing
function initAppEvents() {
    // Toggle Mobile Navbar Menu Links Drawer Open/Close
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('navLinks');
    if(menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // Sticky Scroll Spy Navigation Highlight Active Links Rules
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-links a');
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });

    // Dark Mode Switch Mechanism
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    darkModeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', targetTheme);
        darkModeBtn.innerHTML = targetTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Sidebar Toggle Events
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('close-cart');
    
    cartIcon.addEventListener('click', () => cartSidebar.classList.add('open'));
    closeCart.addEventListener('click', () => cartSidebar.classList.remove('open'));

    // Category Filter Button Engines
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterAndSearchItems();
        });
    });

    // Live Search Typing Filter Hook
    document.getElementById('search-input').addEventListener('input', filterAndSearchItems);

    // FAQ Item Click Accordion Engine
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            item.classList.toggle('active');
        });
    });

    // Contact Form Custom Live Rules Validation Logic System
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const name = document.getElementById('name');
        if (name.value.trim().length < 3) {
            name.parentElement.classList.add('invalid');
            isValid = false;
        } else { name.parentElement.classList.remove('invalid'); }

        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            email.parentElement.classList.add('invalid');
            isValid = false;
        } else { email.parentElement.classList.remove('invalid'); }

        if (isValid) {
            alert('Thank you for reaching out! Your message was transmitted flawlessly.');
            contactForm.reset();
        }
    });

    // Promo Code Application Function Rules
    document.getElementById('apply-coupon').addEventListener('click', () => {
        const code = document.getElementById('coupon-code').value.trim();
        if (code === 'BITES20') {
            appliedDiscount = 0.20; // 20% Discount
            alert('Promo applied! 20% discount computed.');
        } else {
            appliedDiscount = 0;
            alert('Invalid coupon code.');
        }
        recalculateCartBill();
    });

    // Checkout Flow Modal Window Switches
    document.getElementById('go-to-checkout').addEventListener('click', () => {
        if(cart.length === 0) return alert('Your shopping cart is empty.');
        buildOrderSummary();
        document.getElementById('checkoutModal').classList.add('open');
    });

    document.getElementById('close-checkout').addEventListener('click', () => {
        document.getElementById('checkoutModal').classList.remove('open');
    });

    // Final Order Placement Operations Form Submissions
    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('checkoutModal').classList.remove('open');
        cartSidebar.classList.remove('open');
        
        // Show success confirmation popup toast message
        const orderIdSpan = document.getElementById('order-id');
        orderIdSpan.innerText = 'TDB-' + Math.floor(Math.random() * 900000 + 100000);
        
        const popup = document.getElementById('successPopup');
        popup.classList.add('show');
        
        // Clear global cart variables states
        cart = [];
        appliedDiscount = 0;
        document.getElementById('coupon-code').value = '';
        updateCartMetrics();
        recalculateCartBill();

        setTimeout(() => {
            popup.classList.remove('show');
        }, 5000);
    });
}

// Counter Metrics Auto incremental Counter Engine
function runAnimatedCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const inc = target / 60;
        const updateCount = () => {
            const count = +counter.innerText;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 25);
            } else {
                counter.innerText = target + "+";
            }
        };
        updateCount();
    });
}

// Populate Grid DOM Items Interface
function renderMenuGrid(items, targetContainerId) {
    const container = document.getElementById(targetContainerId);
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted);">No delicious dishes matching criteria.</p>`;
        return;
    }

    items.forEach(dish => {
        const card = document.createElement('div');
        card.className = 'dish-card';
        card.innerHTML = `
            <img class="dish-img" src="${dish.img}" alt="${dish.name}">
            <div class="dish-info">
                <div class="dish-title-row">
                    <h3>${dish.name}</h3>
                    <span class="fav-btn" onclick="toggleFavoriteElement(this)"><i class="fas fa-heart"></i></span>
                </div>
                <div class="stars">
                    ${Array.from({length: Math.floor(dish.rating)}, () => '<i class="fas fa-star"></i>').join('')}
                    ${dish.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    <span>(${dish.rating})</span>
                </div>
                <div class="dish-footer">
                    <span class="price">$${dish.price.toFixed(2)}</span>
                    <button class="btn" onclick="addFoodItemToCart(${dish.id})">Add To Cart</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Master Unified Filters Evaluation Strategy Router
function filterAndSearchItems() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
    const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter');

    const filtered = foodDatabase.filter(dish => {
        const matchesSearch = dish.name.toLowerCase().includes(searchQuery);
        const matchesCategory = activeCategory === 'all' || dish.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    renderMenuGrid(filtered, 'menu-grid');
}

// Favorite Click Utility Toggle Switch
function toggleFavoriteElement(element) {
    element.classList.toggle('favored');
}

// Global Core Cart Core Process Engine Operations
function addFoodItemToCart(id) {
    const product = foodDatabase.find(item => item.id === id);
    const existingCartItem = cart.find(item => item.id === id);

    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartMetrics();
    recalculateCartBill();
}

function updateCartQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    
    updateCartMetrics();
    recalculateCartBill();
}

function updateCartMetrics() {
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.querySelector('#cart-icon .badge').innerText = totalCount;

    const container = document.getElementById('cartItemsContainer');
    container.innerHTML = '';

    cart.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        itemRow.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
        container.appendChild(itemRow);
    });
}

function recalculateCartBill() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * appliedDiscount;
    const finalTotal = subtotal - discountAmount;

    document.getElementById('bill-subtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('bill-discount').innerText = `-$${discountAmount.toFixed(2)}`;
    document.getElementById('bill-total').innerText = `$${finalTotal.toFixed(2)}`;
}

function buildOrderSummary() {
    const box = document.getElementById('order-summary-box');
    box.innerHTML = '<h4>Items List:</h4>';
    cart.forEach(item => {
        box.innerHTML += `<p>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</p>`;
    });
    box.innerHTML += `<hr style="margin:10px 0; border:0; border-top:1px solid var(--border-color);"><p><strong>Final Amount Payable: ${document.getElementById('bill-total').innerText}</strong></p>`;
}