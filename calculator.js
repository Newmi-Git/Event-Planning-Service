const display = document.getElementById("display");
let budgetset = false;
let budget = 0;
let total = 0


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


// Subtract prices from budget function

function subtractprices() {
    const diff = budget - total
    if (diff > 0) {
        alert("You under budget by" + diff)
    } 

    else if (diff < 0){
        alert("You are over budget by" + diff)
    } else{
        alert("You are exactly on budget")
    }
}



