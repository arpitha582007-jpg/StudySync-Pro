import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const notificationContainer =
document.getElementById("notificationContainer");

let currentUser = null;

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";
        return;

    }

    currentUser = user;

    loadNotifications();

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
// Load Notifications
// ===============================

async function loadNotifications() {

    const assignments = await getCollection("assignments");
    const exams = await getCollection("exams");
    const planner = await getCollection("planner");
    const tasks = await getCollection("tasks");

    const notifications = [];

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split("T")[0];

    // ===========================
    // Assignment Due Today
    // ===========================

    assignments.forEach(item => {

        if (item.date === todayString && !item.completed) {

            notifications.push({

                type: "assignment",

                title: "📚 Assignment Due Today",

                message: item.title,

                date: item.date

            });

        }

    });

    // ===========================
    // Exam Tomorrow
    // ===========================

    exams.forEach(item => {

        if (item.date === tomorrowString) {

            notifications.push({

                type: "exam",

                title: "🎓 Exam Tomorrow",

                message: item.subject,

                date: item.date

            });

        }

    });

    // ===========================
    // Planner Today
    // ===========================

    planner.forEach(item => {

        if (item.date === todayString) {

            notifications.push({

                type: "planner",

                title: "📅 Today's Planner",

                message: item.title,

                date: item.date

            });

        }

    });

    // ===========================
    // High Priority Tasks
    // ===========================

    tasks.forEach(item => {

        if (
            item.priority === "High" &&
            !item.completed
        ) {

            notifications.push({

                type: "task",

                title: "🔥 High Priority Task",

                message: item.name,

                date: ""

            });

        }

    });

    renderNotifications(notifications);

}

// ===============================
// Render Notifications
// ===============================

function renderNotifications(notifications) {

    notificationContainer.innerHTML = "";

    if (notifications.length === 0) {

        notificationContainer.innerHTML =
            "<p>No notifications 🎉</p>";

        return;

    }

    notifications.forEach(notification => {

        notificationContainer.innerHTML += `

        <div class="notification-card ${notification.type}">

            <div class="notification-title">

                ${notification.title}

            </div>

            <div class="notification-message">

                ${notification.message}

            </div>

            <div class="notification-date">

                ${notification.date}

            </div>

        </div>

        `;

    });

}