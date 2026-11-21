const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", function () {
  sidebar.classList.toggle("open");
});

const todayDate = document.getElementById("todayDate");
const now = new Date();
todayDate.textContent = now.toDateString();

const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("velvetTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", function () {
  if (document.body.classList.contains("dark-mode")) {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "🌙";
    localStorage.setItem("velvetTheme", "light");
  } else {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
    localStorage.setItem("velvetTheme", "dark");
  }
});

let adminName = localStorage.getItem("adminName");
let adminRole = localStorage.getItem("adminRole");

if (adminName === null) {
  adminName = "User";
}
if (adminRole === null) {
  adminRole = "Store Owner";
}

function showAdminDetails() {
  document.getElementById("heroName").textContent = adminName;
  document.getElementById("chipName").textContent = adminName;
  document.getElementById("chipRole").textContent = adminRole;
  document.getElementById("avatarText").textContent = adminName.charAt(0).toUpperCase();
}

const modalBg = document.getElementById("profileBackdrop");
const openModalBtn = document.getElementById("openModalBtn");
const sidebarProfileBtn = document.getElementById("sidebarProfileBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

function openPopup(e) {
  e.preventDefault();
  document.getElementById("nameField").value = adminName;
  document.getElementById("roleField").value = adminRole;
  modalBg.classList.add("show");
}

openModalBtn.addEventListener("click", openPopup);
sidebarProfileBtn.addEventListener("click", openPopup);

closeModalBtn.addEventListener("click", function () {
  modalBg.classList.remove("show");
});

const adminForm = document.getElementById("adminForm");
adminForm.addEventListener("submit", function (e) {
  e.preventDefault();
  adminName = document.getElementById("nameField").value;
  adminRole = document.getElementById("roleField").value;

  localStorage.setItem("adminName", adminName);
  localStorage.setItem("adminRole", adminRole);

  showAdminDetails();
  modalBg.classList.remove("show");
});

let orders = JSON.parse(localStorage.getItem("myOrders"));

if (orders === null) {
  orders = [
    { id: "#101", customer: "Hina Tariq", product: "Lavender Silk Dress", price: 140, status: "Delivered" },
    { id: "#102", customer: "Zoya Ahmed", product: "Rose Quartz Serum", price: 65, status: "Pending" },
    { id: "#103", customer: "Mahnoor Ali", product: "Velvet Evening Bag", price: 95, status: "Shipped" }
  ];
}

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");

function displayOrders() {
  tableBody.innerHTML = "";
  const searchText = searchInput.value.toLowerCase();

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const nameMatch = order.customer.toLowerCase().includes(searchText);
    const productMatch = order.product.toLowerCase().includes(searchText);

    if (nameMatch || productMatch) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td><strong>" + order.id + "</strong></td>" +
        "<td>" + order.customer + "</td>" +
        "<td>" + order.product + "</td>" +
        "<td>$" + order.price + "</td>" +
        '<td><span class="tag tag-' + order.status + '">' + order.status + "</span></td>" +
        '<td><button class="del-btn" onclick="deleteOrder(' + i + ')">Delete</button></td>';
      tableBody.appendChild(tr);
    }
  }

  updateStats();
  localStorage.setItem("myOrders", JSON.stringify(orders));
}

function updateStats() {
  let revenue = 0;
  let pending = 0;

  for (let i = 0; i < orders.length; i++) {
    revenue = revenue + Number(orders[i].price);
    if (orders[i].status === "Pending") {
      pending = pending + 1;
    }
  }

  document.getElementById("revCount").textContent = "$" + revenue;
  document.getElementById("ordCount").textContent = orders.length;
  document.getElementById("penCount").textContent = pending;
}

const addOrderForm = document.getElementById("addOrderForm");
addOrderForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const customer = document.getElementById("custName").value;
  const product = document.getElementById("itemName").value;
  const price = Number(document.getElementById("itemPrice").value);
  const status = document.getElementById("itemStatus").value;
  const id = "#" + Math.floor(104 + Math.random() * 890);

  const newOrder = {
    id: id,
    customer: customer,
    product: product,
    price: price,
    status: status
  };

  orders.unshift(newOrder);
  addOrderForm.reset();
  displayOrders();
});

function deleteOrder(index) {
  orders.splice(index, 1);
  displayOrders();
}

searchInput.addEventListener("input", function () {
  displayOrders();
});

showAdminDetails();
displayOrders();
