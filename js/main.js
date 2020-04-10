const cartButton = document.querySelector("#cart-button");
const close = document.querySelector(".close");
const modal = document.querySelector(".modal");
// console.log(cartButton);
// cartButton.addEventListener("click", function (event) {
//   modal.classList.add("is-open");
// });
// close.addEventListener("click", function (event) {
//   modal.classList.remove("is-open");
// });
cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

new WOW().init();
