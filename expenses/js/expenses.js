let expenses = [];
let editIndex = null;

const list = document.getElementById("expensesList");
const popup = document.getElementById("popup");

const currUser = JSON.parse(localStorage.getItem("loggedUser")) || { id: 1, name: "Guest" };
const apiUrl = `http://localhost:5000/users/${currUser.id}`;
const nameEl = document.querySelector(".username");
if (nameEl) nameEl.innerHTML = currUser.name;
const emlEl = document.getElementById("eml");
if (emlEl) emlEl.innerHTML = currUser.email;
document.getElementById("addBtn").onclick = () => {
  popup.style.display = "flex";
  editIndex = null;
};

document.getElementById("close").onclick = () => {
  popup.style.display = "none";
};

document.getElementById("save").onclick = saveExpense;

async function loadExpenses() {
  const res = await fetch(apiUrl);
  const user = await res.json();
  expenses = user.expenses || [];
  render();
}

async function saveExpense() {
  const nameVal = document.getElementById("name").value.trim();
  const amountVal = document.getElementById("amount").value.trim();
  const dateVal = document.getElementById("date").value.trim();

  if (!nameVal || !amountVal || !dateVal) return;

  if (editIndex === null) {
    expenses.push({ name: nameVal, amount: amountVal, date: dateVal });
  } else {
    expenses[editIndex] = { name: nameVal, amount: amountVal, date: dateVal };
  }

  const res = await fetch(apiUrl);
  const user = await res.json();
  const updatedUser = { ...user, expenses };

  await fetch(apiUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser)
  });

  popup.style.display = "none";
  clearInputs();
  editIndex = null;
  render();
}

function render() {
  list.innerHTML = "";
  expenses.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "expense";
    div.innerHTML = `
      <span>${e.name}<br><small>${e.date}</small></span>
      <span>${e.amount} EGP</span>
      <div class="actions">
        <i class="fa-solid fa-pen" onclick="editExpense(${i})"></i>
        <i class="fa-solid fa-trash" onclick="removeExpense(${i})"></i>
      </div>
    `;
    list.appendChild(div);
  });
}

async function removeExpense(i) {
  expenses.splice(i, 1);

  const res = await fetch(apiUrl);
  const user = await res.json();
  const updatedUser = { ...user, expenses };

  await fetch(apiUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser)
  });

  render();
}

function editExpense(i) {
  editIndex = i;
  popup.style.display = "flex";
  document.getElementById("name").value = expenses[i].name;
  document.getElementById("amount").value = expenses[i].amount;
  document.getElementById("date").value = expenses[i].date;
}

function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";
}

loadExpenses();
