import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";
        return;

    }

    currentUser = user;

    updateDashboard();

});

async function getCollectionData(name) {

    const snapshot = await getDocs(

        collection(
            db,
            "users",
            currentUser.uid,
            name
        )

    );

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

}

// ===============================
// Dashboard
// ===============================

async function updateDashboard() {

    // Load Collections
    const tasks = await getCollectionData("tasks");
    const subjects = await getCollectionData("subjects");
    const assignments = await getCollectionData("assignments");
    const exams = await getCollectionData("exams");
    const planner = await getCollectionData("planner");

    // =========================
    // Statistics Cards
    // =========================

    const cards = document.querySelectorAll(".stat-card h2");

    if (cards.length >= 7) {

        // Today's Tasks
        cards[0].innerText = tasks.length;

        // Planner Events
        cards[1].innerText = planner.length;

        // Subjects
        cards[2].innerText = subjects.length;

        // Productivity
        const completed =
            tasks.filter(task => task.completed).length;

        const productivity =
            tasks.length > 0
                ? Math.round((completed / tasks.length) * 100)
                : 0;

        cards[3].innerText = productivity + "%";

        // Assignments
        cards[4].innerText = assignments.length;

        // Pending Assignments
        const pending =
            assignments.filter(a => !a.completed).length;

        cards[5].innerText = pending;

        // Upcoming Exams
        cards[6].innerText = exams.length;

    }

    // =========================
    // Welcome Message
    // =========================

    const welcome =
        document.getElementById("welcomeName");

    if (welcome) {

        const profileRef = doc(
            db,
            "profiles",
            currentUser.uid
        );

        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {

            const profile = profileSnap.data();

            welcome.innerText =
                `Welcome Back, ${profile.name} 👋`;

        }

    }

    // =========================
    // Upcoming Tasks
    // =========================

    const taskBox =
        document.getElementById("dashboardTasks");

    if (taskBox) {

        taskBox.innerHTML = "";

        if (tasks.length === 0) {

            taskBox.innerHTML =
                "<li>No upcoming tasks</li>";

        } else {

            tasks.slice(0, 3).forEach(task => {

                taskBox.innerHTML += `

                <li style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:12px 0;
                    border-bottom:1px solid rgba(255,255,255,.1);
                ">

                    <span>${task.name}</span>

                    <span style="
                        color:#38bdf8;
                        font-weight:600;
                    ">
                        ${task.priority}
                    </span>

                </li>

                `;

            });

        }

    }

    // =========================
    // Today's Schedule
    // =========================

    const scheduleBox =
        document.getElementById("todaySchedule");

    if (scheduleBox) {

        scheduleBox.innerHTML = "";

        const today =
            new Date().toISOString().split("T")[0];

        const todayEvents = planner.filter(event =>
            event.date === today
        );

        if (todayEvents.length === 0) {

            scheduleBox.innerHTML =
                "<li>No events scheduled for today.</li>";

        } else {

            todayEvents.sort((a, b) =>
                (a.time || "").localeCompare(b.time || "")
            );

            todayEvents.forEach(event => {

                scheduleBox.innerHTML += `

                <li style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:12px 0;
                    border-bottom:1px solid rgba(255,255,255,.1);
                ">

                    <span>
                        ${event.time || "--:--"}
                    </span>

                    <span>
                        ${event.title}
                    </span>

                </li>

                `;

            });

        }

    }

}