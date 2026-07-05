import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ======================================
// Theme Colors
// ======================================

const isLight = document.body.classList.contains("light-theme");

const textColor = isLight
    ? "#0f172a"
    : "#ffffff";

const gridColor = isLight
    ? "#dbe4ee"
    : "rgba(255,255,255,.08)";

const primary = "#3b82f6";
const secondary = "#38bdf8";
const success = "#22c55e";
const warning = "#f59e0b";
const danger = "#ef4444";
const purple = "#8b5cf6";

// ======================================
// Authentication
// ======================================

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";
        return;

    }

    currentUser = user;

    loadAnalytics();

});

// ======================================
// Firestore Collection
// ======================================

async function getCollection(name) {

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

// ======================================
// Load Analytics
// ======================================

async function loadAnalytics() {

    const tasks =
        await getCollection("tasks");

    const assignments =
        await getCollection("assignments");

    const subjects =
        await getCollection("subjects");

    const exams =
        await getCollection("exams");

    const planner =
        await getCollection("planner");

    const pomodoroSessions =
        Number(
            localStorage.getItem(
                "pomodoroSessions"
            )
        ) || 0;

    // ===============================
    // Task Statistics
    // ===============================

    const completedTasks =
        tasks.filter(
            task => task.completed
        ).length;

    const pendingTasks =
        tasks.length -
        completedTasks;

    // ===============================
    // Assignment Statistics
    // ===============================

    const completedAssignments =
        assignments.filter(
            assignment =>
            assignment.completed
        ).length;

    const pendingAssignments =
        assignments.length -
        completedAssignments;

    // ===============================
    // Subject Statistics
    // ===============================

    const subjectLabels =
        subjects.map(
            subject => subject.name
        );

    const subjectValues =
        subjects.map(() => 1);

    // ===============================
    // Weekly Study Data
    // ===============================

    const studyHours = [

        planner.length,

        subjects.length,

        completedTasks,

        assignments.length,

        exams.length,

        pomodoroSessions,

        tasks.length

    ];
    // ======================================
// Weekly Study Chart
// ======================================

const studyCanvas =
document.getElementById("studyChart");

if (studyCanvas) {

new Chart(studyCanvas, {

    type: "bar",

    data: {

        labels: [

            "Planner",
            "Subjects",
            "Completed",
            "Assignments",
            "Exams",
            "Pomodoro",
            "Tasks"

        ],

        datasets: [{

            label: "Study Analytics",

            data: studyHours,

            backgroundColor: primary,

            borderRadius: 10

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                display: false

            }

        },

        scales: {

            x: {

                ticks: {

                    color: textColor

                },

                grid: {

                    color: gridColor

                }

            },

            y: {

                beginAtZero: true,

                ticks: {

                    color: textColor

                },

                grid: {

                    color: gridColor

                }

            }

        }

    }

});

}

// ======================================
// Task Chart
// ======================================

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

            ],

            backgroundColor: [

                success,

                danger

            ]

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                labels: {

                    color: textColor

                }

            }

        }

    }

});

}

// ======================================
// Assignment Chart
// ======================================

const assignmentCanvas =
document.getElementById("assignmentChart");

if (assignmentCanvas) {

new Chart(assignmentCanvas, {

    type: "pie",

    data: {

        labels: [

            "Completed",

            "Pending"

        ],

        datasets: [{

            data: [

                completedAssignments,

                pendingAssignments

            ],

            backgroundColor: [

                secondary,

                warning

            ]

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                labels: {

                    color: textColor

                }

            }

        }

    }

});

}

// ======================================
// Subject Chart
// ======================================

const subjectCanvas =
document.getElementById("subjectChart");

if (subjectCanvas) {

new Chart(subjectCanvas, {

    type: "bar",

    data: {

        labels: subjectLabels,

        datasets: [{

            label: "Subjects",

            data: subjectValues,

            backgroundColor: purple,

            borderRadius: 10

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                display: false

            }

        },

        scales: {

            x: {

                ticks: {

                    color: textColor

                },

                grid: {

                    color: gridColor

                }

            },

            y: {

                beginAtZero: true,

                ticks: {

                    color: textColor

                },

                grid: {

                    color: gridColor

                }

            }

        }

    }

});

}

}