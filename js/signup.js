import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// ================================
// StudySync Pro - Signup
// ================================

const signupForm = document.getElementById("signupForm");

// Show / Hide Password

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

// Toggle Password

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");

    } else {

        password.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");

    }

});

// Toggle Confirm Password

toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPassword.type === "password") {

        confirmPassword.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");

    } else {

        confirmPassword.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");

    }

});

// ================================
// Signup
// ================================

signupForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    // Empty Fields

    if (name === "" || email === "" || pass === "" || confirm === "") {

        alert("❌ Please fill all fields.");
        return;

    }

    // Password Check

    if (pass !== confirm) {

        alert("❌ Passwords do not match.");
        return;

    }

    // Firebase Signup

    createUserWithEmailAndPassword(auth, email, pass)

        .then((userCredential) => {

            // Save name locally

            localStorage.setItem("userName", name);

            // Success Message

            if (typeof showToast === "function") {

                showToast("✅ Account created successfully!");

            } else {

                alert("✅ Account created successfully!");

            }

            // Redirect

            setTimeout(() => {

                window.location.href = "login.html";

            }, 1500);

        })

        .catch((error) => {

            alert("❌ " + error.message);

        });

});