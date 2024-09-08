
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase , set , ref , get } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

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



//logout button 




    // Initialize Firebase
  
   const auth = getAuth(app);

    // Logout button event listener
    document.getElementById('logoutButton').addEventListener('click', function() {
      auth.signOut().then(() => {
        // Clear session storage if needed
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = 'index.html'; // Replace with your login page URL

        // Prevent going back to the previous page
        setTimeout(() => {
          window.history.replaceState(null, null, window.location.href);
          window.location.reload(true);
        }, 100);
      }).catch((error) => {
        // Handle Errors here.
        console.error('Error signing out: ', error);
      });
    });
 






















//getting name from database
















document.addEventListener('DOMContentLoaded', function() {
    // Simulate fetching the logged-in user's name from the database

const userId = localStorage.getItem('loginUID');
  const employeeNameField = document.getElementById('employeeName');

  if (userId) {
    const database = getDatabase(app);
    const employeeRef = ref(database, `Employeestatus/${userId}`);

    // Fetch the employee's data from Firebase
    get(employeeRef).then((snapshot) => {
      if (snapshot.exists()) {
        const employeeData = snapshot.val();
        console.log("Fetched employee data:", employeeData);

        // Display the employee name
        employeeNameField.value = employeeData.employeeName || "No name available";
      } else {
        console.log("No employee data found.");
        employeeNameField.value = "No employee data found.";
      }
    }).catch((error) => {
      console.error("Error fetching employee data:", error);
      employeeNameField.value = "Error loading data. Try log in again ";
    });
  } else {
    console.log("User is not logged in.");
    employeeNameField.value = "No user logged in.";
  }




  });
  
  document.getElementById('statusUpdateForm').addEventListener('submit', function(event) {
    event.preventDefault();
   
//   const employeeName = name;
 const userId = localStorage.getItem('loginUID');
  const employeeName = document.getElementById('employeeName').value;
  const employeeStatus = document.querySelector('input[name="statusOptions"]:checked').value;
  const employeeRemark = document.getElementById('employeeRemark').value;

  if (!validateRemark(employeeRemark)) {
    alert('Remark cannot be empty and should not exceed 15 words.');
    return;
  }

  if (userId) {
    const database = getDatabase(app);
    const employeeRef = ref(database, `Employeestatus/${userId}`);

    set(employeeRef, {
      employeeName: employeeName,
      employeeStatus: employeeStatus,
      employeeRemark: employeeRemark
    })
    .then(() => {
      alert("Employee status updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating employee status:", error);
    });
  } else {
    console.log("User ID not found.");
  }
   

  });
  
  function validateRemark(remark) {
    if (!remark.trim()) {
      return false;
    }
    const wordCount = remark.trim().split(/\s+/).length;
    return wordCount <= 15;
  }
  