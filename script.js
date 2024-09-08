// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

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
const database = getDatabase(app);

// Fetch employee data from the database and display it in the table
function fetchData() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  loadingSpinner.style.display = 'inline-block'; // Show spinner 

  const employeeRef = ref(database, 'Employeestatus/');
  get(employeeRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("Data retrieved from Firebase:", data); // Log the data
      populateTable(data);
      loadingSpinner.style.display = 'none'; // Hide spinner after data load
      document.querySelector('table').style.display = 'table'; // Show the table
    } else {
      console.log("No data available");
      loadingSpinner.style.display = 'none';
    }
  }).catch((error) => {
    console.error("Error getting data: ", error);
    loadingSpinner.style.display = 'none';
  });
}

// Update the employee status and remark in the database
function updateStatus(employeeId, newStatus, newRemark) {
  const employeeRef = ref(database, 'Employeestatus/' + employeeId);
  update(employeeRef, {
    employeeStatus: newStatus,
    employeeRemark: newRemark
  }).then(() => {
    console.log(`Updated status of employee ${employeeId} to ${newStatus}`);
    fetchData(); // Refresh the table after update
  }).catch((error) => {
    console.error("Error updating data: ", error);
  });
}

// Populate the table with employee data
function populateTable(data) {
  const tableBody = document.querySelector('#employeeTableBody'); // Table body where rows will be added
  if (!tableBody) {
    console.error("Element with ID 'employeeTableBody' not found.");
    return;
  }

  let html = '';
  for (const key in data) {
    // Ensure all fields have a value, and use empty strings for undefined values
    const employeeName = data[key]?.employeeName || 'Unknown Name';
    const employeeStatus = data[key]?.employeeStatus || 'Unknown';
    const employeeRemark = data[key]?.employeeRemark || '';
    const employeeId = data[key]?.employeeId || key; // Use the key as employeeId if it's not provided

    // Safely handle missing or undefined employeeStatus
    const statusClass = employeeStatus.toLowerCase() === 'busy' ? 'status-busy' : 'status-available';
    const actionButton = employeeStatus.toLowerCase() === 'busy' 
      ? `<button class="set-available-btn" data-id="${employeeId}">Set Available</button>` 
      : '';

    html += `
      <tr>
        <td>${employeeName}</td>
        <td class="${statusClass}">${employeeStatus}</td>
        <td>${employeeRemark}</td>
        <td>${actionButton}</td>
      </tr>
    `;
  }

  tableBody.innerHTML = html;

  // Add event listeners to buttons to handle status updates
  const buttons = document.querySelectorAll('.set-available-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      const employeeId = event.target.getAttribute('data-id');
      if (employeeId) {
        updateStatus(employeeId, 'Available', 'Available'); // Update status to 'Available'
      } else {
        console.error("Employee ID not found for the button.");
      }
    });
  });
}

// Wait for the DOM to fully load, then fetch employee data
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});
