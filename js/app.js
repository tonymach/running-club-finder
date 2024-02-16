document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11', // You can change "streets-v11" to other styles
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicnVubmVyc2hpZ2hpbnN0IiwiYSI6ImNsc293d3VkaTBrM2Yya21wOGs5amltZzEifQ.wrp2n2y_MOPmKCQCrVulKQ'
    }).addTo(map);

    map.addControl(new L.Control.FullScreen({
        position: 'topright', // change the position
        title: 'Show me the full map', // title when not fullscreen
        titleCancel: 'Exit fullscreen mode', // title when fullscreen
        forceSeparateButton: true, // force separate button to detach from zoom buttons, default false

    }));


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // Success case
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            map.setView([lat, lng], 13);
            L.marker([lat, lng]).addTo(map)
                .bindPopup('You are here.')
                .openPopup();
        }, function() {
            // User denied geolocation prompt or it failed
            showFallbackModal();
        });
    } else {
        // Geolocation is not supported
        alert('Geolocation is not supported by your browser.');
    }
    
    function showFallbackModal() {
        document.getElementById('location-fallback-modal').style.display = 'block';
    }

    document.querySelector('.close-button').addEventListener('click', function() {
        document.getElementById('location-fallback-modal').style.display = 'none';
    });

    document.getElementById('submit-location').addEventListener('click', function() {
        var userCity = document.getElementById('user-city').value;
        if (userCity) {
            geocodeLocation(userCity,map);
        }
        document.getElementById('location-fallback-modal').style.display = 'none';
    });
});


document.querySelector('.close-button').addEventListener('click', () => {
    document.getElementById('club-info-modal').style.display = 'none';
});

// Function to geocode the user-entered location and update the map
function geocodeLocation(location,map) {
    fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(location)}&format=json&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                // Assuming 'map' is your Leaflet map variable
                map.setView([lat, lon], 13);
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`Location: ${location}`)
                    .openPopup();
            } else {
                alert('Location not found. Please try another search.');
            }
        })
        .catch(error => console.log('Error geocoding location:', error));
}


document.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Function to toggle options in a category based on the "Any" button's state
    function toggleAnyOptions(containerSelector, btnClass) {
        const container = document.querySelector(containerSelector);
        const anyBtn = container.querySelector('.any');
        const options = container.querySelectorAll(btnClass + ':not(.any)'); // Exclude the "Any" button itself
        
        // Determine if any options are already active (excluding the "Any" button itself)
        const anyActive = Array.from(options).some(btn => btn.classList.contains('active'));
        
        // If any options are active, clicking "Any" will clear them. Otherwise, it will activate them.
        if (anyActive) {
            // Clear all options
            options.forEach(btn => btn.classList.remove('active'));
        } else {
            // Activate all options
            options.forEach(btn => btn.classList.add('active'));
        }

        // Toggle the "Any" button's active state based on the presence of any active options
        anyBtn.classList.toggle('active', !anyActive);
    }

    // Setup event listeners for the "Any" buttons within each filter category
    document.querySelector('#filter-days .any').addEventListener('click', () => toggleAnyOptions('#filter-days', '.day-btn'));
    document.querySelector('#filter-time .any').addEventListener('click', () => toggleAnyOptions('#filter-time', '.time-btn'));
    document.querySelector('#filter-group-size .any').addEventListener('click', () => toggleAnyOptions('#filter-group-size', '.group-size-btn'));
});

function toggleFilters() {
    var filters = document.getElementById("filter-options");
    var applyButton = document.getElementById("apply-filters");
    var summaryLine = document.querySelector(".summary-line");

    // Check if filters are currently displayed
    if (filters.style.display === "none") {
        filters.style.display = "block";
        filters.style.maxHeight = filters.scrollHeight + "px";
        applyButton.style.display = "block";
    } else {
        filters.style.display = "none";
        filters.style.maxHeight = null;
        applyButton.style.display = "none";
    }

    // Stop the shaking animation by removing it
    summaryLine.style.animation = "none";
}


