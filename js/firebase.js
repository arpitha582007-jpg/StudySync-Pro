// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

// Firebase Authentication
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Cloud Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyChKGDrqqiyEIZAmcepGoJnsoNeiMkHCB0",
  authDomain: "studysync-pro-725a8.firebaseapp.com",
  projectId: "studysync-pro-725a8",
  storageBucket: "studysync-pro-725a8.firebasestorage.app",
  messagingSenderId: "600454070528",
  appId: "1:600454070528:web:cc9dbd544e971e58c873e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Export for other JS files
export { auth, db };