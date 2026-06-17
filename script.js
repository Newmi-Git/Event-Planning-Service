const darkModeBtn = document.getElementById("darkModeBtn");
const indexBackground = document.getElementById("indexBackground");
const textcolour = document.getElementById("text");
const navBar = document.getElementById("navbar");
const bookButton = document.getElementById("bookButton");



function darkMode() {
    indexBackground.style.backgroundColor = 'rgb(37, 36, 36)';
    textcolour.style.backgroundColor = "White";
};

function register() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(user => user.username === username)) {
        alert("Username Already Exists!");
        return;
    }
    users.push({
        username: username,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("Account Created!");
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find( user => user.username === username && user.password === password);
    if (user) {
        alert("Login Successful");
        localStorage.setItem("currentUser",username);
    } 
    else {
        alert("Invalid Username or Password");
    }
}

function openBookings() {
    
}

//============================================================SERVICES PAGE========================================================================

/* ══════════════════════════════════════════════════════
   Affair De Coeur — Services Page Script
   Features: filter, sort, search, cart, localStorage
   ══════════════════════════════════════════════════════ */

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
        planIds.forEach(id => {
            const card = document.querySelector(`.products[data-id="${id}"]`);
            if (!card) return;

            const name  = card.dataset.name;
            const price = parseInt(card.dataset.price);
            const priceText = price === 0 ? 'Free' : `R${price}`;

            const row = document.createElement('div');
            row.className = 'cart-item-row';
            row.innerHTML = `
                <span class="cart-item-name" title="${name}">${name}</span>
                <span class="cart-item-price">${priceText}</span>
                <button class="cart-item-delete" data-id="${id}" title="Remove">
                    <i class="bi bi-trash3"></i>
                </button>
            `;
            cartItemsList.appendChild(row);
        });

        cartItemsList.querySelectorAll('.cart-item-delete').forEach(btn => {
            btn.addEventListener('click', function () {
                removeFromPlan(this.dataset.id);
            });
        });
    }

    renderNotes();


    document.querySelectorAll('.add-to-plan-btn').forEach(btn => {
        const id = btn.dataset.id;
        if (planIds.includes(id)) {
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
    if (planIds.includes(id)) return; // already in plan

    planIds.push(id);
    savePlan();

    flyToCart(btnEl);

    cartBtn.classList.remove('bump');
    void cartBtn.offsetWidth; // reflow
    cartBtn.classList.add('bump');
    
    cartCount.classList.remove('pop');
    void cartCount.offsetWidth;
    cartCount.classList.add('pop');

    renderCart();
}

//============================================================CART — REMOVE=============================================================
function removeFromPlan(id) {
    planIds = planIds.filter(i => i !== id);
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