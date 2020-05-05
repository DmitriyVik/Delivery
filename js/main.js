const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closelAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");

let login = localStorage.getItem("Delivery");

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

function autorized() {
  console.log("авторизован");
  function logOut(event) {
    login = null;
    localStorage.removeItem("Delivery");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
  }
  userName.textContent = login;
  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "block";

  buttonOut.addEventListener("click", logOut);
}

function notAutorized() {
  console.log(login);
  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
    localStorage.setItem("Delivery", login);

    buttonAuth.removeEventListener("click", toggleModalAuth);
    closelAuth.removeEventListener("click", toggleModalAuth);
    logInForm.removeEventListener("submit", logIn);

    logInForm.reset();
    if (login == "") {
      alert("Введите пароль");
    } else {
      toggleModalAuth();
    }
    checkAuth();
  }

  console.log("no авторизован");
  buttonAuth.addEventListener("click", toggleModalAuth);
  closelAuth.addEventListener("click", toggleModalAuth);

  logInForm.addEventListener("submit", logIn);
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized();
  }
}
checkAuth();
