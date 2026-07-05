import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ================================
// Apply saved theme instantly
// ================================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add("light-theme");

} else {

    document.body.classList.remove("light-theme");

}

// ================================
// Sync with Firebase
// ================================

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    const snap = await getDoc(
        doc(
            db,
            "users",
            user.uid,
            "preferences",
            "settings"
        )
    );

    if (!snap.exists()) return;

    const data = snap.data();

    if (data.darkMode) {

        document.body.classList.remove("light-theme");
        localStorage.setItem("theme", "dark");

    } else {

        document.body.classList.add("light-theme");
        localStorage.setItem("theme", "light");

    }

});