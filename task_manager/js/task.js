let tasks = [];
let currTask = null;

const currUser = JSON.parse(localStorage.getItem("loggedUser"));
const apiUrl = `http://localhost:5000/users/${currUser.id}`;

const popup = document.getElementById("promptPopup");
const openBtn = document.getElementById("openFormBtn");
const closeBtn = document.getElementById("closeBtn");
const submitBtn = document.getElementById("submitBtn");
const taskIp = document.getElementById("taskIp");
const searchInput = document.getElementById("search");
const nameEl = document.querySelector(".username");
const emlEl = document.getElementById("eml");
if (emlEl) emlEl.innerHTML = currUser.email;
nameEl.innerHTML = currUser.name;

openBtn.onclick = () => {
  popup.style.display = "flex";
  submitBtn.textContent = "Add task";
  taskIp.value = "";
  currTask = null;
};

closeBtn.onclick = () => popup.style.display = "none";
submitBtn.onclick = handleSubmit;

function handleSubmit() {
  if (!taskIp.value.trim()) return;
  currTask === null ? addTask() : editTask();
}

async function loadTasks() {
  const res = await fetch(apiUrl);
  const user = await res.json();
  if (!user.tasks) {
    user.tasks = [];
    await fetch(apiUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: user.tasks })
    });
  }
  tasks = user.tasks;
  displayData();
}

loadTasks();

async function addTask() {
  const newTask = { id: Date.now(), text: taskIp.value, completed: false };
  tasks.push(newTask);
  await fetch(apiUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks: tasks })
  });
  popup.style.display = "none";
  taskIp.value = "";
  await loadTasks();
}

async function editTask() {
  tasks[currTask].text = taskIp.value;
  await fetch(apiUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks: tasks })
  });
  currTask = null;
  popup.style.display = "none";
  taskIp.value = "";
  submitBtn.textContent = "Add task";
  await loadTasks();
}

function displayData() {
  let container = "";
  let sorted = tasks.slice().sort((a, b) => a.completed - b.completed);
  sorted.forEach(task => {
    let index = tasks.findIndex(t => t.id === task.id);
    let checked = task.completed ? "checked" : "";
    let style = task.completed ? "text-decoration:line-through;opacity:.5" : "";
    container += `
      <div class="task-item">
        <label>
          <input type="checkbox" ${checked} onchange="toggleTask(${index})">
          <span class="task-text" style="${style}">${task.text}</span>
        </label>
        <div class="action">
          <i class="fa-solid fa-pen-to-square edit-btn" onclick="getTask(${index})"></i>
          <i class="fa-solid fa-trash delete-btn" onclick="deleteTask(${index})"></i>
        </div>
      </div>
    `;
  });
  document.getElementById("tasksd").innerHTML = container;
}

async function deleteTask(i) {
  tasks.splice(i, 1);
  await fetch(apiUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks: tasks })
  });
  await loadTasks();
}

async function toggleTask(i) {
  tasks[i].completed = !tasks[i].completed;
  await fetch(apiUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks: tasks })
  });
  await loadTasks();
}

function getTask(i) {
  currTask = i;
  taskIp.value = tasks[i].text;
  submitBtn.textContent = "Edit task";
  popup.style.display = "flex";
}

searchInput.addEventListener("input", () => {
  let key = searchInput.value.toLowerCase();
  document.querySelectorAll(".task-item").forEach(item => {
    let text = item.querySelector(".task-text").textContent.toLowerCase();
    item.style.display = text.includes(key) ? "flex" : "none";
  });
});
