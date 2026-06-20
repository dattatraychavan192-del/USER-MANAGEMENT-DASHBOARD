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

const spinner = document.getElementById("spinner");

function snackbar(msg, icon) {
  Swal.fire({
    title: msg,
    icon: icon,
    timer: 2000,
  });
}

function fetchCart(ele) {
  spinner.classList.remove("d-none");

  let xhr = new XMLHttpRequest();
  let postURL = `${baseURL}/products`;
  xhr.open("GET", postURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      productArr = JSON.parse(xhr.response);

      creatCart(productArr);
      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });
      spinner.classList.add("d-none");
    }
  };
}

fetchCart();

function creatCart(ele) {
  let result = "";
  ele.forEach((element) => {
    result += `
    <div class="col-md-4 my-4" id=${element.id}>
          <div class="card">
         <div class="card-header" data-toggle="tooltip" data-placement="top" title="${element.title}"><h2>${element.title}</h2></div>
            <div class="card-body">
             
              <div>${element.description}</div>
               <div calass="mt-2" ><p class="font-weight-bold">Price-
               ${element.price}</p></div>
              <span class=" p-2">${element.category}</span>
              <img class="mt-2" src="${element.image}" alt="" />
            </div>
            <div class=" card-footer d-flex justify-content-between">
            <button class="btn btn-warning btn-sm"  id="edit" onclick="onEdit(this)">Edit</button>
            <button class="btn btn-danger btn-sm"  id="delete" onclick="onremove(this)">Delete</button>
            </div>
          </div>
        </div>
    `;
  });
  cardContainer.innerHTML = result;
}

function onSubmitCard(ele) {
  ele.preventDefault();

  spinner.classList.remove("d-none");

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
      div.className = `col-md-4 my-4`;
      div.id = res.id;

      div.innerHTML = ` <div class="card">
      <div class="card-header" data-toggle="tooltip" data-placement="top" title="${newObj.title}"><h2>${newObj.title}</h2></div>
            <div class="card-body">
            
              <div>${newObj.description}</div>
                <div calass="mt-2" ><p class="font-weight-bold">$
                ${newObj.price}</p></div>
              <div class="bg-primary text-center">${newObj.category}</div>
              <img class="mt-2" src="${newObj.image}" alt="" />
            </div>
            <div class=" card-footer d-flex justify-content-between">
            <button class="btn btn-warning btn-sm"  id="edit" onclick="onEdit(this)">Edit</button>
            <button class="btn btn-danger btn-sm"  id="delete" onclick="onremove(this)">Delete</button>
            </div>
          </div>`;

      cardContainer.prepend(div);
      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });

      productCart.reset();
      spinner.classList.add("d-none");
      snackbar(`New product add successfully`, "success");
    }
  };
}

function onEdit(ele) {
  spinner.classList.remove("d-none");

  let editId = ele.closest(".col-md-4").id;
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

      productCart.classList.remove("d-none");

      butEdit.classList.add("d-none");
      updatebtn.classList.remove("d-none");

      productCart.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      spinner.classList.add("d-none");
    }
  };
}

function onUpdate() {
  spinner.classList.remove("d-none");

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
              <div>${updatedObj.description}</div>
              <div calass="mt-2" ><p class="font-weight-bold">${updatedObj.price}</p></div>
              <div>${updatedObj.category}</div>
              <img src="${updatedObj.image}" class="img-fluid" alt="">
          </div>
            <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-warning btn-sm"  id="edit" onclick="onEdit(this)">Edit</button>
              <button class="btn btn-danger btn-sm"  id="delete" onclick="onremove(this)">Delete</button>
            </div>
        </div>`;

      butEdit.classList.remove("d-none");
      updatebtn.classList.add("d-none");
      spinner.classList.add("d-none");

      productCart.reset();

      div.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        div.classList.remove("highlight");
      }, 3000);

      snackbar(`Product update Successfully`);
    }
  };
}

function onremove(ele) {
  spinner.classList.remove("d-none");

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let removeId = ele.closest(".col-md-4").id;
      let removeURL = `${baseURL}/products/${removeId}`;
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", removeURL);
      xhr.send(null);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          ele.closest(".col-md-4 ").remove();
          spinner.classList.add("d-none");
          snackbar("Product delete successfully.", "success");
        }
      };
    } else {
      snackbar("Something wents wrong.", "error");
    }
    spinner.classList.add("d-none");
  });
}

productCart.addEventListener("submit", onSubmitCard);
updatebtn.addEventListener("click", onUpdate);
