let products = [];

fetch("./js/products.json")
  .then(response => response.json())
  .then(data => {
    products = data;
    loadProducts(products);
  })


// Variables

const productsContainer = document.querySelector("#products-container");
const btnsCategory = document.querySelectorAll(".btn-category");
const mainTitle = document.querySelector("#main-title");
let btnsAdd = document.querySelectorAll(".product-add");
let productsInTheCart;
const number = document.querySelector("#number");



// Functions

// Function to load the products of the array in the DOM

function loadProducts(chosenProducts) {

  productsContainer.innerHTML = "";

  chosenProducts.forEach(product => {
    const div = document.createElement('DIV');
    div.classList.add('product-card');
    div.innerHTML = `
      <img class="product-image" src="${product.image}" alt="${product.title}">
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">$${product.price}</p>
        <button id="${product.id}" class="product-add">Add</button>
      </div>
    `;

    productsContainer.appendChild(div);
  })

  updateBtnsAdd();
}



btnsCategory.forEach(btn => {
  btn.addEventListener("click", (e) => {
    btnsCategory.forEach(btn => btn.classList.remove("active"));
    e.currentTarget.classList.add("active");

    if (e.currentTarget.id !== "all") {
      const productCategory = products.find(product => product.category.id === e.currentTarget.id);
      mainTitle.innerText = productCategory.category.name
      const btnProducts = products.filter(product => product.category.id === e.currentTarget.id)
      loadProducts(btnProducts);
    } else {
      mainTitle.innerText = "All"
      loadProducts(products);
    }

  })
});

function updateBtnsAdd() {
  btnsAdd = document.querySelectorAll(".product-add");

  btnsAdd.forEach(btn => {
    btn.addEventListener("click", addToCart);
  });
}

const productsInTheCartLS = JSON.parse(localStorage.getItem("products-in-the-cart"));

if (productsInTheCartLS) {
  productsInTheCart = productsInTheCartLS;
  updateCartNumber();
} else {
  productsInTheCart = [];
}



function addToCart(e) {

  Toastify({
    text: "Product added",
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
  const productAdded = products.find(product => product.id === btnId);
  if (productsInTheCart.some(product => product.id === btnId)) {
    const index = productsInTheCart.findIndex(product => product.id === btnId)
    productsInTheCart[index].quantity++;
  } else {
    productAdded.quantity = 1;
    productsInTheCart.push(productAdded);

  }

  updateCartNumber()

  localStorage.setItem("products-in-the-cart", JSON.stringify(productsInTheCart));
}

function updateCartNumber() {
  let newNumber = productsInTheCart.reduce((acc, product) => acc + product.quantity, 0);
  number.innerText = newNumber;
}