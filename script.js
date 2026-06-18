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


// ============================================================================
// --- SERVICES PAGE: FILTERING & SORTING ARCHITECTURE ---
// ============================================================================
const searchInput   = document.getElementById('search-input');
const budgetSlider  = document.getElementById('budget-slider');
const budgetLabel   = document.getElementById('budget-label');
const grid          = document.getElementById('product-grid');
const sortBtns      = document.querySelectorAll('.sorting-options button');
const checkboxes    = document.querySelectorAll('.filter-group input[type="checkbox"]');
const tagBtns       = document.querySelectorAll('.tag button');

function filterAll() {
    if (!searchInput || !budgetSlider) return; 

    const query    = searchInput.value.toLowerCase();
    const budget   = parseInt(budgetSlider.value);
    const checked  = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value);

    document.querySelectorAll('.products').forEach(card => {
        const nameMatch      = card.dataset.name ? card.dataset.name.toLowerCase().includes(query) : true;
        const cardCategories = card.dataset.category ? card.dataset.category.split(' ') : [];
        const categoryMatch  = checked.every(cat => cardCategories.includes(cat));
        const priceMatch     = card.dataset.price ? parseInt(card.dataset.price) <= budget : true;

        card.style.display = (nameMatch && categoryMatch && priceMatch) ? '' : 'none';
    });
}

// --- Dynamic Event Setup ---
if (searchInput) {
    searchInput.addEventListener('input', filterAll);
}

if (budgetSlider) {
    budgetSlider.addEventListener('input', function () {
        if (budgetLabel) budgetLabel.textContent = 'R0–' + this.value;
        filterAll();
    });
}

if (checkboxes.length > 0) {
    checkboxes.forEach(cb => cb.addEventListener('change', filterAll));
}

if (tagBtns.length > 0) {
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
}

