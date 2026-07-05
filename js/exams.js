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

const examSubject = document.getElementById("examSubject");
const examDate = document.getElementById("examDate");
const examTime = document.getElementById("examTime");
const examVenue = document.getElementById("examVenue");
const examNotes = document.getElementById("examNotes");
const examContainer = document.getElementById("examContainer");
const addExamBtn = document.getElementById("addExam");
const examSearch = document.getElementById("examSearch");

let currentUser = null;
let exams = [];

// ===============================
// Authentication
// ===============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";
        return;

    }

    currentUser = user;

    loadExams();

});

// ===============================
// Load Exams
// ===============================

async function loadExams() {

    exams = [];

    const querySnapshot = await getDocs(

        collection(
            db,
            "users",
            currentUser.uid,
            "exams"
        )

    );

    querySnapshot.forEach((document) => {

        exams.push({

            id: document.id,

            ...document.data()

        });

    });

    renderExams();

}
// ===============================
// Render Exams
// ===============================

function renderExams() {

    examContainer.innerHTML = "";

    const keyword =
        examSearch
            ? examSearch.value.toLowerCase()
            : "";

    const filteredExams = exams.filter(exam =>
        exam.subject.toLowerCase().includes(keyword)
    );

    if (filteredExams.length === 0) {

        examContainer.innerHTML =
            "<p>No exams added yet.</p>";

        return;

    }

    filteredExams.forEach((exam) => {

        examContainer.innerHTML += `

        <div class="exam-card">

            <h3>${exam.subject}</h3>

            <p>📅 ${exam.date}</p>

            <p>🕒 ${exam.time}</p>

            <p>🏫 ${exam.venue}</p>

            <p>📝 ${exam.notes}</p>

            <button
                class="delete-btn"
                onclick="deleteExam('${exam.id}')">

                Delete

            </button>

        </div>

        `;

    });

}

// ===============================
// Add Exam
// ===============================

async function addExam() {

    if (
        examSubject.value === "" ||
        examDate.value === "" ||
        examTime.value === ""
    ) {

        alert("Please fill all required fields.");
        return;

    }

    await addDoc(

        collection(
            db,
            "users",
            currentUser.uid,
            "exams"
        ),

        {

            subject: examSubject.value,

            date: examDate.value,

            time: examTime.value,

            venue: examVenue.value,

            notes: examNotes.value

        }

    );

    examSubject.value = "";
    examDate.value = "";
    examTime.value = "";
    examVenue.value = "";
    examNotes.value = "";

    showToast("Exam Added!");

    loadExams();

}

// ===============================
// Delete Exam
// ===============================

async function deleteExam(id) {

    await deleteDoc(

        doc(
            db,
            "users",
            currentUser.uid,
            "exams",
            id
        )

    );

    showToast("Exam Deleted!");

    loadExams();

}

// ===============================
// Events
// ===============================

if (addExamBtn) {

    addExamBtn.addEventListener(
        "click",
        addExam
    );

}

if (examSearch) {

    examSearch.addEventListener(
        "input",
        renderExams
    );

}

// ===============================
// HTML Access
// ===============================

window.deleteExam = deleteExam;