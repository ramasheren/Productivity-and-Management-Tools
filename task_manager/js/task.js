let tasks = [];
let currTask = null;

const apiUrl = "http://localhost:5000/tasks";

const popup = document.getElementById("promptPopup");
const openBtn = document.getElementById("openFormBtn");
const closeBtn = document.getElementById("closeBtn");
const submitBtn = document.getElementById("submitBtn");
const taskIp = document.getElementById("taskIp");
const searchInput = document.getElementById("search");

/* ================= UI ================= */

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

function loadTasks() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      tasks = data;
      displayData();
    });
}

loadTasks();

function addTask() {
  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: taskIp.value,
      completed: false
    })
  }).then(() => {
    popup.style.display = "none";
    taskIp.value = "";
    loadTasks();
  });
}

function editTask() {
  const task = tasks[currTask];

  fetch(`${apiUrl}/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...task,
      text: taskIp.value
    })
  }).then(() => {
    currTask = null;
    popup.style.display = "none";
    taskIp.value = "";
    submitBtn.textContent = "Add task";
    loadTasks();
  });
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

function deleteTask(i) {
  fetch(`${apiUrl}/${tasks[i].id}`, {
    method: "DELETE"
  }).then(loadTasks);
}

function toggleTask(i) {
  const task = tasks[i];

  fetch(`${apiUrl}/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...task,
      completed: !task.completed
    })
  }).then(loadTasks);
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
