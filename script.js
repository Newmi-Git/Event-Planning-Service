// ============================================================================
// --- GLOBAL INITIALIZATION & DARK THEME (WITH PERSISTENCE) ---
// ============================================================================
document.addEventListener("DOMContentLoaded", function() {
    
    // Check local storage on page load to apply saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
    }

    // Bind Dark Mode Button Toggle Action
    const darkModeBtn = document.getElementById("darkModeBtn");
    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", function() {
            document.body.classList.toggle("dark-theme");
            
            // Save selection to storage
            if (document.body.classList.contains("dark-theme")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
        });
    }

    // ============================================================================
    // --- AUTHENTICATION FORMS BINDING ---
    // ============================================================================
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
// --- SIGN-UP LOGIC ---
// ============================================================================
function register(e) {
    if (e) e.preventDefault(); // Prevents native form page reload
    
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");

    if (!usernameField || !passwordField) {
        console.error("Authentication fields could not be found in the DOM.");
        return;
    }

    const username = usernameField.value.trim();
    const password = passwordField.value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user exists
    const userExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
    if (userExists) {
        alert("Username or Email Already Exists!");
        return;
    }
    
    // Save new user block
    users.push({ username: username, password: password });
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Account Created successfully!");
    window.location.href = "./login.html"; 
}

// ============================================================================
// --- LOG-IN LOGIC ---
// ============================================================================
function login(e) {
    if (e) e.preventDefault(); 

    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");

    if (!usernameField || !passwordField) return;

    const username = usernameField.value;
    const password = passwordField.value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        alert("Login Successful");
        localStorage.setItem("currentUser", username);
        window.location.href = "./index.html"; 
    } else {
        alert("Invalid Username or Password");
    }
}

// ============================================================================
// --- SERVICES PAGE: FILTERING & SORTING LOGIC ---
// ============================================================================
document.addEventListener("DOMContentLoaded", function() {
    const searchInput   = document.getElementById('search-input');
    const budgetSlider  = document.getElementById('budget-slider');
    const budgetLabel   = document.getElementById('budget-label');
    const grid          = document.getElementById('product-grid');
    const sortBtns      = document.querySelectorAll('.sorting-options button');
    const checkboxes    = document.querySelectorAll('.filter-group input[type="checkbox"]');
    const tagBtns       = document.querySelectorAll('.tag button');

    // SAFE GUARD: Only run this whole filtration logic if we are actually on the services page
    if (!grid) return; 

    // --- FILTER ALL ---
    function filterAll() {
        const query    = searchInput ? searchInput.value.toLowerCase() : "";
        const budget   = budgetSlider ? parseInt(budgetSlider.value) : Infinity;
        const checked  = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value);

        document.querySelectorAll('.products').forEach(card => {
            const nameMatch     = card.dataset.name ? card.dataset.name.toLowerCase().includes(query) : true;
            const cardCategories = card.dataset.category ? card.dataset.category.split(' ') : [];
            const categoryMatch  = checked.every(cat => cardCategories.includes(cat));
            const priceMatch     = card.dataset.price ? parseInt(card.dataset.price) <= budget : true;

            card.style.display = (nameMatch && categoryMatch && priceMatch) ? '' : 'none';
        });
    }

    // --- SEARCH FIELD ---
    if (searchInput) {
        searchInput.addEventListener('input', filterAll);
    }

    // --- BUDGET SLIDER ---
    if (budgetSlider && budgetLabel) {
        budgetSlider.addEventListener('input', function () {
            budgetLabel.textContent = 'R0–' + this.value;
            filterAll();
        });
    }

    // --- CATEGORY CHECKBOXES ---
    checkboxes.forEach(cb => cb.addEventListener('change', filterAll));

    // --- ACTIVE FILTER TAGS (×) ---
    tagBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const tag         = this.parentElement;
            const filterValue = tag.dataset.filter;

            const cb = document.querySelector(`.filter-group input[value="${filterValue}"]`);
            if (cb) {
                cb.checked = false;
            }

            tag.remove();
            filterAll();
        });
    });

    // --- SORT ENGINE ---
    sortBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            sortBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const type  = this.dataset.sort;
            const cards = [...document.querySelectorAll('.products')];

            cards.sort((a, b) => {
                if (type === 'price-asc')  return parseInt(a.dataset.price || 0) - parseInt(b.dataset.price || 0);
                if (type === 'price-desc') return parseInt(b.dataset.price || 0) - parseInt(a.dataset.price || 0);
                if (type === 'rating')     return parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0);
                return 0;
            });

            cards.forEach(card => grid.appendChild(card));
        });
    });
});