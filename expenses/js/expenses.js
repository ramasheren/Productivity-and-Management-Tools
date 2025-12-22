let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = null;

const list = document.getElementById("expensesList");
const popup = document.getElementById("popup");

document.getElementById("addBtn").onclick = () => {
  popup.style.display = "flex";
  editIndex = null;
};

document.getElementById("close").onclick = () => {
  popup.style.display = "none";
};

document.getElementById("save").onclick = () => {
  const name = document.getElementById("name").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;


  if (editIndex === null) {
    expenses.push({ name, amount, date });
  } else {
    expenses[editIndex] = { name, amount, date };
  }

  localStorage.setItem("expenses", JSON.stringify(expenses));
  popup.style.display = "none";
  clear();
  render();
};

function render() {
  list.innerHTML = "";
  expenses.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "expense";
    div.innerHTML = `
      <span>${e.name}<br><small>${e.date}</small></span>
      <span>${e.amount} EGP</span>
      <div class="actions">
        <i class="fa-solid fa-pen" onclick="edit(${i})"></i>
        <i class="fa-solid fa-trash" onclick="removeExp(${i})"></i>
      </div>
    `;
    list.appendChild(div);
  });
}

function removeExp(i) {
  expenses.splice(i, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}

function edit(i) {
  editIndex = i;
  popup.style.display = "flex";
  name.value = expenses[i].name;
  amount.value = expenses[i].amount;
  date.value = expenses[i].date;
}

function clear() {
  name.value = amount.value = date.value = "";
}

render();