const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

const popup = document.getElementById("promptPopup");
const closeBtn = document.getElementById("closeBtn");
const submitBtn = document.getElementById("submitBtn");
const eventIp = document.getElementById("eventIp");
const dateDisplay = document.getElementById("date");
const nameEl = document.querySelector(".username");
const emlEl = document.getElementById("eml");

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const currUser = JSON.parse(localStorage.getItem("loggedUser")) || { id: 1, name: "Guest" };
const apiUrl = `http://localhost:5000/users/${currUser.id}`;

if (emlEl) emlEl.innerHTML = currUser.email;
if (nameEl) nameEl.innerHTML = currUser.name;

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function renderCalendar(month, year) {
  calendarDays.innerHTML = "";
  monthYear.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) calendarDays.appendChild(document.createElement("div"));

  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement("div");
    day.textContent = i;

    // highlight days with events
    const dayStr = formatDate(year, month, i);
    if (events.some(e => e.date === dayStr)) day.style.backgroundColor = "#e0ffe0";

    day.onclick = () => openPopup(i);

    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear())
      day.classList.add("today");

    calendarDays.appendChild(day);
  }
}

prevBtn.onclick = () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar(currentMonth, currentYear);
};

nextBtn.onclick = () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar(currentMonth, currentYear);
};

let events = [];
let currEvent = null;
let selectedDate = null;

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function openPopup(day) {
  selectedDate = formatDate(currentYear, currentMonth, day);
  dateDisplay.textContent = selectedDate;
  popup.style.display = "flex";
  eventIp.value = "";
  currEvent = null;
  submitBtn.textContent = "Add event";
}

closeBtn.onclick = () => { popup.style.display = "none"; selectedDate = null; };
submitBtn.onclick = handleSubmit;

function handleSubmit() {
  if (!eventIp.value.trim() || !selectedDate) return;
  currEvent === null ? addEvent() : editEvent();
}

async function loadEvents() {
  const res = await fetch(apiUrl);
  const user = await res.json();

  if (!user.events) {
    user.events = [];
    await fetch(apiUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: user.events })
    });
  }

  events = user.events;
  displayEvents();
  renderCalendar(currentMonth, currentYear); // refresh calendar highlights
}

async function addEvent() {
  const newEvent = { id: Date.now(), date: selectedDate, text: eventIp.value };
  events.push(newEvent);

  await fetch(apiUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events })
  });

  popup.style.display = "none";
  eventIp.value = "";
  await loadEvents();
}

async function editEvent() {
  events[currEvent].text = eventIp.value;

  await fetch(apiUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events })
  });

  currEvent = null;
  popup.style.display = "none";
  eventIp.value = "";
  submitBtn.textContent = "Add event";
  await loadEvents();
}

async function deleteEvent(i) {
  events.splice(i, 1);

  await fetch(apiUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events })
  });

  await loadEvents();
}

function getEvent(i) {
  currEvent = i;
  eventIp.value = events[i].text;
  selectedDate = events[i].date;
  dateDisplay.textContent = selectedDate;
  submitBtn.textContent = "Edit event";
  popup.style.display = "flex";
}

function displayEvents() {
  const eventsBox = document.getElementsByClassName("events")[0];
  if (events.length === 0) {
    eventsBox.innerHTML = `<p class="empty">No events yet</p>`;
    return;
  }

  let container = "";
  events.forEach((event, index) => {
    container += `
      <div class="event-item">
        <div class="event-info">
          <span class="event-date">${event.date}</span><br>
          <span class="event-text">${event.text}</span>
        </div>
        <div class="action">
          <i class="fa-solid fa-pen-to-square" onclick="getEvent(${index})"></i>
          <i class="fa-solid fa-trash" onclick="deleteEvent(${index})"></i>
        </div>
      </div>
    `;
  });

  eventsBox.innerHTML = container;
}

renderCalendar(currentMonth, currentYear);
loadEvents();
