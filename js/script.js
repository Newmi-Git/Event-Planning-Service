// ============================================================================
// --- GLOBAL LIFE-CYCLE & INITIALIZATION ---
// ============================================================================
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Apply Persistent Dark Theme Immediately on Page Load
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
        const iconImg = document.querySelector("#darkModeBtn img");
        if (iconImg) iconImg.style.filter = "invert(1)";
    }

    // 2. Sync Authenticated User State in Navbar
    renderAuthNavbar();

    // 3. Bind Dark Mode Toggle Button Click Event Safely
    const darkModeBtn = document.getElementById("darkModeBtn");
    if (darkModeBtn) {

        darkModeBtn.addEventListener("click", function() {
            document.body.classList.toggle("dark-theme");
            const iconImg = darkModeBtn.querySelector("img");
            
            if (document.body.classList.contains("dark-theme")) {
                localStorage.setItem("theme", "dark");
                if (iconImg) iconImg.style.filter = "invert(1)";
            } else {
                localStorage.setItem("theme", "light");
                if (iconImg) iconImg.style.filter = "none";
            }
        });
    }

    // 4. Bind Authentication Forms Safely
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", login);
    }

    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", register);
    }
});


// ============================================================================
// --- AUTH UI STATE CONTROLLER ---
// ============================================================================
function renderAuthNavbar() {
    const currentUser = localStorage.getItem("currentUser");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const accountBtn = document.querySelector(".account-btn");

    if (!dropdownMenu || !accountBtn) return; // Guard clause if header changes

    if (currentUser) {
        // Update main button text to reflect the logged-in user
        accountBtn.innerHTML = `Hi, ${currentUser} <span class="arrow">▼</span>`;

        // Update dropdown choices to show useful post-auth utilities
        dropdownMenu.innerHTML = `
            <a href="#" id="logoutBtn" class="dropdown-link signup-highlight">Log Out</a>
        `;

        // Wire up the logout script
        document.getElementById("logoutBtn").addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            alert("Logged out successfully.");
            window.location.reload();
        });
    }
}


// ============================================================================
// --- SIGN-UP PAGE ENGINE ---
// ============================================================================
function register(e) {
    if (e) e.preventDefault(); 

    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");

    if (!usernameField || !passwordField) {
        console.error("Authentication fields could not be found in the DOM.");
        return;
    }

    const username = usernameField.value.trim();
    const password = passwordField.value;

    if (username === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check case-insensitive duplication
    const userExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
    if (userExists) {
        alert("Username or Email already exists!");
        return;
    }
    
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Account created successfully!");
    window.location.href = "./login.html"; 
}


// ============================================================================
// --- LOG-IN PAGE ENGINE ---
// ============================================================================
function login(e) {
    if (e) e.preventDefault(); 

    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");

    if (!usernameField || !passwordField) return;

    const username = usernameField.value.trim();
    const password = passwordField.value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Validate case-insensitive profile name matching along with password
    const user = users.find(user => user.username.toLowerCase() === username.toLowerCase() && user.password === password);
    
    if (user) {
        alert("Login successful!");
        localStorage.setItem("currentUser", user.username); // Keep exact case for display
        window.location.href = "./index.html"; 
    } else {
        alert("Invalid Username or Password");
    }
}

//============================================================
// SERVICES PAGE
// ===========================================================


const searchInput  = document.getElementById('search-input');
const budgetSlider = document.getElementById('budget-slider');
const budgetLabel  = document.getElementById('budget-label');
const grid         = document.getElementById('product-grid');
const sortBtns     = document.querySelectorAll('.sorting-options button');
const checkboxes   = document.querySelectorAll('.filter-group input[type="checkbox"]');

// Cart elements
const cartBtn        = document.getElementById('cart-btn');
const cartCount      = document.getElementById('cart-count');
const cartDropdown   = document.getElementById('cart-dropdown');
const cartCloseBtn   = document.getElementById('cart-close-btn');
const cartItemsList  = document.getElementById('cart-items-list');
const cartNoteInput  = document.getElementById('cart-note-input');
const cartNoteAddBtn = document.getElementById('cart-note-add-btn');
const cartNotesList  = document.getElementById('cart-notes-list');

// ─────────────────────────────────────────────────────
// LOCALSTORAGE KEY
// ─────────────────────────────────────────────────────
const LS_PLAN_KEY  = 'adc_plan_ids';
const LS_NOTES_KEY = 'adc_plan_notes';

// ─────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────
let planIds = JSON.parse(localStorage.getItem(LS_PLAN_KEY) || '[]');
let planNotes = JSON.parse(localStorage.getItem(LS_NOTES_KEY) || '[]');

// ─────────────────────────────────────────────────────
// SAVE TO LOCALSTORAGE
// ─────────────────────────────────────────────────────
function savePlan() {
    localStorage.setItem(LS_PLAN_KEY, JSON.stringify(planIds));
    localStorage.setItem(LS_NOTES_KEY, JSON.stringify(planNotes));
}

// ─────────────────────────────────────────────────────
// FILTER
// ─────────────────────────────────────────────────────
function filterAll() {
    const query   = searchInput.value.toLowerCase();
    const budget  = parseInt(budgetSlider.value);
    const checked = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value);

    // Special: "we-host" checkbox filters by data-host attribute
    const weHostChecked = checked.includes('we-host');
    const otherChecked  = checked.filter(v => v !== 'we-host');

    document.querySelectorAll('.products').forEach(card => {
        const nameMatch = card.dataset.name.toLowerCase().includes(query);
        const priceMatch = parseInt(card.dataset.price) <= budget;

        let categoryMatch = true;
        if (otherChecked.length > 0) {
            const cardCategories = card.dataset.category.split(' ');
            categoryMatch = otherChecked.every(cat => cardCategories.includes(cat));
        }

        let hostMatch = true;
        if (weHostChecked) {
            hostMatch = card.dataset.host === 'we-host';
        }

        card.style.display = (nameMatch && categoryMatch && priceMatch && hostMatch) ? '' : 'none';
    });
}

