const productsInTheCart = JSON.parse(localStorage.getItem("products-in-the-cart"));
const cartEmptyContainer = document.querySelector("#cart-empty");
const cartProductsContainer = document.querySelector("#cart-products");
const cartActionsContainer = document.querySelector("#cart-actions");
const cartBoughtContainer = document.querySelector("#cart-bought");
let btnsDelete = document.querySelectorAll(".cart-product-delete");
const btnEmpty = document.querySelector("#cart-actions-clear");
const totalContainer = document.querySelector('#total')
const btnBuy = document.querySelector("#cart-actions-buy");




function loadCartProducts() {
  if (productsInTheCart && productsInTheCart.length > 0) {
    cartEmptyContainer.classList.add("disabled");
    cartProductsContainer.classList.remove("disabled");
    cartActionsContainer.classList.remove("disabled");
    cartBoughtContainer.classList.add("disabled");

    cartProductsContainer.innerHTML = "";

    productsInTheCart.forEach(product => {

      const div = document.createElement("DIV");
      div.classList.add("cart-product");
      div.innerHTML = `
        <img class="cart-product-image" src="${product.image}" alt="${product.title}">
        <div class="cart-product-title">
          <small>Title</small>
          <h3>${product.title}</h3>
        </div>
        <div class="cart-product-quantity">
          <small>Quantity</small>
          <p>${product.quantity}</p>
        </div>
        <div class="cart-product-price">
          <small>Price</small>
          <p>$${product.price}</p>
        </div>
        <div class="cart-product-subtotal">
          <small>Subtotal</small>
          <p>$${product.price * product.quantity}</p>
        </div>
        <button id="${product.id}" class="cart-product-delete">
          <i class="bi bi-trash-fill"></i>
        </button>
      `;

      cartProductsContainer.appendChild(div);

    })

  } else {
    cartEmptyContainer.classList.remove("disabled");
    cartProductsContainer.classList.add("disabled");
    cartActionsContainer.classList.add("disabled");
    cartBoughtContainer.classList.add("disabled");
  }

  updateBtnsDelete();
  updateTotal();
}

loadCartProducts();


function updateBtnsDelete() {
  btnsDelete = document.querySelectorAll(".cart-product-delete");

  btnsDelete.forEach(btn => {
    btn.addEventListener("click", removeFromCart);
  });
}


function removeFromCart(e) {

  Toastify({
    text: "Product removed",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #4b33a8, #785ce9)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".5rem",
    },
    offset: {
      x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
      y: "1.5rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
    },
    onClick: function () { } // Callback after click
  }).showToast();


  const btnId = e.currentTarget.id;
  const index = productsInTheCart.findIndex(product => product.id === btnId);
  productsInTheCart.splice(index, 1);
  loadCartProducts();

  localStorage.setItem("products-in-the-cart", JSON.stringify(productsInTheCart));

}

btnEmpty.addEventListener("click", emptyCart);

function emptyCart() {

  Swal.fire({
    title: "Are you sure?",
    icon: "question",
    html: `${productsInTheCart.reduce((acc, product) => acc + product.quantity, 0)} products will be deleted`,
    showCancerButton: true,
    focusConfirm: false,
    confirmButtonText: "Yes",
    cancelButtonText: "No"
  }).then((result) => {
    if (result.isConfirmed) {
      productsInTheCart.length = 0;
      localStorage.setItem("products-in-the-cart", JSON.stringify(productsInTheCart));
      loadCartProducts();
    }
  })

}

function updateTotal() {
  calculatedTotal = productsInTheCart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  total.innerText = `$${calculatedTotal}`;
}

btnBuy.addEventListener("click", buyCart);

function buyCart() {
  productsInTheCart.length = 0;
  localStorage.setItem("products-in-the-cart", JSON.stringify(productsInTheCart));

  cartEmptyContainer.classList.add("disabled");
  cartProductsContainer.classList.add("disabled");
  cartActionsContainer.classList.add("disabled");
  cartBoughtContainer.classList.remove("disabled");
}