function applyFilters() {
    let filterSummary = [];

    // Days: Summarize if all are selected
    let daysSelected = document.querySelectorAll('#filter-days .day-btn.active');
    if (daysSelected.length === 7) { // Assuming there are 7 buttons for days
        filterSummary.push('Days: Every Day');
    } else if (daysSelected.length) {
        let daysSummary = Array.from(daysSelected).map(button => button.textContent).join(', ');
        filterSummary.push(`Days: ${daysSummary}`);
    }

    // Type: Directly add if selected
    let typeSelected = document.querySelector('.type-toggle .type-btn.active');
    if (typeSelected) {
        filterSummary.push(`Type: ${typeSelected.textContent}`);
    }

    // Time: Summarize if all are selected
    let timeSelected = document.querySelectorAll('#filter-time .time-btn.active');
    if (timeSelected.length === 5) { // Assuming there are 5 buttons for times
        filterSummary.push('Time: Anytime');
    } else if (timeSelected.length) {
        let timeSummary = Array.from(timeSelected).map(button => button.textContent).join(', ');
        filterSummary.push(`Time: ${timeSummary}`);
    }

    // Group Size: Summarize if all are selected
    let groupSizeSelected = document.querySelectorAll('#filter-group-size .group-size-btn.active');
    if (groupSizeSelected.length === 5) { // Assuming there are 5 buttons for group sizes
        filterSummary.push('Group Size: Any');
    } else if (groupSizeSelected.length) {
        let groupSizeSummary = Array.from(groupSizeSelected).map(button => button.textContent).join(', ');
        filterSummary.push(`Group Size: ${groupSizeSummary}`);
    }

    // Update the summary line
    let summaryLine = document.querySelector(".summary-line");
    summaryLine.style.fontWeight = 'bold'; // Make the summary line bold
    if (filterSummary.length) {
        summaryLine.innerHTML = `Filters Applied: <span style='font-weight:normal;'>${filterSummary.join('; ')}</span>`;
    } else {
        summaryLine.textContent = "Select Filters...";
    }

    // Close the filters
    toggleFilters();
}




document.getElementById('filter-time').addEventListener('change', function() {
    var iconClassMap = {
        '': '', // No icon for 'Any'
        'super-early': 'super-early',
        'early': 'early',
        'lunch': 'lunch',
        'late-afternoon': 'late-afternoon',
        'late': 'late'
    };
    var selectedValue = this.value;
    var iconElement = document.getElementById('time-icon');
    iconElement.className = 'time-icon ' + iconClassMap[selectedValue];
});

document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', () => {
        toggleModal(null, 'close'); // Close any modal
    });
});

window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        toggleModal(null, 'close');
    }
});


function toggleModal(modalId, state) {
    // Close any open modal
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });

    // If requested to open, change the display of the target modal
    if (state === 'open') {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }
}


// Get the modal
var recommendClubModal = document.getElementById("recommend-club-modal");

// Get the button that opens the modal
var btn = document.getElementById("recommend-club-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-button")[0]; // Assuming it's the first one in your document

// When the user clicks the button, open the modal 
btn.onclick = function() {
    recommendClubModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    recommendClubModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == recommendClubModal) {
        recommendClubModal.style.display = "none";
    }
}

document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

document.getElementById('clear-type').addEventListener('click', function() {
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
});

document.getElementById('clear-days').addEventListener('click', function() {
    document.querySelectorAll('#filter-days .day-btn').forEach(btn => {
        btn.classList.remove('active');
    });
});

document.getElementById('clear-time').addEventListener('click', function() {
    // Iterate through all time buttons and remove active class or reset selection
    document.querySelectorAll('#filter-time .time-btn').forEach(btn => {
        btn.classList.remove('active'); // Assuming you use an 'active' class to mark selection
    });
});

document.getElementById('clear-group-size').addEventListener('click', function() {
    // Iterate through all group size buttons and remove active class or reset selection
    document.querySelectorAll('#filter-group-size .group-size-btn').forEach(btn => {
        btn.classList.remove('active'); // Similar assumption as above
    });
});


// Function to get all active times
function getActiveTimes() {
    const activeTimes = [];
    document.querySelectorAll('.time-btn.active').forEach(btn => {
        activeTimes.push(btn.getAttribute('data-time'));
    });
    return activeTimes;
}

// Function to get all active group sizes
function getActiveGroupSizes() {
    const activeGroupSizes = [];
    document.querySelectorAll('.group-size-btn.active').forEach(btn => {
        activeGroupSizes.push(btn.getAttribute('data-group-size'));
    });
    return activeGroupSizes;
}

// Example usage
document.getElementById('apply-filters').addEventListener('click', () => {
    const selectedTimes = getActiveTimes();
    const selectedGroupSizes = getActiveGroupSizes();
    console.log('Selected Times:', selectedTimes);
    console.log('Selected Group Sizes:', selectedGroupSizes);
    // Proceed to filter or use the selected options as needed
});


// For Time of Day buttons
document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle 'active' class on click without affecting other buttons
        btn.classList.toggle('active');
    });
});

