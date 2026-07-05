import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

let timer;
let time = 25 * 60;
let running = false;

const display =
document.getElementById("timerDisplay");

const sessionCount =
document.getElementById("sessionCount");

let currentUser = null;
let sessions = 0;

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";
        return;

    }

    currentUser = user;

    loadPomodoro();

});

async function loadPomodoro(){

    const ref = doc(
        db,
        "users",
        currentUser.uid,
        "preferences",
        "pomodoro"
    );

    const snap = await getDoc(ref);

    if(snap.exists()){

        sessions = snap.data().sessions || 0;

    }else{

        sessions = 0;

    }

    sessionCount.innerText = sessions;

}
// ===============================
// Display
// ===============================

function updateDisplay() {

    const min = Math.floor(time / 60);
    const sec = time % 60;

    display.innerText =
        String(min).padStart(2, "0") +
        ":" +
        String(sec).padStart(2, "0");

}

updateDisplay();

// ===============================
// Start Timer
// ===============================

async function startTimer() {

    if (running) return;

    running = true;

    timer = setInterval(async () => {

        if (time > 0) {

            time--;

            updateDisplay();

        } else {

            clearInterval(timer);

            running = false;

            sessions++;

            sessionCount.innerText = sessions;

            const ref = doc(
                db,
                "users",
                currentUser.uid,
                "preferences",
                "pomodoro"
            );

            await setDoc(
                ref,
                {
                    sessions: sessions
                },
                {
                    merge: true
                }
            );

            if (typeof showToast === "function") {

                showToast("🎉 Pomodoro Completed!");

            } else {

                alert("🎉 Pomodoro Completed!");

            }

        }

    }, 1000);

}

// ===============================
// Pause
// ===============================

function pauseTimer() {

    clearInterval(timer);

    running = false;

}

// ===============================
// Reset
// ===============================

function resetTimer() {

    clearInterval(timer);

    running = false;

    time = 25 * 60;

    updateDisplay();

}

// ===============================
// Timer Modes
// ===============================

function setMode(minutes) {

    clearInterval(timer);

    running = false;

    time = minutes * 60;

    updateDisplay();

}

// ===============================
// HTML Access
// ===============================

window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.setMode = setMode;