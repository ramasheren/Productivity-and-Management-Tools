let tasks = [];
let currTask = 0;
let taskIp = document.getElementById("taskIp");
let submitBtn = document.getElementById("submitBtn");
const searchInput = document.getElementById("search");

if (JSON.parse(localStorage.getItem('tasks')) != null) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  displayData();
}

submitBtn.onclick = function () {
  if (submitBtn.innerHTML === "Add task") addTask();
  else updateTask();
  taskIp.value = "";
  displayData();
};

function displayData() {
  let container = "";
  const sortedTasks = tasks.slice().sort((a, b) => a.completed - b.completed);

  sortedTasks.forEach((task) => {
  const originalIndex = tasks.indexOf(task);
  const checked = task.completed ? "checked" : ""; 
  const style = task.completed ? 'style="text-decoration: line-through; opacity: 0.5;"' : "";

  container += `
    <div class="task-item">
      <label>
        <input type="checkbox" class="task-checkbox" ${checked} onchange="checkTask(${originalIndex}, this)">
        <span class="task-text" ${style}>${task.text}</span>
      </label>
      <div class="action">
        <i class="fa-solid fa-pen-to-square edt act" onclick="getTask(${originalIndex})"></i>
        <i class="fa-solid fa-trash trsh act" onclick="deleteTask(${originalIndex})"></i>
      </div>
    </div>
  `;
});

  document.getElementById("tasksd").innerHTML = container;
}


// add task
function addTask() {
  tasks.push({ text: taskIp.value, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayData();
}

// get task to edit
function getTask(index) {
  taskIp.value = tasks[index].text;
  submitBtn.innerHTML = "Edit task";
  currTask = index;
}

// update task
function updateTask() {
  tasks[currTask].text = taskIp.value;
  submitBtn.innerHTML = "Add task";
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//auto search
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  document.querySelectorAll("#tasksd .task-item").forEach(taskItem => {
    const text = taskItem.querySelector(".task-text").textContent.toLowerCase();
    taskItem.style.display = text.includes(keyword) ? "flex" : "none";
  });
});

//checkbox style and move task
function checkTask(index, checkbox) {
  tasks[index].completed = checkbox.checked;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  const taskEl = checkbox.closest(".task-item");
  if (checkbox.checked) {
    taskEl.querySelector(".task-text").style.textDecoration = "line-through";
    taskEl.querySelector(".task-text").style.opacity = "0.5";
    document.getElementById("tasksd").appendChild(taskEl);
  } else {
    taskEl.querySelector(".task-text").style.textDecoration = "none";
    taskEl.querySelector(".task-text").style.opacity = "1";
    document.getElementById("tasksd").prepend(taskEl);
  }
}

