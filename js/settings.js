import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const darkMode = document.getElementById("darkMode");
const notifications = document.getElementById("notifications");
const focusTime = document.getElementById("focusTime");
const shortBreak = document.getElementById("shortBreak");
const longBreak = document.getElementById("longBreak");
const dailyGoal = document.getElementById("dailyGoal");
const saveSettings = document.getElementById("saveSettings");
const resetData = document.getElementById("resetData");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";
        return;

    }

    currentUser = user;

    loadSettings();

});

async function loadSettings() {

    const settingsRef = doc(
        db,
        "users",
        currentUser.uid,
        "preferences",
        "settings"
    );

    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {

        const data = settingsSnap.data();

        darkMode.checked = data.darkMode ?? true;
        notifications.checked = data.notifications ?? true;
        focusTime.value = data.focusTime ?? 25;
        shortBreak.value = data.shortBreak ?? 5;
        longBreak.value = data.longBreak ?? 15;
        dailyGoal.value = data.dailyGoal ?? 4;

    }

}
// ===============================
// Save Settings
// ===============================

saveSettings.addEventListener("click", async () => {

    try {

        const settingsRef = doc(
            db,
            "users",
            currentUser.uid,
            "preferences",
            "settings"
        );

        await setDoc(settingsRef, {

            darkMode: darkMode.checked,
            notifications: notifications.checked,
            focusTime: Number(focusTime.value),
            shortBreak: Number(shortBreak.value),
            longBreak: Number(longBreak.value),
            dailyGoal: Number(dailyGoal.value)

        });

        // Save theme locally
        localStorage.setItem(
            "theme",
            darkMode.checked ? "dark" : "light"
        );

        // Apply theme instantly
        if (darkMode.checked) {

            document.body.classList.remove("light-theme");

        } else {

            document.body.classList.add("light-theme");

        }

        if (typeof showToast === "function") {

            showToast("Settings Saved Successfully!");

        } else {

            alert("Settings Saved Successfully!");

        }

    } catch (error) {

        console.error("Save Settings Error:", error);
        alert("Failed to save settings.");

    }

});
// ===============================
// Reset Settings
// ===============================

resetData.addEventListener("click", async () => {

    const confirmReset = confirm(
        "Reset all settings to default values?"
    );

    if (!confirmReset) return;

    try {

        darkMode.checked = true;
        notifications.checked = true;
        focusTime.value = 25;
        shortBreak.value = 5;
        longBreak.value = 15;
        dailyGoal.value = 4;
        document.body.classList.remove("light-theme");

        const settingsRef = doc(
            db,
            "users",
            currentUser.uid,
            "preferences",
            "settings"
        );

        await setDoc(settingsRef, {

            darkMode: true,
            notifications: true,
            focusTime: 25,
            shortBreak: 5,
            longBreak: 15,
            dailyGoal: 4

        });

        if (typeof showToast === "function") {
            showToast("Settings Reset Successfully!");
        } else {
            alert("Settings Reset Successfully!");
        }

    } catch (error) {

        console.error("Reset Settings Error:", error);
        alert("Failed to reset settings.");

    }

});