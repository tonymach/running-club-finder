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
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('clubs-container-styled').style.display = 'block';
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
            clubElement.classList.add('club-item');
      
            const clubInfo = document.createElement('div');
            clubInfo.innerHTML = `
              <h3>${club.name}</h3>
              <p>Run Type: ${club.runType}</p>
            `;
            clubElement.appendChild(clubInfo);
      
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
            editButton.onclick = () => showAddEditForm(index);
            clubElement.appendChild(editButton);
      
            clubsList.appendChild(clubElement);
          });
        } catch (error) {
          console.error('Error fetching clubs data:', error);
        }
      }


function showAddEditForm(index = null) {
    editingClubIndex = index;

    const scheduleContainer = document.getElementById('schedule-container');
    // Clear existing schedules except the template
    scheduleContainer.innerHTML = '';


    // Clear existing social inputs
    const socialsContainer = document.getElementById('socials-container');
    socialsContainer.innerHTML = '';


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

        club.schedule.forEach(schedule => {
            addScheduleEntry(schedule);
        });

        if (map && marker) {
            var clubLat = parseFloat(club.location.lat);
            var clubLon = parseFloat(club.location.lon);
            map.setView([clubLat, clubLon], 13);
            marker.setLatLng([clubLat, clubLon]);
        }

        club.socials.forEach(social => {
            if (!social.preferred) {
                addSocialInput(social);
            }
        });
        createPreferredSocialDropdown(club.socials);

     }
    }

    

    function submitClubForm(event) {
    event.preventDefault();
    // Basic club information

    const scheduleInputs = document.querySelectorAll('#schedule-container .input-group');
    const schedules = Array.from(scheduleInputs).map(group => ({
        day: group.querySelector('.schedule-day').value,
        time: group.querySelector('.schedule-time').value,
        distance: group.querySelector('.schedule-distance').value,
        duration: group.querySelector('.schedule-duration').value,
        pace: group.querySelector('.schedule-pace').value,
        intention: group.querySelector('.schedule-intention').value,
    }));

    clubData.schedule = schedules;


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
    
    function addSocialInput(social) {
        const container = document.getElementById('socials-container');
        const inputGroup = document.createElement('div');
        inputGroup.classList.add('input-group', 'social-input-group');
        container.appendChild(inputGroup);
    
        // Determine social type and value
        const socialType = Object.keys(social)[0];
        const socialValue = social[socialType];
    
        // Define icon classes for each social type
        const socialIcons = {
            instagram: 'fab fa-instagram',
            facebook: 'fab fa-facebook',
            website: 'fas fa-globe',
            phone: 'fas fa-phone',
            email: 'fas fa-envelope'
        };
    
        // Create icon element
        const iconElement = document.createElement('i');
        const iconClass = socialIcons[socialType] || 'fas fa-question-circle';
        iconElement.className = iconClass;
        iconElement.style.marginRight = '8px';
        inputGroup.appendChild(iconElement);
    
        // Create input for the social value
        const inputValue = document.createElement('input');
        inputValue.type = 'text';
        inputValue.classList.add('social-value');
        inputValue.placeholder = socialType.charAt(0).toUpperCase() + socialType.slice(1);
        inputValue.value = socialValue;
        inputGroup.appendChild(inputValue);
    }
    
    

    function createPreferredSocialDropdown(socials) {
        const dropdown = document.createElement('select');
        dropdown.id = 'preferred-social';
        dropdown.classList.add('preferred-social-dropdown');
    
        // Default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Preferred Contact';
        dropdown.appendChild(defaultOption);
    
        // Add options based on available socials
        socials.forEach(social => {
            const option = document.createElement('option');
            const socialType = Object.keys(social)[0];
            option.value = socialType;
            option.textContent = socialType.charAt(0).toUpperCase() + socialType.slice(1); // Capitalize
            dropdown.appendChild(option);
        });
    
        // Set the preferred option if it exists
        const preferred = socials.find(social => social.preferred);
        if (preferred) {
            dropdown.value = preferred.preferred;
        }
    
        // Append the dropdown to the container or a specific element
        document.getElementById('socials-container').prepend(dropdown);
    }
    


// Function to dynamically add schedule input
let scheduleId = 0; // Unique identifier for each schedule input group

function addScheduleInput() {
    const container = document.getElementById('schedule-container');
    const inputGroup = document.createElement('div');
    inputGroup.classList.add('schedule-group');
    inputGroup.innerHTML = `
        <div class="schedule-inputs">
            <input type="text" placeholder="Day" class="schedule-day">
            <input type="text" placeholder="Time" class="schedule-time">
            <input type="text" placeholder="Distance" class="schedule-distance">
            <input type="text" placeholder="Duration" class="schedule-duration">
            <input type="text" placeholder="Pace" class="schedule-pace">
            <input type="text" placeholder="Intention" class="schedule-intention">
        </div>
        <button type="button" onclick="removeScheduleInput(this)">Remove</button>
    `;
    container.appendChild(inputGroup);
}

function addScheduleEntry(schedule = { day: '', time: '', distance: '', duration: '', pace: '', intention: '' }) {
    const scheduleContainer = document.getElementById('schedule-container');
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('schedule-entry');

    entryDiv.innerHTML = `
        <select class="schedule-day" name="day">
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
    </select>
    <select class="schedule-time" name="time">
            <!-- Populate time options dynamically or manually here -->
        </select>
        <input type="text" class="schedule-distance" placeholder="Distance" value="${schedule.distance}">
        <input type="text" class="schedule-duration" placeholder="Duration" value="${schedule.duration}">
        <input type="text" class="schedule-pace" placeholder="Pace" value="${schedule.pace}">
        <input type="text" class="schedule-intention" placeholder="Intention" value="${schedule.intention}">
        <button type="button" onclick="removeScheduleEntry(this)">Remove</button>
    `;
    populateTimeOptions(entryDiv.querySelector('.schedule-time'));
    scheduleContainer.appendChild(entryDiv);
}

function populateTimeOptions(selectElement) {
    const intervals = ['00:00', '00:15', '00:30', '00:45', '01:00']; // Extend this list as needed
    intervals.forEach(interval => {
        const option = document.createElement('option');
        option.value = interval;
        option.textContent = interval;
        selectElement.appendChild(option);
    });
}


// Attach the addScheduleEntry function to the "Add Schedule" button click event
document.getElementById('add-schedule').addEventListener('click', () => addScheduleEntry());


function removeScheduleEntry(button) {
    button.parentNode.remove();
}

var map, marker; // Declare as global variables

document.addEventListener('DOMContentLoaded', function() {
    loadClubs();

    // Initialize the map on the "map" div with a given center and zoom
    map = L.map('map').setView([43.651070, -79.347015], 13); // Remove 'var'

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicnVubmVyc2hpZ2hpbnN0IiwiYSI6ImNsc293d3VkaTBrM2Yya21wOGs5amltZzEifQ.wrp2n2y_MOPmKCQCrVulKQ'
    }).addTo(map);

    // Initialize draggable marker
    marker = L.marker([43.651070, -79.347015], {
        draggable: true
    }).addTo(map);


    // Event listener for marker drag end
    marker.on('dragend', function(e) {
        var position = marker.getLatLng();
        updateLocationInputs(position.lat, position.lng);
    });

    // Function to update location inputs
    function updateLocationInputs(lat, lng) {
        document.getElementById('club-location-lat').value = lat;
        document.getElementById('club-location-lon').value = lng;
    }

    // Optionally, handle user's geolocation
    navigator.geolocation.getCurrentPosition(function(position) {
        var userLat = position.coords.latitude;
        var userLon = position.coords.longitude;
        map.setView([userLat, userLon], 13);
        marker.setLatLng([userLat, userLon]);
        updateLocationInputs(userLat, userLon);
    }, function() {
        console.log("Geolocation is not enabled by the user");
    });
});
