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
    document.getElementById("taskCount").innerText = tasks.length;

    document.getElementById("studyHours").innerText = planner.length + "h";
    
    document.getElementById("subjectCount").innerText = subjects.length;
    
    const completed = tasks.filter(task => task.completed).length;
    
    const productivity = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;
    
    document.getElementById("productivity").innerText = productivity + "%";
    
    document.getElementById("assignmentCount").innerText = assignments.length;
    
    document.getElementById("pendingAssignmentCount").innerText =
        assignments.filter(a => !a.completed).length;
    
    document.getElementById("examCount").innerText = exams.length;
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