const display = document.getElementById("display");
const showalert = document.getElementById("showalert");
const showalert2 = document.getElementById("showalert2");
const confirmbtn = document.getElementById("confirm");
const confirmbtn2 = document.getElementById("confirm2");
let budgetset = false;
let budget = 0;



function appendtodisplay(user_input) {
    if (!budgetset) {
        showalert.style.display = "block";
        return;
    }
    display.value += user_input;
}

function Cleardisplay() {
    display.value = "";
    document.getElementById('budgetstatus').textContent = '';
}

function Calculate() {
    if (!budgetset) {
        showalert.style.display = "block";
        return;
    }

    try {
        const result = eval(display.value);
        display.value = result;
        updateBudgetStatus(result);
    } catch {
        display.value = "Error";
    }
}


confirmbtn.addEventListener("click", function(){
    showalert.style.display = "none";
})

confirmbtn2.addEventListener("click", function(){
    showalert2.style.display = "none";
})









function setbudget() {
    const input = parseFloat(document.getElementById("budgetinput").value);
    if (isNaN(input) || input <= 0) {
        showalert.style.display = "none";
        return;
    }
    budget = input;
    budgetset = true;
    display.value = budget;
    document.getElementById('budgetstatus').textContent = '';
    // alert("Budget set to R" + budget + ". Click events or use the calculator to subtract.");
}


function updateBudgetStatus(result) {
    const status = document.getElementById('budgetstatus');
    const diff = result;  // result IS the remaining amount (budget - costs)
    if (diff < 0) {
        status.textContent = `⚠ Over budget by R${Math.abs(diff).toFixed(2)}`;
        status.style.color = '#e74c3c';
    } else {
        status.textContent = `✓ R${diff.toFixed(2)} remaining`;
        status.style.color = '#2ecc71';
    }
}


function subtractprices() {
    if (!budgetset) {
        showalert2.style.display = "block";
        return;
    }

    const planIds = JSON.parse(localStorage.getItem('adc_plan_ids') || '[]');
    if (planIds.length === 0) {
        showalert2.style.display = "block";
        return;
    }


    let expression = budget.toString();
    planIds.forEach(item => {
        const lineTotal = item.price * item.quantity;
        expression += `-${lineTotal}`;
    });

    display.value = expression;

}



function appendEventToDisplay(price, quantity) {
    if (!budgetset) {
        showalert.style.display = "block";
        return;
    }
    const lineTotal = price * quantity;
    display.value += `-${lineTotal}`;
}



function deleteFromPlan(id) {
    let planIds = JSON.parse(localStorage.getItem('adc_plan_ids') || '[]');
    planIds = planIds.filter(item => item.id !== id);
    localStorage.setItem('adc_plan_ids', JSON.stringify(planIds));
    loadFromPlan();
}

function loadFromPlan() {
    const planIds = JSON.parse(localStorage.getItem('adc_plan_ids') || '[]');
    const cards   = document.getElementById('cardsContainer');

    cards.innerHTML = '';

    if (planIds.length === 0) {
        cards.innerHTML = `
            <div class="plan-empty">
                <p>No events in your plan yet.</p>
                <a href="services.html">Browse events →</a>
            </div>`;
        document.getElementById('totalprice').textContent = 'R0';
        return;
    }

    let total = 0;
    planIds.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="event-card-img">
            <div class="event-card-info">
                <h4 class="event-card-name">${item.name}</h4>
                <p class="event-card-qty">Qty: ${item.quantity}</p>
                <p class="event-card-price">R${item.price} each</p>
                <p class="event-card-total">= R${itemTotal}</p>
            </div>
            <button class="event-card-delete" title="Remove from plan" onclick="deleteFromPlan('${item.id}')">
                <i class="bi bi-trash3"></i>
            </button>
        `;

        card.addEventListener('click', function(e) {
            if (e.target.closest('.event-card-delete')) return;
            appendEventToDisplay(item.price, item.quantity);
            card.classList.add('card-tapped');
            setTimeout(() => card.classList.remove('card-tapped'), 300);
        });

        cards.appendChild(card);
    });

    document.getElementById('totalprice').textContent = `R${total}`;
}

loadFromPlan();