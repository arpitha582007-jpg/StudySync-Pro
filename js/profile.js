import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Elements
const profilePic = document.getElementById("profilePic");
const uploadPhoto = document.getElementById("uploadPhoto");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const collegeInput = document.getElementById("college");
const branchInput = document.getElementById("branch");
const yearInput = document.getElementById("year");
const goalInput = document.getElementById("goal");
const saveButton = document.getElementById("saveProfile");

saveButton.addEventListener("click", saveProfile);


let currentUser = null;

// Load user after login
onAuthStateChanged(auth, async (user) => {
    console.log("Auth user:", user);

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    emailInput.value = user.email;

    const docRef = doc(db, "profiles", user.uid);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        const data = docSnap.data();

        nameInput.value = data.name || "";
        collegeInput.value = data.college || "";
        branchInput.value = data.branch || "";
        yearInput.value = data.year || "";
        goalInput.value = data.goal || "";

        if (data.profilePic) {

            profilePic.src = data.profilePic;

        }

    }

});
// Upload Profile Picture
uploadPhoto.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        profilePic.src = e.target.result;

    };

    reader.readAsDataURL(file);

});

// Save Profile
async function saveProfile() {

    console.log("1. Save function started");

    if (!currentUser) {
        alert("User not logged in");
        return;
    }

    console.log("2. Current user:", currentUser.uid);

    try {

        console.log("3. Saving to Firestore...");

        await setDoc(doc(db, "profiles", currentUser.uid), {

            name: nameInput.value,
            email: currentUser.email,
            college: collegeInput.value,
            branch: branchInput.value,
            year: yearInput.value,
            goal: goalInput.value,
            profilePic: profilePic.src

        });

        console.log("4. Save successful");

        alert("Profile Saved Successfully!");

    } catch (error) {

        console.error("SAVE ERROR:", error);

        alert(error.message);

    }

}

// Make function available to HTML button
window.saveProfile = saveProfile;