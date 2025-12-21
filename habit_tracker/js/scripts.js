const STORAGE_KEY = "habitTrackerData";
const saveStatus = document.getElementById("saveStatus");

document.addEventListener("DOMContentLoaded", () => {
  const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  document.querySelectorAll(".habit").forEach(habit => {
    const habitId = habit.dataset.id;
    const checkboxes = habit.querySelectorAll("input[type='checkbox']");

    if (!savedData[habitId]) return;

    checkboxes.forEach((cb, index) => {
      cb.checked = savedData[habitId][index] || false;
    });
  });
});

document.getElementById("submitBtn").addEventListener("click", () => {
  const result = {};

  document.querySelectorAll(".habit").forEach(habit => {
    const habitId = habit.dataset.id;
    const checkboxes = habit.querySelectorAll("input[type='checkbox']");

    result[habitId] = Array.from(checkboxes).map(cb => cb.checked);
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));

  saveStatus.classList.add("show");

  setTimeout(() => {
    saveStatus.classList.remove("show");
  }, 2000);
  console.log("Saved habit data:", result);
});

