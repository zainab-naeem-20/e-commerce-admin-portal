const todayDate = document.getElementById('todayDate');
todayDate.textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric'
});

const themeToggle = document.getElementById('themeToggle');
const moonSvg = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
const sunSvg = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

function applyTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = sunSvg;
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.innerHTML = moonSvg;
  }
}

const savedTheme = localStorage.getItem('velvetTheme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  const nextTheme = isDark ? 'dark' : 'light';
  localStorage.setItem('velvetTheme', nextTheme);
  applyTheme(nextTheme);
});

let adminData = JSON.parse(localStorage.getItem('velvetAdmin')) || {
  name: 'Zainab Naeem',
  role: 'Store Owner'
};

function syncAdmin() {
  document.getElementById('heroName').textContent = adminData.name.split(' ');
  document.getElementById('chipName').textContent = adminData.name;
  document.getElementById('chipRole').textContent = adminData.role;

  const letters = adminData.name
    .split(' ')
    .map(part => part)
    .join('')
    .toUpperCase()
    .slice(0, 2);

  document.getElementById('avatarText').textContent = letters || 'AD';
}

const backdrop = document.getElementById('profileBackdrop');
const triggers = [
  document.getElementById('openModalBtn'),
  document.getElementById('sidebarProfileBtn')
];

triggers.forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('nameField').value = adminData.name;
    document.getElementById('roleField').value = adminData.role;
    backdrop.classList.add('show');
  });
});

document.getElementById('closeModalBtn').addEventListener('click', () => {
  backdrop.classList.remove('show');
});

document.getElementById('adminForm').addEventListener('submit', e => {
  e.preventDefault();
  adminData.name = document.getElementById('nameField').value.trim();
  adminData.role = document.getElementById('roleField').value.trim();
  localStorage.setItem('velvetAdmin', JSON.stringify(adminData));
  syncAdmin();
  backdrop.classList.remove('show');
});

let orderList = JSON.parse(localStorage.getItem('velvetOrderList')) || [
  { id: '#101', customer: 'Hina Tariq', product: 'Lavender Silk Dress', price: 140, status: 'Delivered' },
  { id: '#102', customer: 'Zoya Ahmed', product: 'Rose Quartz Serum', price: 65, status: 'Pending' },
  { id: '#103', customer: 'Mahnoor Ali', product: 'Velvet Evening Bag', price: 95, status: 'Shipped' }
];

const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');

function drawTable(query = '') {
  tableBody.innerHTML = '';

  const results = orderList.filter(item =>
    item.customer.toLowerCase().includes(query.toLowerCase()) ||
    item.product.toLowerCase().includes(query.toLowerCase())
  );

  results.forEach(item => {
    const idx = orderList.findIndex(o => o.id === item.id);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${item.id}</strong></td>
      <td>${item.customer}</td>
      <td>${item.product}</td>
      <td>$${item.price}</td>
      <td><span class="tag tag-${item.status}">${item.status}</span></td>
      <td><button class="del-btn" data-index="${idx}">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });

  refreshStats();
  localStorage.setItem('velvetOrderList', JSON.stringify(orderList));
}

function refreshStats() {
  const revenue = orderList.reduce((acc, cur) => acc + Number(cur.price), 0);
  const pending = orderList.filter(cur => cur.status === 'Pending').length;

  document.getElementById('revCount').textContent = `$${revenue.toLocaleString()}`;
  document.getElementById('ordCount').textContent = orderList.length;
  document.getElementById('penCount').textContent = pending;
}

document.getElementById('addOrderForm').addEventListener('submit', e => {
  e.preventDefault();
  const customer = document.getElementById('custName').value.trim();
  const product = document.getElementById('itemName').value.trim();
  const price = Number(document.getElementById('itemPrice').value);
  const status = document.getElementById('itemStatus').value;
  const id = '#' + Math.floor(104 + Math.random() * 890);

  orderList.unshift({ id, customer, product, price, status });
  e.target.reset();
  drawTable(searchInput.value);
});

tableBody.addEventListener('click', e => {
  if (e.target.classList.contains('del-btn')) {
    const idx = e.target.getAttribute('data-index');
    orderList.splice(idx, 1);
    drawTable(searchInput.value);
  }
});

searchInput.addEventListener('input', e => {
  drawTable(e.target.value);
});

syncAdmin();
drawTable();
