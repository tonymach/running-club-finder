document.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
    });
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

    // Location: Directly add if selected
    let provinceSelected = document.getElementById('club-province').value;
    if (provinceSelected) {
        filterSummary.push(`Province: ${provinceSelected}`);
    }
    let citySelected = document.getElementById('club-city').value;
    if (citySelected) {
        filterSummary.push(`City: ${citySelected}`);
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
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active')); // Remove 'active' from all
        btn.classList.add('active'); // Add 'active' to clicked button
        // Optionally set a variable or form value based on the selected type
    });
});

document.getElementById('clear-days').addEventListener('click', function() {
    document.querySelectorAll('#filter-days .day-btn').forEach(btn => {
        btn.classList.remove('active');
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
    const provinceSelect = document.getElementById('club-province');
    const citySelect = document.getElementById('club-city');
    const clubForm = document.getElementById('club-form');
    const clubsContainer = document.getElementById('clubs');
    const cityNotListedSection = document.getElementById('city-not-listed');
    const reportMissingCityBtn = document.getElementById('report-missing-city');
    
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

    
    // Initialize Map
    function initMap() {
        const map = L.map('map').setView([56.1304, -106.3468], 5); // Default view
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    
        navigator.geolocation.getCurrentPosition(function(position) {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 13); // Set view to user's location
        }, function(error) {
            console.error("Geolocation failed: ", error);
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

    document.querySelector('.close-button').addEventListener('click', () => {
        document.getElementById('club-info-modal').style.display = 'none';
    });

    provinceSelect.addEventListener('change', () => {
        const selectedProvince = provinceSelect.value;
        const cities = citiesByProvince[selectedProvince] || [];
        citySelect.innerHTML = '<option value="">Select City</option>';
        cities.forEach(city => {
            const option = new Option(city, city);
            citySelect.add(option);
        });
    });

    clubForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const clubName = document.getElementById('club-name').value;
        const clubLocation = document.getElementById('club-location').value;
        const clubDescription = document.getElementById('club-description').value;
        const clubSocial = document.getElementById('club-social').value;
        let city = citySelect.value;
        addClub(clubName, clubLocation, clubDescription, clubSocial, city);
        displayClubs();
    });

    document.getElementById('club-city').addEventListener('change', function() {
        if (this.value === "") {
            cityNotListedSection.style.display = 'block';
        } else {
            cityNotListedSection.style.display = 'none';
        }
    });

    // Initialize functionalities
    initMap();


    
});
