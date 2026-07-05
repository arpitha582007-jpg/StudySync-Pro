import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ===============================
// Elements
// ===============================

const title = document.getElementById("assignmentTitle");
const subject = document.getElementById("assignmentSubject");
const date = document.getElementById("assignmentDate");
const priority = document.getElementById("assignmentPriority");
const container = document.getElementById("assignmentContainer");
const assignmentSearch = document.getElementById("assignmentSearch");
const addAssignmentBtn = document.getElementById("addAssignment");

let currentUser = null;
let assignments = [];

// ===============================
// Authentication
// ===============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";
        return;

    }

    currentUser = user;

    loadAssignments();

});

// ===============================
// Load Assignments
// ===============================

async function loadAssignments() {

    assignments = [];

    const querySnapshot = await getDocs(

        collection(
            db,
            "users",
            currentUser.uid,
            "assignments"
        )

    );

    querySnapshot.forEach((document) => {

        assignments.push({

            id: document.id,

            ...document.data()

        });

    });

    renderAssignments();

}
// ===============================
// Render Assignments
// ===============================

function renderAssignments() {

    container.innerHTML = "";

    const keyword =
        assignmentSearch
            ? assignmentSearch.value.toLowerCase()
            : "";

    const filteredAssignments = assignments.filter(assignment =>

        assignment.title.toLowerCase().includes(keyword) ||

        assignment.subject.toLowerCase().includes(keyword)

    );

    if (filteredAssignments.length === 0) {

        container.innerHTML =
            "<p>No assignments added yet.</p>";

        return;

    }

    filteredAssignments.forEach((assignment) => {

        container.innerHTML += `

        <div class="assignment-card">

            <h3>${assignment.title}</h3>

            <p><strong>📚 Subject:</strong>
            ${assignment.subject}</p>

            <p><strong>📅 Due Date:</strong>
            ${assignment.date}</p>

            <p><strong>🚩 Priority:</strong>
            ${assignment.priority}</p>

            <p><strong>Status:</strong>
            ${assignment.completed ? "✅ Completed" : "⏳ Pending"}</p>

            <div class="assignment-buttons">

                <button
                class="complete-btn"
                onclick="completeAssignment('${assignment.id}')">

                Complete

                </button>

                <button
                class="delete-btn"
                onclick="deleteAssignment('${assignment.id}')">

                Delete

                </button>

            </div>

        </div>

        `;

    });

}

// ===============================
// Add Assignment
// ===============================

async function addAssignment() {

    if (
        title.value === "" ||
        subject.value === "" ||
        date.value === ""
    ) {

        alert("Please fill all fields.");
        return;

    }

    await addDoc(

        collection(
            db,
            "users",
            currentUser.uid,
            "assignments"
        ),

        {

            title: title.value,

            subject: subject.value,

            date: date.value,

            priority: priority.value,

            completed: false

        }

    );

    title.value = "";
    subject.value = "";
    date.value = "";
    priority.value = "High";

    showToast("Assignment Added!");

    loadAssignments();

}

// ===============================
// Complete Assignment
// ===============================

async function completeAssignment(id) {

    await updateDoc(

        doc(
            db,
            "users",
            currentUser.uid,
            "assignments",
            id
        ),

        {

            completed: true

        }

    );

    showToast("Assignment Completed!");

    loadAssignments();

}

// ===============================
// Delete Assignment
// ===============================

async function deleteAssignment(id) {

    await deleteDoc(

        doc(
            db,
            "users",
            currentUser.uid,
            "assignments",
            id
        )

    );

    showToast("Assignment Deleted!");

    loadAssignments();

}

// ===============================
// Events
// ===============================

if (addAssignmentBtn) {

    addAssignmentBtn.addEventListener(
        "click",
        addAssignment
    );

}

if (assignmentSearch) {

    assignmentSearch.addEventListener(
        "input",
        renderAssignments
    );

}

// ===============================
// HTML Access
// ===============================

window.completeAssignment = completeAssignment;
window.deleteAssignment = deleteAssignment;