import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";
        return;

    }

    currentUser = user;

    loadProgress();

});

async function getCollection(name){

    const snapshot = await getDocs(

        collection(
            db,
            "users",
            currentUser.uid,
            name
        )

    );

    return snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}
// ===============================
// Load Progress
// ===============================

async function loadProgress() {

    const subjects = await getCollection("subjects");
    const tasks = await getCollection("tasks");
    const assignments = await getCollection("assignments");
    const exams = await getCollection("exams");
    const planner = await getCollection("planner");

    // Until Pomodoro is Firebase-connected
    const sessions =
        Number(localStorage.getItem("pomodoroSessions")) || 0;

    const streak =
        Number(localStorage.getItem("studyStreak")) || 1;

    // ===============================
    // Statistics
    // ===============================

    document.getElementById("subjectCount").innerText =
        subjects.length;

    const completedTasks =
        tasks.filter(task => task.completed).length;

    const pendingTasks =
        tasks.length - completedTasks;

    document.getElementById("taskCount").innerText =
        completedTasks;

    document.getElementById("pomodoroCount").innerText =
        sessions;

    document.getElementById("streakCount").innerText =
        streak;

    // ===============================
    // Progress Bars
    // ===============================

    const taskPercent =
        tasks.length > 0
            ? (completedTasks / tasks.length) * 100
            : 0;

    document.getElementById("taskProgress").style.width =
        taskPercent + "%";

    const studyGoal =
        Math.min(subjects.length * 20, 100);

    document.getElementById("studyProgress").style.width =
        studyGoal + "%";

    const pomodoroGoal =
        Math.min((sessions / 10) * 100, 100);

    document.getElementById("pomodoroProgress").style.width =
        pomodoroGoal + "%";

    // ===============================
    // Study Overview Chart
    // ===============================

    const studyCanvas =
        document.getElementById("studyChart");

    if (studyCanvas) {

        new Chart(studyCanvas, {

            type: "bar",

            data: {

                labels: [
                    "Subjects",
                    "Completed Tasks",
                    "Assignments",
                    "Exams",
                    "Planner"
                ],

                datasets: [{

                    label: "Study Overview",

                    data: [

                        subjects.length,

                        completedTasks,

                        assignments.length,

                        exams.length,

                        planner.length

                    ]

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        });

    }

    // ===============================
    // Task Status Chart
    // ===============================

    const taskCanvas =
        document.getElementById("taskChart");

    if (taskCanvas) {

        new Chart(taskCanvas, {

            type: "doughnut",

            data: {

                labels: [

                    "Completed",

                    "Pending"

                ],

                datasets: [{

                    data: [

                        completedTasks,

                        pendingTasks

                    ]

                }]

            },

            options: {

                responsive: true

            }

        });

    }

}