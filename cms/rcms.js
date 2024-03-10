let userCode = null;

async function login(event) {
    event.preventDefault();
    const codeInput = document.getElementById('codeInput');
    const enteredCode = codeInput.value;
  
    try {
      const response = await fetch('clubCodes.json');
      const data = await response.json();
  
      if (enteredCode === data.masterCode) {
        userCode = enteredCode;
        // Grant access to all clubs
        showClubsContainer();
      } else if (data.clubCodes[enteredCode]) {
        userCode = enteredCode;
        // Grant access to the specific club
        const clubIndex = clubsData.runningClubs.findIndex(club => club.name === data.clubCodes[enteredCode]);
        showClubsContainer(clubIndex);
      } else {
        alert('Invalid code. Access denied.');
      }
    } catch (error) {
      console.error('Error fetching club codes:', error);
    }
  }
  
  function showClubsContainer(clubIndex = null) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('clubs-container').style.display = 'block';
    loadClubs();
    if (clubIndex !== null) {
      showAddEditForm(clubIndex);
    }
  }

function submitClubForm(event) {
  // ...
  if (userCode === clubCodes.masterCode || clubCodes.clubCodes[clubData.name] === userCode) {
    // Update the club data
    if (editingClubIndex === -1) {
      clubsData.runningClubs.push(clubData);
    } else {
      clubsData.runningClubs[editingClubIndex] = clubData;
    }
    // ...
  } else {
    alert('You do not have permission to edit this club.');
  }
  // ...
}

document.getElementById('loginForm').addEventListener('submit', login);

const clubsData = {
    "runningClubs": [
    // Initial club data here
    ]
    };
    let editingClubIndex = -1; // Add this line to declare the editing index
    function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let exportFileDefaultName = 'clubsData.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    }
    async function loadClubs() {
    try {
    const response = await fetch('clubs.json');
    const data = await response.json();
    
        clubsData.runningClubs = data.runningClubs; // This line is crucial
    
        const clubsList = document.getElementById('clubs-list');
        clubsList.innerHTML = ''; // Clear existing clubs list
        data.runningClubs.forEach((club, index) => {
            const clubElement = document.createElement('div');
            clubElement.innerText = `${club.name} - ${club.runType}`;
            const editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.onclick = () => showAddEditForm(index);
            clubElement.appendChild(editButton);
            clubsList.appendChild(clubElement);
        });
    } catch (error) {
        console.error('Error fetching clubs data:', error);
    }
    }
    // Initial load
    document.addEventListener('DOMContentLoaded', loadClubs);
    function showAddEditForm(index = null) {
    const form = document.getElementById('add-edit-club-form');
    form.style.display = 'block';
    editingClubIndex = index; // Update the global editing index
    
    // Clear previous data
    document.getElementById('club-form').reset();
    
    
    if (index !== null && clubsData.runningClubs[index]) {
        const club = clubsData.runningClubs[index];
        document.getElementById('club-id').value = club.id;
        document.getElementById('club-name').value = club.name;
        document.getElementById('club-run-type').value = club.runType;
        document.getElementById('club-business-name').value = club.businessName;
        document.getElementById('club-group-size').value = club.groupSize;
        document.getElementById('club-beginner-friendly').checked = club.beginnerFriendly;
        document.getElementById('club-bag-drop').checked = club.bagDrop;
        document.getElementById('club-location-lat').value = club.location.lat;
        document.getElementById('club-location-lon').value = club.location.lon;
    
        // Assuming club.socials and club.schedule are arrays with at least one element.
        const socials = club.socials[0];
        document.getElementById('social-instagram').value = socials.instagram;
        document.getElementById('social-twitter').value = socials.twitter;
        document.getElementById('social-website').value = socials.website;
        document.getElementById('social-phone').value = socials.phone;
        document.getElementById('social-email').value = socials.email;
    
        const schedule = club.schedule[0];
        document.getElementById('schedule-day').value = schedule.day;
        document.getElementById('schedule-time').value = schedule.time;
        document.getElementById('schedule-distance').value = schedule.distance;
        document.getElementById('schedule-duration').value = schedule.duration;
        document.getElementById('schedule-pace').value = schedule.pace;
        document.getElementById('schedule-intention').value = schedule.intention;
    }
    }
    function submitClubForm(event) {
    event.preventDefault();
    // Basic club information
    const clubData = {
    id: document.getElementById('club-id').value,
    name: document.getElementById('club-name').value,
    runType: document.getElementById('club-run-type').value,
    businessName: document.getElementById('club-business-name').value,
    groupSize: document.getElementById('club-group-size').value,
    beginnerFriendly: document.getElementById('club-beginner-friendly').checked,
    bagDrop: document.getElementById('club-bag-drop').checked,
    location: {
    lat: parseFloat(document.getElementById('club-location-lat').value),
    lon: parseFloat(document.getElementById('club-location-lon').value)
    },
    // Assuming a single entry for simplification. For multiple, you'd dynamically generate these fields.
    socials: [{
    instagram: document.getElementById('social-instagram').value,
    twitter: document.getElementById('social-twitter').value,
    website: document.getElementById('social-website').value,
    phone: document.getElementById('social-phone').value,
    email: document.getElementById('social-email').value,
    }],
    // Simplified handling of schedule, assuming single entry for demonstration
    schedule: [{
    day: document.getElementById('schedule-day').value,
    time: document.getElementById('schedule-time').value,
    distance: document.getElementById('schedule-distance').value,
    duration: document.getElementById('schedule-duration').value,
    pace: document.getElementById('schedule-pace').value,
    intention: document.getElementById('schedule-intention').value,
    }]
    };
    
    if (editingClubIndex === -1) {
        // Add a new club
        clubsData.runningClubs.push(clubData);
    } else {
        // Update an existing club
        clubsData.runningClubs[editingClubIndex] = clubData;
    }
    
    // Refresh the clubs list and hide the form
    displayClubs();
    document.getElementById('add-edit-club-form').style.display = 'none';
    editingClubIndex = -1; // Reset editing index
    }

    // Initial load
    loadClubs();
    
// Function to dynamically add social input
function addSocialInput() {
    const container = document.getElementById('socials-container');
    const inputGroup = document.createElement('div');
    inputGroup.classList.add('input-group');
    inputGroup.innerHTML = `
        <label>Type:</label>
        <select>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="website">Website</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
        </select>
        <input type="text" placeholder="Link or Contact">
        <button type="button" onclick="removeInput(this)">Remove</button>
    `;
    container.appendChild(inputGroup);
}

// Function to dynamically add schedule input
function addScheduleInput() {
    const container = document.getElementById('schedule-container');
    const inputGroup = document.createElement('div');
    inputGroup.classList.add('input-group');
    inputGroup.innerHTML = `
        <input type="text" placeholder="Day">
        <input type="text" placeholder="Time">
        <input type="text" placeholder="Distance">
        <input type="text" placeholder="Duration">
        <input type="text" placeholder="Pace">
        <input type="text" placeholder="Intention">
        <button type="button" onclick="removeInput(this)">Remove</button>
    `;
    container.appendChild(inputGroup);
}
    