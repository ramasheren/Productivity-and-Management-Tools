const saveStatus = document.getElementById("saveStatus");
const currUser = JSON.parse(localStorage.getItem("loggedUser")) || { id: 1, name: "Guest" };
const apiUrl = `http://localhost:5000/users/${currUser.id}`;
const nameEl = document.querySelector(".username");
if (nameEl) nameEl.innerHTML = currUser.name;
const emlEl = document.getElementById("eml");
if (emlEl) emlEl.innerHTML = currUser.email;

async function loadHabits() {
  const res = await fetch(apiUrl);
  const user = await res.json();
  const savedData = user.habits || {};

  document.querySelectorAll(".habit").forEach(habit => {
    const habitId = habit.dataset.id;
    const checkboxes = habit.querySelectorAll("input[type='checkbox']");
    if (!savedData[habitId]) return;
    checkboxes.forEach((cb, index) => cb.checked = savedData[habitId][index] || false);
  });
}

async function saveHabits() {
  const res = await fetch(apiUrl);
  const user = await res.json();

  const result = {};
  document.querySelectorAll(".habit").forEach(habit => {
    const habitId = habit.dataset.id;
    const checkboxes = habit.querySelectorAll("input[type='checkbox']");
    result[habitId] = Array.from(checkboxes).map(cb => cb.checked);
  });

  const updatedUser = { ...user, habits: result };

  await fetch(apiUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser)
  });

  saveStatus.classList.add("show");
  setTimeout(() => saveStatus.classList.remove("show"), 2000);

  console.log("Saved habit data:", result);
}

document.addEventListener("DOMContentLoaded", loadHabits);
document.getElementById("submitBtn").addEventListener("click", saveHabits);
