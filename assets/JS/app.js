const cl = console.log;

const productCart = document.getElementById("productCart");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const category = document.getElementById("category");
const image = document.getElementById("image");
const cardContainer = document.getElementById("cardContainer");
const butEdit = document.getElementById("butEdit");
const updatebtn = document.getElementById("updatebtn");

let baseURL = "https://fakestoreapi.com";

let productArr = [];

function fetchCart(ele) {
  let xhr = new XMLHttpRequest();
  let postURL = `${baseURL}/products`;
  xhr.open("GET", postURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      productArr = JSON.parse(xhr.response);

      creatCart(productArr);
      cl(productArr);
    }
  };
}

fetchCart();

function creatCart(ele) {
  let result = "";
  ele.forEach((element) => {
    result += `
    <div class="col-md-3 my-2" id=${element.id}>
          <div class="card">
         <div class="card-header"><h2>${element.title}</h2></div>
            <div class="card-body">
             
              <div>${element.description}</div>
               <div calass="mt-2" ><p class="font-weight-bold">Price-
               ${element.price}</p></div>
              <div>${element.category}</div>
              <img src="${element.image}" alt="" />
            </div>
            <div class="d-flex justify-content-between">
              <button class="btn btn-light border border-primary btn-sm m-2"  onclick= "onEdit(this)">
                Add-Cart
              </button>
              <button class="btn btn-light btn-sm border border-danger m-2" onclick='onremove(this)'>
                Remove-Product
              </button>
            </div>
          </div>
        </div>
    `;
  });
  cardContainer.innerHTML = result;
}

function onSubmitCard(ele) {
  ele.preventDefault();

  let newObj = {
    title: title.value,
    price: price.value,
    description: description.value,
    category: category.value,
    image: image.value,
  };

  let xhr = new XMLHttpRequest();
  let postURL = `${baseURL}/products`;
  xhr.open("POST", postURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let res = JSON.parse(xhr.response);

      let div = document.createElement("div");
      div.className = `col-md-3 my-2`;
      div.id = res.id;

      div.innerHTML = ` <div class="card">
      <div class="card-header"><h2>${newObj.title}</h2></div>
            <div class="card-body">
            
              <div>${newObj.description}</div>
                <div calass="mt-2" ><p class="font-weight-bold">$
                ${newObj.price}</p></div>
              <div>${newObj.category}</div>
              <img src="${newObj.image}" alt="" />
            </div>
            <div class="d-flex justify-content-between">
              <button class="btn btn-light border border-primary btn-sm m-2 " onclick= "onEdit(this)">
                Add-Cart
              </button>
              <button onclick='onremove(this)' class="btn btn-light btn-sm border border-danger m-2">
                Remove-Product
              </button>
            </div>
          </div>`;

      cardContainer.prepend(div);

      productCart.reset();
    }
  };
}

function onEdit(ele) {
  let editId = ele.closest(".col-md-3").id;
  localStorage.setItem("editId", editId);

  let editURL = `${baseURL}/products/${editId}`;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", editURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let newObj = JSON.parse(xhr.response);

      title.value = newObj.title;
      price.value = newObj.price;
      category.value = newObj.category;
      image.value = newObj.image;
      description.value = newObj.description;

      butEdit.classList.add("d-none");
      updatebtn.classList.remove("d-none");
    }
  };
}

function onUpdate() {
  let editId = localStorage.getItem("editId");

  let updatedObj = {
    title: title.value,
    price: price.value,
    description: description.value,
    category: category.value,
    image: image.value,
  };

  let xhr = new XMLHttpRequest();
  xhr.open("PUT", `${baseURL}/products/${editId}`);

  xhr.send(JSON.stringify(updatedObj));

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      let div = document.getElementById(editId);
      div.innerHTML = `
        <div class="card h-100">
        <div class="card-header"><h2>${updatedObj.title}</h2></div>
          <div class="card-body">
            <div>
            <div>${updatedObj.description}</div>
            <div calass="mt-2" ><p class="font-weight-bold">${updatedObj.price}</p></div>
           
            <div>${updatedObj.category}</div>
           <img src="${updatedObj.image}" class="img-fluid" alt="">

            </div>
          </div>
          <div class="card-footer d-flex justify-content-between" >
            <button class="btn btn-light border border-primary btn-sm" onclick="onEdit(this)">Change-Cart </button>
            <button class="btn btn-light border border-danger btn-sm" onclick="onDelete(this)">Delete</button>
          </div>
       </div>
        </div>`;
      Swal.fire({
        title: "Product Update Successfully",
        icon: "Success",
        timer: 1000,
      });

      butEdit.classList.remove("d-none");
      updatebtn.classList.add("d-none");
    }
  };
}

function onremove(ele) {
  let removeId = ele.closest(".col-md-3").id;
  let removeURL = `${baseURL}/products/${removeId}`;
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", removeURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      ele.closest(".col-md-3").remove();
    }
  };
}

productCart.addEventListener("submit", onSubmitCard);
updatebtn.addEventListener("click", onUpdate);
