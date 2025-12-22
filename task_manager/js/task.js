let tasks = [];
let currTask = null;

const popup = document.getElementById("promptPopup");
const openBtn = document.getElementById("openFormBtn");
const closeBtn = document.getElementById("closeBtn");
const submitBtn = document.getElementById("submitBtn");
const taskIp = document.getElementById("taskIp");
const searchInput = document.getElementById("search");
const nameEl = document.querySelector(".username"); // class selector

// Get the logged-in user
const user = JSON.parse(localStorage.getItem("loggedUser"));

nameEl.innerHTML = user.name;

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  displayData();
}

openBtn.onclick = () => {
  popup.style.display = "flex";
  submitBtn.textContent = "Add task";
  taskIp.value = "";
  currTask = null;
};

closeBtn.onclick = () => popup.style.display = "none";

submitBtn.onclick = () => {
  if (!taskIp.value.trim()) return;

  if (currTask === null) {
    tasks.push({ text: taskIp.value, completed: false });
  } else {
    tasks[currTask].text = taskIp.value;
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  popup.style.display = "none";
  displayData();
};

function displayData() {
  let container = "";
  let sorted = tasks.slice().sort((a,b) => a.completed - b.completed);

  sorted.forEach(task => {
    let index = tasks.indexOf(task);
    let checked = task.completed ? "checked" : "";
    let style = task.completed ? "text-decoration:line-through;opacity:.5" : "";

    container += `
      <div class="task-item">
        <label>
          <input type="checkbox" ${checked} onchange="toggleTask(${index})">
          <span class="task-text" style="${style}">${task.text}</span>
        </label>
        C
      </div>
    `;
  });

  document.getElementById("tasksd").innerHTML = container;
}

function deleteTask(i) {
  tasks.splice(i,1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayData();
}

function editTask(i) {
  taskIp.value = tasks[i].text;
  submitBtn.textContent = "Edit task";
  currTask = i;
  popup.style.display = "flex";
}

function toggleTask(i) {
  tasks[i].completed = !tasks[i].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayData();
}

searchInput.addEventListener("input", () => {
  let key = searchInput.value.toLowerCase();
  document.querySelectorAll(".task-item").forEach(item => {
    let text = item.querySelector(".task-text").textContent.toLowerCase();
    item.style.display = text.includes(key) ? "flex" : "none";
  });
});
