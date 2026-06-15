const display = document.getElementById("display");
let budgetset = false;
let budget = 0;


function setbudget() {
    const budget = parseFloat(document.getElementById("budgetinput").value);
    if (isNaN(budget) || budget <= 0) {
        alert("Please enter a valid budget amount");
        return;
    }
    budgetset = true
    alert("Budget set to R" + budget + ".You can now use the calculator.")
}


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


function budgetdisplay(){
    const user_budget
}


let totalcost = 0







function checkbudget() {
    let moneyleft = budget - totalcost;


    if (moneyleft > 0) {
        alert("You are under budget.")
    }


    else if (moneyleft < 0) {
        alert("You are over budget")
    }


    else {
        alert("You used your entire budget")
    }
}
