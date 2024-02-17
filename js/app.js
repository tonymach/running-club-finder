document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.find-group-btn, .summary-line');
    // Start with all buttons shaking
    startInitialShake(buttons);
    // After the initial shake, start the sequential loop
    setTimeout(() => {
        shakeSequenceLoop(buttons);
    }, 3000); // Wait for the initial shake to end
});

function startInitialShake(buttons) {
    buttons.forEach(button => {
        button.style.animation = 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both infinite';
    });
    // Stop the initial shake after a short period
    setTimeout(() => {
        buttons.forEach(button => {
            button.style.animation = 'none';
        });
    }, 3000); // Adjust time as needed based on desired initial shake duration
}

function shakeSequenceLoop(buttons) {
    let index = 0;
    function shakeNextButton() {
        if (index < buttons.length) {
            const button = buttons[index];
            button.style.animation = 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both';
            setTimeout(() => {
                button.style.animation = 'none';
                index++;
                shakeNextButton();
            }, 820); // Match the CSS animation duration
        } else {
            // Reset for the next cycle after a pause
            setTimeout(() => {
                index = 0;
                shakeNextButton();
            }, 2000); // Pause between cycles
        }
    }
    shakeNextButton();
    
    // Optionally, stop the loop when any button is clicked
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => {
                btn.style.animation = 'none';
                // Remove the event listener to prevent restarting
                btn.removeEventListener('click', shakeNextButton);
            });
        });
    });
}



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

    function toggleAccordionItem(collapseElement) {
        const isShown = collapseElement.classList.contains('show');
        // First, close all items
        const allItems = document.querySelectorAll('.accordion-collapse');
        allItems.forEach(item => {
            item.classList.remove('show');
        });
        // Then, if the clicked item was not already shown, open it
        if (!isShown) {
            collapseElement.classList.add('show');
        }
    }
    

    function openModalWithClubInfo(club) {
        // Basic club info adjustments
        document.getElementById('modal-club-name').innerText = club.name;
        document.getElementById('modal-club-affiliation').innerText = club.affiliation === 'Professional' ? `Affiliation: Professional - ${club.businessName}` : 'Affiliation: Community';
        document.getElementById('modal-club-social').href = club.social || '#';
        document.getElementById('modal-club-social').innerText = club.social ? 'Visit Social Link' : '';
        document.getElementById('club-info-modal').style.display = 'block';
    
        // Accordion for the Schedule - ensuring initial closure
        const scheduleAccordion = document.getElementById('schedule-accordion');
        scheduleAccordion.innerHTML = ''; // Clear existing accordion items
        club.schedule.forEach((session, index) => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            accordionItem.innerHTML = `
                <div class="accordion-header" id="heading${index}">
                    <h5 class="mb-0">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                            ${session.day}
                        </button>
                    </h5>
                </div>
                <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}">
                    <div class="accordion-body">
                        ${Object.keys(session).filter(key => session[key] !== undefined && key !== 'day').map(key => `<p>${key.charAt(0).toUpperCase() + key.slice(1)}: ${session[key]}</p>`).join('')}
                    </div>
                </div>
            `;
            scheduleAccordion.appendChild(accordionItem);
        });
    
        // Manual accordion toggle functionality
        scheduleAccordion.querySelectorAll('.accordion-button').forEach(button => {
            button.addEventListener('click', function() {
                // Toggle the "collapse" state of the target accordion item
                const collapseElementId = this.getAttribute('data-bs-target');
                const collapseElement = document.querySelector(collapseElementId);
                collapseElement.classList.toggle('show');
                
                // Optionally, close other open items
                document.querySelectorAll('.accordion-collapse').forEach(el => {
                    if (el.id !== collapseElementId.substring(1)) { // Exclude the "#" in the id
                        el.classList.remove('show');
                    }
                });
            });
        });
    }
    
    // Event listener setup remains unchanged
    document.getElementById('sals-club').addEventListener('click', () => {
        openModalWithClubInfo(salsClubDetails); // Assuming salsClubDetails is defined elsewhere
    });


    const salsClubDetails = {
        name: "Sal's Club",
        // Assume days aggregation to be handled separately
        affiliation: "Professional",
        businessName: "Sal's Running Supplies", // New attribute for professional affiliation
        social: "https://example.com/salsclub",
        timeOfDay: "Evening",
        groupSize: "11-20",
        beginnerFriendly: true,
        schedule: [
            { day: "Monday", time: "6:00 PM", distance: "5 km", duration: "30 mins", pace: "Casual", intention: "Fun" },
            { day: "Wednesday", time: "6:00 PM", distance: "8 km", duration: "45 mins", pace: "Moderate", intention: "Training" },
            { day: "Friday", time: "6:00 PM", distance: "10 km", duration: "60 mins", pace: "Fast", intention: "Competition Prep" }
        ]
    };
        






});
