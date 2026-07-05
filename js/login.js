import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// ================================
// StudySync Pro Login
// ================================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Check Empty Fields

    if (email === "" || password === "") {

        alert("❌ Please fill all fields.");

        return;

    }

    // Firebase Login

    signInWithEmailAndPassword(auth, email, password)

        .then((userCredential) => {

            const user = userCredential.user;

            
            localStorage.setItem("userEmail", user.email);

            if (typeof showToast === "function") {

                showToast("Login Successful!");

            } else {

                alert("✅ Login Successful!");

            }

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1500);

        })

        .catch((error) => {

            if (error.code === "auth/user-not-found") {

                alert("❌ No account found. Please sign up first.");

            } else if (error.code === "auth/wrong-password") {

                alert("❌ Incorrect password.");

            } else if (error.code === "auth/invalid-credential") {

                alert("❌ Invalid email or password.");

            } else {

                alert("❌ " + error.message);

            }

        });

});

// ================================
// Show / Hide Password
// ================================

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");

    } else {

        passwordInput.type = "password";

        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");

    }

});