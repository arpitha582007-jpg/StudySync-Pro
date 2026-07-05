// =======================================
// StudySync Pro - Common Sidebar
// =======================================

const currentPage = window.location.pathname.split("/").pop();

document.querySelector(".sidebar").innerHTML = `

<div class="logo">
📚 StudySync Pro
</div>

<div class="menu-container">

<ul class="menu">

<li class="${currentPage==="dashboard.html"?"active":""}"
onclick="location.href='dashboard.html'">
<i class="fa-solid fa-house"></i>
<span>Dashboard</span>
</li>

<li class="${currentPage==="planner.html"?"active":""}"
onclick="location.href='planner.html'">
<i class="fa-solid fa-calendar-days"></i>
<span>Planner</span>
</li>

<li class="${currentPage==="calendar.html"?"active":""}"
onclick="location.href='calendar.html'">
<i class="fa-solid fa-calendar"></i>
<span>Calendar</span>
</li>

<li class="${currentPage==="notifications.html"?"active":""}"
onclick="location.href='notifications.html'">
<i class="fa-solid fa-bell"></i>
<span>Notifications</span>
</li>

<li class="${currentPage==="subjects.html"?"active":""}"
onclick="location.href='subjects.html'">
<i class="fa-solid fa-book"></i>
<span>Subjects</span>
</li>

<li class="${currentPage==="tasks.html"?"active":""}"
onclick="location.href='tasks.html'">
<i class="fa-solid fa-list-check"></i>
<span>Tasks</span>
</li>

<li class="${currentPage==="pomodoro.html"?"active":""}"
onclick="location.href='pomodoro.html'">
<i class="fa-solid fa-clock"></i>
<span>Pomodoro</span>
</li>

<li class="${currentPage==="progress.html"?"active":""}"
onclick="location.href='progress.html'">
<i class="fa-solid fa-chart-line"></i>
<span>Progress</span>
</li>

<li class="${currentPage==="analytics.html"?"active":""}"
onclick="location.href='analytics.html'">
<i class="fa-solid fa-chart-pie"></i>
<span>Analytics</span>
</li>

<li class="${currentPage==="profile.html"?"active":""}"
onclick="location.href='profile.html'">
<i class="fa-solid fa-user"></i>
<span>Profile</span>
</li>

<li class="${currentPage==="settings.html"?"active":""}"
onclick="location.href='settings.html'">
<i class="fa-solid fa-gear"></i>
<span>Settings</span>
</li>

<li class="${currentPage==="exams.html"?"active":""}"
onclick="location.href='exams.html'">
<i class="fa-solid fa-graduation-cap"></i>
<span>Exams</span>
</li>

<li class="${currentPage==="assignments.html"?"active":""}"
onclick="location.href='assignments.html'">
<i class="fa-solid fa-file-lines"></i>
<span>Assignments</span>
</li>

</ul>

</div>

<div class="logout">

<li onclick="logout()">
<i class="fa-solid fa-right-from-bracket"></i>
<span>Logout</span>
</li>

</div>

`;