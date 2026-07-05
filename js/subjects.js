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

const addBtn = document.getElementById("addSubject");
const subjectName = document.getElementById("subjectName");
const facultyName = document.getElementById("facultyName");
const subjectColor = document.getElementById("subjectColor");
const subjectContainer = document.getElementById("subjectContainer");
const subjectSearch = document.getElementById("subjectSearch");

let currentUser = null;
let subjects = [];

// ===============================
// Authentication
// ===============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";
        return;

    }

    currentUser = user;

    loadSubjects();

});

// ===============================
// Load Subjects
// ===============================

async function loadSubjects() {

    subjects = [];

    const querySnapshot = await getDocs(

        collection(db, "users", currentUser.uid, "subjects")

    );

    querySnapshot.forEach((document) => {

        subjects.push({

            id: document.id,

            ...document.data()

        });

    });

    displaySubjects();

}

// ===============================
// Display Subjects
// ===============================

function displaySubjects() {

    subjectContainer.innerHTML = "";

    const search =
        subjectSearch
            ? subjectSearch.value.toLowerCase()
            : "";

    const filteredSubjects = subjects.filter(subject => {

        return (
            subject.name.toLowerCase().includes(search) ||
            subject.faculty.toLowerCase().includes(search)
        );

    });

    if (filteredSubjects.length === 0) {

        subjectContainer.innerHTML = `
            <p>No subjects found.</p>
        `;

        return;

    }

    filteredSubjects.forEach((subject) => {

        subjectContainer.innerHTML += `

        <div class="subject-card" style="border-left:8px solid ${subject.color}">

            <h3>${subject.name}</h3>

            <p><strong>Faculty:</strong> ${subject.faculty}</p>

            <div class="subject-buttons">

                <button
                    class="edit-btn"
                    onclick="editSubject('${subject.id}')">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteSubject('${subject.id}')">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

// ===============================
// Add Subject
// ===============================

addBtn.addEventListener("click", async () => {

    if (subjectName.value.trim() === "") {

        alert("Please enter subject name.");
        return;

    }

    await addDoc(

        collection(db, "users", currentUser.uid, "subjects"),

        {

            name: subjectName.value.trim(),

            faculty: facultyName.value.trim(),

            color: subjectColor.value

        }

    );

    subjectName.value = "";
    facultyName.value = "";
    subjectColor.value = "#4facfe";

    showToast("Subject Added!");

    loadSubjects();

});

// ===============================
// Delete Subject
// ===============================

async function deleteSubject(id) {

    await deleteDoc(

        doc(db, "users", currentUser.uid, "subjects", id)

    );

    showToast("Subject Deleted!");

    loadSubjects();

}

// ===============================
// Edit Subject
// ===============================

async function editSubject(id) {

    const subject = subjects.find(s => s.id === id);

    const newName = prompt(
        "Edit Subject Name",
        subject.name
    );

    if (newName === null || newName.trim() === "")
        return;

    const newFaculty = prompt(
        "Edit Faculty Name",
        subject.faculty
    );

    if (newFaculty === null)
        return;

    await updateDoc(

        doc(db, "users", currentUser.uid, "subjects", id),

        {

            name: newName.trim(),

            faculty: newFaculty.trim()

        }

    );

    showToast("Subject Updated!");

    loadSubjects();

}

// ===============================
// Search
// ===============================

if (subjectSearch) {

    subjectSearch.addEventListener("input", displaySubjects);

}

// ===============================
// HTML Access
// ===============================

window.editSubject = editSubject;
window.deleteSubject = deleteSubject;