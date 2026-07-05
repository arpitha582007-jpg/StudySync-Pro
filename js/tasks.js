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

const taskInput = document.getElementById("taskName");
const priority = document.getElementById("taskPriority");
const category = document.getElementById("taskCategory");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");
const addBtn = document.getElementById("addTask");

let currentUser = null;
let tasks = [];

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";
        return;

    }

    currentUser = user;

    loadTasks();

});

async function loadTasks(){

    tasks=[];

    const querySnapshot = await getDocs(

        collection(db,"users",currentUser.uid,"tasks")

    );

    querySnapshot.forEach((document)=>{

        tasks.push({

            id:document.id,

            ...document.data()

        });

    });

    renderTasks();

}

function updateStats(){

    const completed = tasks.filter(
        task=>task.completed
    ).length;

    document.getElementById("totalTasks").innerText =
    tasks.length;

    document.getElementById("completedTasks").innerText =
    completed;

    document.getElementById("pendingTasks").innerText =
    tasks.length-completed;

}
// ===============================
// Render Tasks
// ===============================

function renderTasks() {

    taskList.innerHTML = "";

    let keyword = "";

    if (searchTask) {
        keyword = searchTask.value.toLowerCase();
    }

    tasks.forEach((task) => {

        if (
            keyword &&
            !task.name.toLowerCase().includes(keyword)
        ) return;

        taskList.innerHTML += `
        <div class="task-card">

            <div class="task-info">

                <h3>${task.name}</h3>

                <p>${task.priority} • ${task.category}</p>

            </div>

            <div class="task-actions">

                <button class="complete-btn"
                onclick="completeTask('${task.id}')">

                ${task.completed ? "Completed" : "Complete"}

                </button>

                <button class="delete-btn"
                onclick="deleteTask('${task.id}')">

                Delete

                </button>

            </div>

        </div>
        `;

    });

    updateStats();

}

// ===============================
// Add Task
// ===============================

async function addTask() {

    if (taskInput.value.trim() === "") {

        alert("Please enter a task.");

        return;

    }

    await addDoc(

        collection(db, "users", currentUser.uid, "tasks"),

        {

            name: taskInput.value.trim(),

            priority: priority.value,

            category: category.value,

            completed: false

        }

    );

    taskInput.value = "";

    showToast("Task Added!");

    loadTasks();

}

// ===============================
// Complete Task
// ===============================

async function completeTask(id) {

    await updateDoc(

        doc(db, "users", currentUser.uid, "tasks", id),

        {

            completed: true

        }

    );

    showToast("Task Completed!");

    loadTasks();

}

// ===============================
// Delete Task
// ===============================

async function deleteTask(id) {

    await deleteDoc(

        doc(db, "users", currentUser.uid, "tasks", id)

    );

    showToast("Task Deleted!");

    loadTasks();

}

// ===============================
// Buttons
// ===============================

if (addBtn) {

    addBtn.addEventListener("click", addTask);

}

if (searchTask) {

    searchTask.addEventListener("input", renderTasks);

}

// ===============================
// HTML Access
// ===============================

window.completeTask = completeTask;
window.deleteTask = deleteTask;