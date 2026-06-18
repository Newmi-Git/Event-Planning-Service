const display = document.getElementById("display");
let budgetset = false;
let budget = 0;
let total = 0;


// Set budget functions

function setbudget() {
    const budget = parseFloat(document.getElementById("budgetinput").value); 
    function showBudget() {
        display.value = budget;
    }

    display.addEventListener("keydown", function (e) {
        e.preventDefault();
    })

    if (isNaN(budget) || budget <= 0 ) {
        alert("Please enter a valid budget amount");
        return;
    }

    budgetset = true
    alert("Budget set to R" + budget + ".You can now use the calculator.")

    showBudget()
}


// The calculator functions

function appendtodisplay(user_input) {
    if (!budgetset) {
        alert("Please set your budget first")
        return
    }
    display.value += user_input;
}


function Cleardisplay() {
    display.value = "";
}


function Calculate() {
    if (!budgetset) {
        alert("Please set your budget first")
        return
    }
    display.value = eval(display.value);
}

// -----------------------------------------------------


// Events that are added are stored in this array
let events = [];  

document.querySelectorAll(".products").forEach(product => {
    product.addEventListener("click", () => {
        const eventName = product.dataset.name;
        const eventPrice = product.dataset.price;

        events.push({
            Name: eventName,
            Price: eventPrice
        })

        displayEvents()
    })
})

function displayEvents() {
    const cards = document.getElementById("cardsContainer");
    CSSContainerRule.innerHTML = "";

    let total = 0;
    events.forEach(event => {
        total += event.price;

        cards.innerHTML += `<div class= "b1">
                                <h3>${event.name}<h3>
                                <p>Price: R${event.price}<p>
                            </div>`;
    })
}



document.getElementById("totalPrice").textContent = `R${total}`;

const status = document.getElementById("budgetstatus");
if (total > budget) {
    status.textContent = `Over budget by R${total-budget}`;
    status.style.color = "red";
} else {
    status.textContent = `Under budget by R${total-budget}`;
    status.style.color = "green";
}