searchInput.addEventListener('input', filterAll);

budgetSlider.addEventListener('input', function () {
    budgetLabel.textContent = 'R0–' + this.value;
    filterAll();
});

checkboxes.forEach(cb => cb.addEventListener('change', filterAll));

// ─────────────────────────────────────────────────────
// SORT
// ─────────────────────────────────────────────────────
sortBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        sortBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const type  = this.dataset.sort;
        const cards = [...document.querySelectorAll('.products')];

        cards.sort((a, b) => {
            if (type === 'featured') {
                // We Host cards go first, then by rating desc
                const aFeat = a.dataset.host === 'we-host' ? 0 : 1;
                const bFeat = b.dataset.host === 'we-host' ? 0 : 1;
                if (aFeat !== bFeat) return aFeat - bFeat;
                return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            }
            if (type === 'price-asc')  return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            if (type === 'price-desc') return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            if (type === 'rating')     return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            return 0;
        });

        cards.forEach(card => grid.appendChild(card));
    });
});

function renderCart() {
    cartCount.textContent = planIds.length;

    if (planIds.length === 0) {
        cartItemsList.innerHTML = '<p class="cart-empty-msg">No events added yet.</p>';
    } else {
        cartItemsList.innerHTML = '';

        planIds.forEach(item => {
            const card = document.querySelector(`.products[data-id="${item.id}"]`);
            if (!card) return;

            const name       = card.dataset.name;
            const price      = parseInt(card.dataset.price);
            const quantity   = item.quantity;
            const totalPrice = price * quantity;

            // ✅ FIX 1: declare row HERE inside the loop
            const row = document.createElement('div');
            row.className = 'cart-item-row';

            row.innerHTML = `
                <span class="cart-item-name">${name}</span>
                <button class="minus-btn" data-id="${item.id}">−</button>
                <span class="qty">${quantity}</span>
                <button class="plus-btn" data-id="${item.id}">+</button>
                <span class="cart-item-price">R${totalPrice}</span>
                <button class="cart-item-delete" data-id="${item.id}">
                    <i class="bi bi-trash3"></i>
                </button>
            `;

            cartItemsList.appendChild(row);

            // ✅ FIX 2: event listeners AFTER appendChild, still inside the loop
            row.querySelector('.plus-btn').addEventListener('click', () => increaseQuantity(item.id));
            row.querySelector('.minus-btn').addEventListener('click', () => decreaseQuantity(item.id));
            row.querySelector('.cart-item-delete').addEventListener('click', () => removeFromPlan(item.id));
        });
    }

    renderNotes();

    // ✅ FIX 3: planIds is now [{id, quantity}] not [id], so use .find() not .includes()
    document.querySelectorAll('.add-to-plan-btn').forEach(btn => {
        const id = btn.dataset.id;
        const inPlan = planIds.find(item => item.id === id);
        if (inPlan) {
            btn.textContent = '✓ Added';
            btn.classList.add('added');
        } else {
            btn.textContent = 'Add to Plan';
            btn.classList.remove('added');
        }
    });
}