// For Group Size buttons
document.querySelectorAll('.group-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle 'active' class on click without affecting other buttons
        btn.classList.toggle('active');
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const clubForm = document.getElementById('club-form');
    const clubsContainer = document.getElementById('clubs');
    const cityNotListedSection = document.getElementById('city-not-listed');
    
    // Function Declarations
    function addClub(name, location, description, social, city) {
        let clubs = JSON.parse(localStorage.getItem('clubs')) || [];
        clubs.push({ name, location, description, social, city });
        localStorage.setItem('clubs', JSON.stringify(clubs));
    }

    function displayClubs() {
        const clubs = JSON.parse(localStorage.getItem('clubs')) || [];
        clubsContainer.innerHTML = '';
        clubs.forEach(club => {
            const li = document.createElement('li');
            li.textContent = `${club.name}, ${club.location} - ${club.city}: ${club.description}, Socials: ${club.social}`;
            clubsContainer.appendChild(li);
        });
    }

    function openModalWithClubInfo(club) {
        document.getElementById('modal-club-name').innerText = club.name;
    
        // Create or clear the days container
        const modalContent = document.querySelector('.modal-content');
        let daysContainer = modalContent.querySelector('.days-container');
        if (!daysContainer) {
            daysContainer = document.createElement('div');
            daysContainer.classList.add('days-container');
            modalContent.insertBefore(daysContainer, modalContent.firstChild); // Insert before the first child
        } else {
            daysContainer.innerHTML = ''; // Clear existing content if reusing
        }
    

        // Dynamically create day indicators
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
            const dayBox = document.createElement('div');
            dayBox.classList.add('day-box');
            if (club.days[day] === "yes") {
                dayBox.classList.add('day-active');
            }
            dayBox.innerText = day.substring(0, 3); // Use abbreviation for the day
            daysContainer.appendChild(dayBox);
        });
    
        // Placeholder image
        const image = modalContent.querySelector('.modal-image') || new Image();
        image.src = "path/to/your/placeholder-image.jpg"; // Update with actual path
        image.classList.add('modal-image');
        if (!modalContent.contains(image)) {
            modalContent.insertBefore(image, daysContainer); // Insert the image above the days container
        }
    
        document.getElementById('modal-club-type').innerText = 'Run Type: ' + club.type;
        document.getElementById('modal-club-affiliation').innerText = 'Affiliation: ' + (club.affiliation ? club.affiliation : 'None');
        document.getElementById('modal-club-social').href = club.social;
        document.getElementById('modal-club-social').innerText = 'Visit Social Link';
        document.getElementById('club-info-modal').style.display = 'block';

            // Populate the schedule table
    const scheduleTableBody = document.querySelector('#modal-schedule-table tbody');
    scheduleTableBody.innerHTML = ''; // Clear previous entries

    club.schedule.forEach(session => {
        const row = document.createElement('tr');
        
        // Adding new properties to the session object for demonstration
        session.pace = 'Mixed'; // Example, change as needed
        session.intention = 'Training'; // Example, change as needed

        const details = ['day', 'time', 'distance', 'duration', 'pace', 'intention'];
        
        details.forEach(detail => {
            const cell = document.createElement('td');
            cell.textContent = session[detail];
            
            // Apply color coding for distance
            if (detail === 'distance') {
                const distance = parseFloat(session[detail]);
                cell.style.color = distance <= 5 ? '#4CAF50' : distance <= 10 ? '#FFEB3B' : '#F44336';
            }
            
            // Color coding for pace and intention
            if (detail === 'pace' || detail === 'intention') {
                const colors = {
                    // Pace colors
                    'Fast': '#F44336', 'Mixed': '#FFC107', 'Jog': '#2196F3', 'Run-Walk': '#9E9E9E',
                    // Intention colors
                    'Social': '#E91E63', 'Fast': '#F44336', 'Training': '#3F51B5', 'Serious': '#009688'
                };
                cell.style.color = colors[session[detail]];
            }

            row.appendChild(cell);
        });

        document.querySelector('#modal-schedule-table tbody').appendChild(row);
    });

    const timeline = document.getElementById('running-timeline');
    timeline.innerHTML = ''; // Clear previous content

    club.schedule.forEach(session => {
        const event = document.createElement('div');
        event.classList.add('timeline-event');

        const details = document.createElement('div');
        details.classList.add('timeline-event-details');
        details.innerHTML = `<strong>${session.day}</strong>: ${session.time}, ${session.distance}, ${session.duration}`;

        event.appendChild(details);
        timeline.appendChild(event);
    });

    }


    

    // Event Listeners
    document.getElementById('sals-club').addEventListener('click', () => {
const salsClubDetails = {
    name: "Sal's Club",
    days: { "Monday": "yes", "Tuesday": "no", "Wednesday": "yes", "Thursday": "no", "Friday": "yes", "Saturday": "no", "Sunday": "no" },
    type: "Mixed (Casual and Competitive)",
    affiliation: "Sponsored by Local Shoe Store",
    social: "https://example.com/salsclub",
    schedule: [
        {
            day: "Monday",
            time: "6:00 PM",
            distance: "5 km",
            duration: "30 mins"
        },
        {
            day: "Wednesday",
            time: "6:00 PM",
            distance: "8 km",
            duration: "45 mins"
        },
        {
            day: "Friday",
            time: "6:00 PM",
            distance: "10 km",
            duration: "60 mins"
        }
    ]
};

        openModalWithClubInfo(salsClubDetails);
    });






});
