import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

window.logout = async function () {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);

        alert("Logout failed.");

    }

};