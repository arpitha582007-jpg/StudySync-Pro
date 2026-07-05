// ======================================
// StudySync Pro - Calendar
// ======================================

const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const eventList = document.getElementById("eventList");

const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let currentDate = new Date();

// Planner Events
const plannerEvents =
JSON.parse(localStorage.getItem("plannerEvents")) || [];

// =============================
// Render Calendar
// =============================

function renderCalendar(){

    calendarDays.innerHTML="";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay =
    new Date(year,month,1).getDay();

    const lastDate =
    new Date(year,month+1,0).getDate();

    monthYear.innerText =
    currentDate.toLocaleString("default",{
        month:"long",
        year:"numeric"
    });

    // Empty boxes
    for(let i=0;i<firstDay;i++){

        calendarDays.innerHTML +=
        `<div class="day empty"></div>`;

    }

    // Dates
    for(let day=1;day<=lastDate;day++){

        const fullDate =
        `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

        const today = new Date();

        const isToday =
        day===today.getDate() &&
        month===today.getMonth() &&
        year===today.getFullYear();

        const hasEvent =
        plannerEvents.some(
            event=>event.date===fullDate
        );

        calendarDays.innerHTML +=`

        <div
        class="day ${isToday?"today":""} ${hasEvent?"has-event":""}"
        onclick="showEvents('${fullDate}')">

        <div class="day-number">
        ${day}
        </div>

        </div>

        `;

    }

}

// =============================
// Show Events
// =============================

function showEvents(date){

    eventList.innerHTML="";

    const events =
    plannerEvents.filter(
        event=>event.date===date
    );

    if(events.length===0){

        eventList.innerHTML=
        "<p>No events on this date.</p>";

        return;

    }

    events.forEach(event=>{

        eventList.innerHTML +=`

        <div class="event-item">

        📚 ${event.title}

        </div>

        `;

    });

}

// =============================
// Month Buttons
// =============================

prevBtn.onclick=()=>{

    currentDate.setMonth(
        currentDate.getMonth()-1
    );

    renderCalendar();

};

nextBtn.onclick=()=>{

    currentDate.setMonth(
        currentDate.getMonth()+1
    );

    renderCalendar();

};

// =============================

renderCalendar();