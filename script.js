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