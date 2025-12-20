const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function renderCalendar(month, year) {
  calendarDays.innerHTML = "";
  monthYear.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendarDays.appendChild(document.createElement("div"));
  }

  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement("div");
    day.textContent = i;
    day.onclick = () => openPopup(i);

    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      day.classList.add("today");
    }

    calendarDays.appendChild(day);
  }
}

prevBtn.onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
};

nextBtn.onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
};

renderCalendar(currentMonth, currentYear);

let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
let selectedDate = null;

const popup = document.getElementById("promptPopup");
const closeBtn = document.getElementById("closeBtn");
const submitBtn = document.getElementById("submitBtn");
const eventIp = document.getElementById("eventIp");
const dateDisplay = document.getElementById("date");

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function openPopup(day) {
  selectedDate = formatDate(currentYear, currentMonth, day);
  popup.style.display = "flex";
  dateDisplay.textContent = selectedDate;
  eventIp.value = "";
}

closeBtn.onclick = () => {
  popup.style.display = "none";
  selectedDate = null;
};

submitBtn.onclick = () => {
  if (!eventIp.value.trim() || !selectedDate) return;

  eventos.push({
    date: selectedDate,
    text: eventIp.value.trim()
  });

  localStorage.setItem("eventos", JSON.stringify(eventos));
  popup.style.display = "none";
  eventIp.value = "";
  displayEvents();
};

function displayEvents() {
  const eventsBox = document.getElementsByClassName("events")[0];
  let container = "";

  if (eventos.length === 0) {
    eventsBox.innerHTML = `<p class="empty">No events yet</p>`;
    return;
  }

  eventos.forEach((event, index) => {
    container += `
      <div class="event-item">
        <div class="event-info">
          <span class="event-date">${event.date}</span>
          <br>
          <span class="event-text">${event.text}</span>
        </div>
        <i class="fa-solid fa-trash delete-btn"
           onclick="deleteEventByIndex(${index})"></i>
      </div>
    `;
  });

  eventsBox.innerHTML = container;
}

function deleteEventByIndex(index) {
  eventos.splice(index, 1);
  localStorage.setItem("eventos", JSON.stringify(eventos));
  displayEvents();
}

displayEvents();
