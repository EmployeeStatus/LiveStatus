// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getDatabase, set, ref, get } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY79wiUb3uoTDu2V6ykwM2_riAYpo8ofQ",
  authDomain: "employeestatus-b0b13.firebaseapp.com",
  projectId: "employeestatus-b0b13",
  storageBucket: "employeestatus-b0b13.appspot.com",
  messagingSenderId: "300076958030",
  appId: "1:300076958030:web:69a3c7fda9958de17e5e1f",
  measurementId: "G-YTRH1KC32B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app);

// Get Firebase Auth instance
const auth = getAuth(app);
var accountCount=0;
// Fetch the current account counter from Firebase
async function fetchAccountCount() {
  const database = getDatabase(app);
  const counterRef = ref(database, 'Counter/');
  
  try {
    const snapshot = await get(counterRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return 0;  // If counter does not exist, initialize to 0
    }
  } catch (error) {
    console.error("Error fetching account count:", error);
    throw error;
  }
}

// Update the account counter in Firebase

// Create a new employee record with the updated account count
async function createEmployeeRecord( accountName , user) {
  const database = getDatabase(app);
  const employeeId = accountCount.toString();
  const employeeRef = ref(database, `Employeestatus/${user.uid}`);
  
  try {
    await set(employeeRef, {  // Store employeeId in the database
  employeeName: accountName , // Store employeeName in the database
   uid: user.uid 
      });
    console.log(`Employee record created with ID: ${employeeId} for ${accountName}`);
  } catch (error) {
    console.error("Error creating employee record:", error);
    throw error;
  }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const loginEmail = document.getElementById('loginEmail').value;
 
  const loginPassword = document.getElementById('loginPassword').value;
  const loginSpinner = document.getElementById('loginSpinner');

  if (!validateEmail(loginEmail)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (!validatePassword(loginPassword)) {
    alert('Password must be at least 8 characters long and contain at least one symbol.');
    return;
  }

  // Show spinner
  loginSpinner.style.display = 'inline-block';

  // Sign in with email and password
  signInWithEmailAndPassword(auth, loginEmail, loginPassword )
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed in:", user);
      loginSpinner.style.display = 'none';  // Hide spinner before redirect

      if (loginEmail === "admin@gmail.com" && loginPassword === "123456789@mukul") {
        window.location.href = "admin.html";
      } else {
        // Fetch the employee's data from Firebase using the user’s UID
        const database = getDatabase(app);
        const employeeRef = ref(database, `Employeestatus/${user.uid}`);
         localStorage.setItem('loginUID', user.uid);

        get(employeeRef).then((snapshot) => {
          if (snapshot.exists()) {
            console.log("Employee data:", snapshot.val());
            window.location.href = "Employeestatus.html";
          } else {
            console.log("No employee data found.");
            alert("No employee data found." + accountCount);
          }
        }).catch((error) => {
          console.error("Error fetching employee data:", error);
        });
      }
    })
    .catch((error) => {
      console.error("Error signing in:", error);
      loginSpinner.style.display = 'none';
      alert("Wrong Email or password.");
    });
});

// Handle account creation form submission
document.getElementById('createAccountForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const accountEmail = document.getElementById('createEmail').value;
  const accountName = document.getElementById('createName').value;
  const accountPassword = document.getElementById('createPassword').value;
  const createAccountSpinner = document.getElementById('createAccountSpinner');

  if (!validateEmail(accountEmail)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (!validatePassword(accountPassword)) {
    alert('Password must be at least 8 characters long and contain at least one symbol.');
    return;
  }

  // Show spinner
  createAccountSpinner.style.display = 'inline-block';

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, accountEmail, accountPassword);
    const user = userCredential.user;
    console.log("Account created:", user);
    createAccountSpinner.style.display = 'none';
    alert("Congratulations! Your account has been created.");

    // Fetch current account count and increment it
  

    // Update the account count in Firebase
 

    // Create a new employee record with the incremented count
    await createEmployeeRecord( accountName , user);


  } catch (error) {
    createAccountSpinner.style.display = 'none';
    console.error("Error creating account:", error);
    alert("Error creating account: " + error.message);
  }
});

// Helper functions to validate email and password
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return regex.test(password);
}

// Toggle password visibility
document.addEventListener('DOMContentLoaded', function () {
  const togglePassword = document.querySelector('#togglePassword');
  const loginPassword = document.querySelector('#loginPassword');
  const toggleCreatePassword = document.querySelector('#toggleCreatePassword');
  const createPassword = document.querySelector('#createPassword');

  togglePassword.addEventListener('click', function () {
    const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    loginPassword.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye-slash');
  });

  toggleCreatePassword.addEventListener('click', function () {
    const type = createPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    createPassword.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye-slash');
  });
});
