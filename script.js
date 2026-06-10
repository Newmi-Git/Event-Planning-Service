const darkMode = document.getElementById("darkModeBtn");
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



















darkMode.addEventListener("click", darkMode())