//=====================================================CART — ADD==================================================================

function addToPlan(id, btnEl) {
    const card = document.querySelector(`.products[data-id="${id}"]`);
    const existingItem = planIds.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        planIds.push({
            id:       id,
            quantity: 1,
            name:     card.dataset.name,
            price:    parseInt(card.dataset.price),
            image:    card.querySelector('img')?.src || ''   // ← add this
        });
    }
    savePlan();
    flyToCart(btnEl);
    cartBtn.classList.remove('bump');
    void cartBtn.offsetWidth;
    cartBtn.classList.add('bump');
    cartCount.classList.remove('pop');
    void cartCount.offsetWidth;
    cartCount.classList.add('pop');
    renderCart();
}

//============================================================CART — REMOVE=============================================================
function removeFromPlan(id) {
    planIds = planIds.filter(item => item.id !== id);
    savePlan();
    renderCart();
}

function increaseQuantity(id) {

    const item = planIds.find(item => item.id === id);

    if(item){
        item.quantity++;
    }

    savePlan();
    renderCart();
}

function decreaseQuantity(id) {

    const item = planIds.find(item => item.id === id);

    if(item && item.quantity > 1){
        item.quantity--;
    }

    savePlan();
    renderCart();
}

// FLY-TO-CART ANIMATION
function flyToCart(btnEl) {
    const start  = btnEl.getBoundingClientRect();
    const target = cartBtn.getBoundingClientRect();

    const particle = document.createElement('div');
    particle.className = 'fly-particle';
    particle.style.cssText = `
        left: ${start.left + start.width / 2}px;
        top:  ${start.top + start.height / 2}px;
    `;
    document.body.appendChild(particle);

    const dx = (target.left + target.width / 2) - (start.left + start.width / 2);
    const dy = (target.top + target.height / 2) - (start.top + start.height / 2);

    particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0.6 }
    ], {
        duration: 500,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
    }).onfinish = () => particle.remove();
}

// ─────────────────────────────────────────────────────
// NOTES
// ─────────────────────────────────────────────────────
function renderNotes() {
    cartNotesList.innerHTML = '';
    planNotes.forEach((note, i) => {
        const el = document.createElement('div');
        el.className = 'cart-note-entry';
        el.innerHTML = `
            <span>${note}</span>
            <button data-index="${i}" title="Delete note"><i class="bi bi-x"></i></button>
        `;
        cartNotesList.appendChild(el);
    });

    cartNotesList.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function () {
            planNotes.splice(parseInt(this.dataset.index), 1);
            savePlan();
            renderNotes();
        });
    });
}

cartNoteAddBtn.addEventListener('click', () => {
    const text = cartNoteInput.value.trim();
    if (!text) return;
    planNotes.push(text);
    cartNoteInput.value = '';
    savePlan();
    renderNotes();
});

cartNoteInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') cartNoteAddBtn.click();
});

// ─────────────────────────────────────────────────────
// CART TOGGLE
// ─────────────────────────────────────────────────────
cartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cartDropdown.classList.toggle('open');
});

cartCloseBtn.addEventListener('click', () => {
    cartDropdown.classList.remove('open');
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (!cartDropdown.contains(e.target) && e.target !== cartBtn) {
        cartDropdown.classList.remove('open');
    }
});

// =============================================ADD TO PLAN BUTTON LISTENERS=====================================================

document.querySelectorAll('.add-to-plan-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        addToPlan(this.dataset.id, this);
    });
});

// =========================================
renderCart();

const product = document.getElementById
darkMode.addEventListener("click", darkMode())

(function setupFilterDrawer() {
    const filterSection = document.querySelector('.services-page .filter-section');
    if (!filterSection) return;

    // Create the toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'filter-toggle-btn';
    toggleBtn.innerHTML = `
        <span>🎯 Filter &amp; Search</span>
        <span class="filter-toggle-icon">&#8964;</span>
    `;

    // Insert it as the first child of the filter section
    filterSection.insertBefore(toggleBtn, filterSection.firstChild);

    // Toggle drawer open/closed
    toggleBtn.addEventListener('click', () => {
        filterSection.classList.toggle('drawer-open');
    });
})();