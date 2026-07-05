import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ===============================
// Elements
// ===============================

const plannerDate = document.getElementById("plannerDate");
const plannerTitle = document.getElementById("plannerTitle");
const plannerContainer = document.getElementById("plannerContainer");
const addPlannerBtn = document.getElementById("addPlannerBtn");
const plannerSearch = document.getElementById("plannerSearch");

let currentUser = null;
let plannerEvents = [];

// ===============================
// Authentication
// ===============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    currentUser = user;

    await loadPlanner();

});

// ===============================
// Load Planner
// ===============================

async function loadPlanner() {

    try {

        plannerEvents = [];

        const querySnapshot = await getDocs(
            collection(db, "users", currentUser.uid, "planner")
        );

        querySnapshot.forEach((docSnap) => {

            plannerEvents.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });

        renderPlanner();

    } catch (error) {

        console.error("Load Planner Error:", error);

    }

}

// ===============================
// Render Planner
// ===============================

function renderPlanner() {

    if (!plannerContainer) return;

    plannerContainer.innerHTML = "";

    plannerEvents.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    const keyword = plannerSearch
        ? plannerSearch.value.toLowerCase()
        : "";

    const filteredEvents = plannerEvents.filter(event =>
        event.title.toLowerCase().includes(keyword)
    );

    if (filteredEvents.length === 0) {

        plannerContainer.innerHTML =
            "<p>No events added.</p>";

        return;

    }

    filteredEvents.forEach((event) => {

        plannerContainer.innerHTML += `

        <div class="planner-card">

            <h3>📚 ${event.title}</h3>

            <p>📅 ${event.date}</p>

            <button
                class="delete-btn"
                onclick="deletePlanner('${event.id}')">

                Delete

            </button>

        </div>

        `;

    });

}

// ===============================
// Add Planner Event
// ===============================

async function addPlanner() {

    if (
        !plannerDate ||
        !plannerTitle ||
        !currentUser
    ) return;

    if (
        plannerDate.value === "" ||
        plannerTitle.value.trim() === ""
    ) {

        alert("Please fill all fields.");
        return;

    }

    try {

        await addDoc(

            collection(
                db,
                "users",
                currentUser.uid,
                "planner"
            ),

            {
                date: plannerDate.value,
                title: plannerTitle.value.trim()
            }

        );

        plannerDate.value = "";
        plannerTitle.value = "";

        if (typeof showToast === "function") {
            showToast("Planner Event Added!");
        }

        await loadPlanner();

    } catch (error) {

        console.error("Add Planner Error:", error);

    }

}

// ===============================
// Delete Planner Event
// ===============================

async function deletePlanner(id) {

    try {

        await deleteDoc(

            doc(
                db,
                "users",
                currentUser.uid,
                "planner",
                id
            )

        );

        if (typeof showToast === "function") {
            showToast("Planner Event Deleted!");
        }

        await loadPlanner();

    } catch (error) {

        console.error("Delete Planner Error:", error);

    }

}

// ===============================
// Events
// ===============================

if (addPlannerBtn) {

    addPlannerBtn.addEventListener(
        "click",
        addPlanner
    );

}

if (plannerSearch) {

    plannerSearch.addEventListener(
        "input",
        renderPlanner
    );

}

// ===============================
// Global Access
// ===============================

window.deletePlanner = deletePlanner;