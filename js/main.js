'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close1 = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closelAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaraunts = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");
const restaurantTitle = document.querySelector(".restaurant-title");
const rating = document.querySelector(".rating");
const minPrice = document.querySelector(".price");
const category = document.querySelector(".category");
const modalBody = document.querySelector(".modal-body");
const modalPricetag = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");

const cart = [];

let login = localStorage.getItem("Delivery");

const getData = async function(url) {
  const response = await fetch(url)
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, сьаьус ошибки ${response.status}!`)
  }
  return await response.json( );
};

const valid = function(str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};

const  toggleModal = function() {
  modal.classList.toggle("is-open");
};

const toggleModalAuth = function() {
  modalAuth.classList.toggle("is-open");
  loginInput.style.borderColor = "";
};

function autorized() {
  console.log("авторизован");
  function logOut(event) {
    login = null;
    localStorage.removeItem("Delivery");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    cartButton.style.display = '' ;
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
    // returnMain();
  }
  userName.textContent = login;
  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = 'flex' ;
  buttonOut.addEventListener("click", logOut);
}

function notAutorized() {
  console.log(login);
  function logIn(event) {
    event.preventDefault();
    buttonAuth.removeEventListener("click", toggleModalAuth);
    closelAuth.removeEventListener("click", toggleModalAuth);
    logInForm.removeEventListener("submit", logIn);
    // if (login == "") {
    if (valid(loginInput.value.trim())) {
      login = loginInput.value;
      localStorage.setItem("Delivery", login);

      logInForm.reset();
      toggleModalAuth();
    } else {
      alert("Введите Логин");
      loginInput.style.borderColor = "red";
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

function createCardRestaraunts(restaurant) {
  const { image, kitchen, name, price, products, stars, time_of_delivery:timeOfDelivery } = restaurant;
  const card = document.createElement('a');
  card.classList.add('card') // добавляет класс
  card.classList.add('card-restaurant')
  // card.className = "card card-restaurant"; добавляет класс по другому
  card.products = products;
  card.info = [name, price, stars, kitchen];

  card.insertAdjacentHTML('beforeend', `
    <img
    src="${image}"
    alt="image"
    class="card-image"
    />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  `);

  cardsRestaraunts.insertAdjacentElement("beforeend", card);
}

function createCardGood(goods) {
  const { description, id, name, image, price,} = goods;
  const card = document.createElement("div")
  card.className = "card";
  // card.id = id;
  card.insertAdjacentHTML("beforeend", `
 
              <img
                src="${image}"
                alt="image"
                class="card-image"
              />
              <div class="card-text">
                <div class="card-heading">
                  <h3 class="card-title card-title-reg">${name}</h3>
                </div>
                <!-- /.card-heading -->
                <div class="card-info">
                  <div class="ingredients">${description}</div>
                </div>
                <!-- /.card-info -->
                <div class="card-buttons">
                  <button class="button button-primary button-add-cart" id="${id}">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                  </button>
                  <strong class="card-price card-price-bold">${price} ₽</strong>
                </div>
              </div>
              <!-- /.card-text -->
            
  `);
// debugger
// console.log(card);
cardsMenu.insertAdjacentElement("beforeend", card);
}

//открывает меню ресторана
function openGoods(event) {
  const target = event.target;
  const restaraunt = target.closest(".card-restaurant");
  
  if (login) {
    
    if (restaraunt) {
      
      // const info = restaraunt.dataset.info.split (',')
      // const [ name, price , stars, kitchen ] = info;
      const [ name, price , stars, kitchen ] = restaraunt.info;

      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");
      cardsMenu.textContent = "";
        
      // console.log(restaraunt.dataset.info);
      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = 'От ' + price + ' ₽';
      category.textContent = kitchen;

      getData(`./db/${restaraunt.products}`).then(function(data){
        data.forEach(createCardGood)
      });
    }

  } else {
    toggleModalAuth()
  } 

}

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart')
  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    const food = cart.find(function(item){
      return item.id === id;
    })
    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
    })
    // console.log(cart);
    }
  }
}

function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function({ id, title, cost, count }) {
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id="${id}">-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id="${id}">+</button>
        </div>
      </div>
    `;
    modalBody.insertAdjacentHTML('afterbegin', itemCart)
  })
  
  const totalPrice = cart.reduce(function(result, item){ 
    return result + (parseFloat(item.cost) * item.count);
  }, 0);
  modalPricetag.textContent = totalPrice + ' ₽';
}

function changeCount(event){
  const target = event.target ;

  if (target.classList.contains('counter-button')) {
    
    const food = cart.find(function(item){
      return item.id === target.dataset.id;
      
    });
    if(target.classList.contains('counter-minus')) {
      food.count--
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1)
      }
    };
    if(target.classList.contains('counter-plus')) food.count++;
    renderCart();
  }

  // if(target.classList.contains('counter-minus')) {
  //   const food = cart.find(function(item){
  //     return item.id === target.dataset.id;
  //   });
  //   food.count--;
  //   renderCart();
  // }

  // if(target.classList.contains('counter-plus')) {
  //   const food = cart.find(function(item){
  //     return item.id === target.dataset.id;
  //   });
  //   food.count++;
  //   renderCart();
  // }

}

function init() {
  getData('./db/partners.json').then(function(data){
    data.forEach(createCardRestaraunts)
    // console.log(data[0]);
  });
  
  cartButton.addEventListener("click", function(){
    
    renderCart();
    toggleModal();
  });

  modalBody.addEventListener('click', changeCount )

  buttonClearCart.addEventListener('click', function(){
    cart.length = 0;
    renderCart();
  } )

  cardsMenu.addEventListener('click', addToCart );
  
  close1.addEventListener("click", toggleModal);
  
  cardsRestaraunts.addEventListener("click", openGoods);
  
  logo.addEventListener("click", function () {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  });
  
  checkAuth();
    
  new Swiper (".swiper-container", {
    loop: true,
    autoplay: true
  });
}

init();