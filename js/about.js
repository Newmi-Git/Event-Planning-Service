// console.log("JavaScript loaded")

// const cards = document.querySelectorAll(".team-card");

// cards.forEach(card => {
//      card.addEventListener("click", () => {
//       card.classList.toggle("active");
//      });
// });
const cards = document.querySelectorAll(".team-card");

cards.forEach(card => {
    card.addEventListener("click", () => {

        // Hide all other descriptions
        

        // Toggle the clicked card
        card.classList.toggle("active");

        cards.forEach(c => {
            if (c !== card) {
                c.classList.remove("active");
            }
        });
    });
});