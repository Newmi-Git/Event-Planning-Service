const darkModeBtn = document.getElementById("darkModeBtn");
const indexBackground = document.getElementById("indexBackground");
const textcolour = document.getElementById("text");
const navBar = document.getElementById("navbar");
const bookButton = document.getElementById("bookButton");



function darkMode() {
    indexBackground.style.backgroundColor = 'rgb(37, 36, 36)';
    textcolour.style.backgroundColor = "White";
};


// ============================================================================
// ---  SIGN-UP PAGE (Azhar Manie) ---
// ============================================================================

function register(e) {
    // Prevents the browser from reloading the page natively on form submission
    if (e) e.preventDefault(); 
    
    // Grabs input values matching the IDs inside signup.html
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");

    if (!usernameField || !passwordField) {
        console.error("Authentication fields could not be found in the DOM.");
        return;
    }

    const username = usernameField.value.trim();
    const password = passwordField.value;

    // Retrieve database array from LocalStorage, or initialize an empty array
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the email/username is already registered
    const userExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
    
    if (userExists) {
        alert("Username or Email Already Exists!");
        return;
    }
    
    // Save new credentials block into database array
    users.push({
        username: username,
        password: password
    });

    // Commit updated records array back to LocalStorage
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Account Created successfully!");
    
    // Send user smoothly over to the login portal
    window.location.href = "./login.html"; 
}

// --- INITIALIZE FORM ATTRIBUTES ON LOAD ---
document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("signupForm");
    
    if (signupForm) {
        signupForm.addEventListener("submit", register);
    } else {
        console.warn("Warning: Could not find an element with id='signupForm' on this page.");
    }
});

// ============================================================================
// ---  LOG-IN PAGE (Azhar Manie) ---
// ============================================================================
function login(e) {
    if (e) e.preventDefault(); // Prevents page reload on form submit

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        alert("Login Successful");
        localStorage.setItem("currentUser", username);
        window.location.href = "./index.html"; // Redirects straight to index dashboard
    } else {
        alert("Invalid Username or Password");
    }
}

// --- EVENT BINDING & GUARD CHECKS ---
// This guarantees smooth operation across pages even if buttons are missing
document.addEventListener("DOMContentLoaded", function() {
    
    // Bind Login Form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", login);
    }

    // Bind Signup Form (Assuming your signup form element uses id="signupForm")
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", register);
    }

    // Fixed darkmode button listener initialization (Removed the accidental execution parenthesis)
    const darkModeBtn = document.getElementById("darkModeBtn");
    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", function() {
            // Optional: Toggle your CSS master class cleanly here instead
            document.body.classList.toggle("dark-theme");
        });
    }
});

//============================================================
// SERVICES PAGE
// ===========================================================


const searchInput   = document.getElementById('search-input');
const budgetSlider  = document.getElementById('budget-slider');
const budgetLabel   = document.getElementById('budget-label');
const grid          = document.getElementById('product-grid');
const sortBtns      = document.querySelectorAll('.sorting-options button');
const checkboxes    = document.querySelectorAll('.filter-group input[type="checkbox"]');
const tagBtns       = document.querySelectorAll('.tag button');

// --- FILTER ALL ---
function filterAll() {
    const query    = searchInput.value.toLowerCase();
    const budget   = parseInt(budgetSlider.value);
    const checked  = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value);

    document.querySelectorAll('.products').forEach(card => {
        const nameMatch     = card.dataset.name.toLowerCase().includes(query);
        const cardCategories = card.dataset.category.split(' ');
        const categoryMatch  = checked.every(cat => cardCategories.includes(cat));
        const priceMatch    = parseInt(card.dataset.price) <= budget;

        card.style.display = (nameMatch && categoryMatch && priceMatch) ? '' : 'none';
    });
}

// --- SEARCH ---
searchInput.addEventListener('input', filterAll);

// --- BUDGET SLIDER ---
budgetSlider.addEventListener('input', function () {
    budgetLabel.textContent = 'R0–' + this.value;
    filterAll();
});

// --- CHECKBOXES ---
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

// --- SORT ---
sortBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        sortBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const type  = this.dataset.sort;
        const cards = [...document.querySelectorAll('.products')];

        cards.sort((a, b) => {
            if (type === 'price-asc')  return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            if (type === 'price-desc') return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            if (type === 'rating')     return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            return 0;
        });

        cards.forEach(card => grid.appendChild(card));
    });
});
















darkMode.addEventListener("click", darkMode())