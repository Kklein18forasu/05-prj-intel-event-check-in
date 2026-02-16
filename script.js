// Get DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const greeting = document.getElementById("greeting");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");


// Attendance tracking
let count = parseInt(localStorage.getItem("totalCount")) || 0;
const maxCount = 50;

// Team counts
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0
};
// Store attendee list
let attendeeData = JSON.parse(localStorage.getItem("attendeeData")) || [];


// Load stored counts into UI
attendeeCountDisplay.textContent = count;
document.getElementById("waterCount").textContent = teamCounts.water;
document.getElementById("zeroCount").textContent = teamCounts.zero;
document.getElementById("powerCount").textContent = teamCounts.power;

// Load saved attendees into list on page load
attendeeData.forEach(person => {
  const li = document.createElement("li");
  li.textContent = `${person.name} — ${person.team}`;
  attendeeList.appendChild(li);
});


// Update progress on page load
updateProgress();

// Form submit event
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (name === "" || team === "") return;

  // Increase total attendance
  count++;
  attendeeCountDisplay.textContent = count;

  // Increase team count
  teamCounts[team]++;
  document.getElementById(team + "Count").textContent = teamCounts[team];

  // Save to local storage
  localStorage.setItem("totalCount", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));

  // Show greeting
  greeting.textContent = `Welcome, ${name}! 🌱 You’re checked in with ${teamName}.`;

  // Add attendee to list
const li = document.createElement("li");
li.textContent = `${name} — ${teamName}`;
attendeeList.appendChild(li);

// Save attendee to storage
attendeeData.push({ name: name, team: teamName });
localStorage.setItem("attendeeData", JSON.stringify(attendeeData));



  // Update progress bar
  updateProgress();

  // Celebration when goal reached
  if (count >= maxCount) {
    showCelebration();
  }

  form.reset();
});

// Update progress bar function
function updateProgress() {
  const percent = (count / maxCount) * 100;
  progressBar.style.width = percent + "%";
}

// Celebration feature
function showCelebration() {
  let winningTeam = Object.keys(teamCounts).reduce((a, b) =>
    teamCounts[a] > teamCounts[b] ? a : b
  );

  let winningName = "";

  if (winningTeam === "water") winningName = "🌊 Team Water Wise";
  if (winningTeam === "zero") winningName = "🌿 Team Net Zero";
  if (winningTeam === "power") winningName = "⚡ Team Renewables";

  alert(`🎉 Attendance Goal Reached! ${winningName} wins the Sustainability Summit!`);
}
