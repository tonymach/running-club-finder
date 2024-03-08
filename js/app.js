

var clubIcon = L.icon({
    iconUrl: 'images/shoeIcon.png',
    iconSize: [50, 50], // Scale down to 50x50 pixels or to a size that fits your design
    iconAnchor: [25, 50], // Adjust based on the actual size to anchor the icon correctly
    popupAnchor: [0, -50] // Adjust so the popup opens above the icon
});

var userIcon = L.icon({
    iconUrl: 'images/medalIcon.png',
    iconSize: [50, 50], // Similarly, scale down to an appropriate size
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
});


// Function to load and parse JSON data from a file
async function loadRunningClubsData() {
    try {
        // Replace 'clubs.json' with the path to your actual JSON file
        const response = await fetch('js/clubs.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Running Clubs Data:', data);
        return data;
    } catch (error) {
        console.error('Error loading or parsing clubs data:', error);
    }
}


async function getNearestIntersection(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=18`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Attempt to construct a more detailed location description
        const road = data.address.road || '';
        const neighbourhood = data.address.neighbourhood || data.address.suburb || '';
        const cityDistrict = data.address.city_district || '';
        const city = data.address.city || '';
        
        // Combine available information
        let locationDescription = road;
        if (neighbourhood && neighbourhood !== cityDistrict && neighbourhood !== road) {
            locationDescription += locationDescription ? ` and ${neighbourhood}` : neighbourhood;
        } else if (cityDistrict && cityDistrict !== road) {
            locationDescription += locationDescription ? `, near ${cityDistrict}` : cityDistrict;
        } else if (city && city !== road) {
            locationDescription += locationDescription ? `, in ${city}` : city;
        }

        // Fallback to a broader location if specific details are unavailable
        return locationDescription || city || 'Unknown location';
    } catch (error) {
        console.error('Failed to fetch nearest intersection:', error);
        return 'Unknown location';
    }
}




async function displayClubsList(clubs, userLat, userLon) {
    const listElement = document.getElementById('clubs');
    listElement.innerHTML = ''; // Clear existing list items

    for (const club of clubs) {
        // Await the nearest intersection or fallback to distance
        let locationInfo;
        try {
            locationInfo = await getNearestIntersection(club.location.lat, club.location.lon);
        } catch (error) {
            console.error("Error getting nearest intersection:", error);
            locationInfo = `${getDistanceFromLatLonInKm(userLat, userLon, club.location.lat, club.location.lon).toFixed(2)} km away`;
        }

        const listItem = document.createElement('li');
        listItem.id = `club-${club.id}`; // Assuming each club has a unique ID

        listItem.innerHTML = `
            <span><b>${club.name}</b> - <b>${locationInfo}</b></span>
            <div class="badges"></div>
        `;

        // Populate badges
        const badgesContainer = listItem.querySelector('.badges');
        if (club.beginnerFriendly) {
            badgesContainer.appendChild(createBadge('Beginner Friendly', 'beginner-friendly'));
        }
        if (club.groupSize && club.groupSize === '11-20') {
            badgesContainer.appendChild(createBadge('Small Group', 'small-group'));
        }
        if (club.bagDrop) {
            badgesContainer.appendChild(createBadge('Bag Drop', 'bag-drop'));
        }

        // Append the list item to the list
        listElement.appendChild(listItem);

        // Attach an event listener to open the modal with club details
        listItem.addEventListener('click', () => openModalWithClubInfo(club));
    };
}


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function displayClubsOnMap(clubs, map) {
    clubs.forEach(club => {
        // Simplified HTML content for the marker popup
        const popupContent = `
            <div class="custom-popup-content">
                <h3 class="popup-club-name">${club.name}</h3>
                <button class="popup-more-info-btn" onclick="openModalWithClubInfo(${JSON.stringify(club).split('"').join("&quot;")})">More Info</button>
            </div>
        `;

        const marker = L.marker([club.location.lat, club.location.lon], {icon: clubIcon}).addTo(map);
        marker.bindPopup(popupContent, {
            className: 'custom-popup' // Use this for minimal styling adjustments if needed
        });
    });
}

// Assuming 'userLat' and 'userLon' hold the user's latitude and longitude
function findClosestClubs(clubs, userLat, userLon, count = 5) {
    const clubsWithDistance = clubs.map(club => ({
        ...club,
        distance: getDistanceFromLatLonInKm(userLat, userLon, club.location.lat, club.location.lon)
    }));

    return clubsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, count);
}

function updateMapViewWithClubs(clubs, map) {
    const group = L.featureGroup(clubs.map(club => L.marker([club.location.lat, club.location.lon])));
    map.fitBounds(group.getBounds(), {padding: [50, 50]});
}


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}


document.addEventListener('DOMContentLoaded', async () => {
    
    const runningClubsData = await loadRunningClubsData();

    // Initialize the map with a default view.

    // Initialize the map centered on Toronto as a placeholder.
    var map = L.map('map').setView([43.651070, -79.347015], 13); // Coordinates for Toronto

    // Add the tile layer to the map.
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicnVubmVyc2hpZ2hpbnN0IiwiYSI6ImNsc293d3VkaTBrM2Yya21wOGs5amltZzEifQ.wrp2n2y_MOPmKCQCrVulKQ'
    }).addTo(map);

    // Attempt to get the user's geolocation.
    navigator.geolocation.getCurrentPosition(async function(position) {
        // User's location obtained successfully; re-center the map on the user's location.
        var userLat = position.coords.latitude;
        var userLon = position.coords.longitude;

        // Update map view to user's location with an appropriate zoom level.
        map.setView([userLat, userLon], 13);

        // Optionally, add a marker at the user's location.
        L.marker([userLat, userLon], {icon: userIcon}).addTo(map)
            .bindPopup('You are here.');

        // Load and display running clubs, find closest clubs, etc.
        // This part of your logic remains the same.
        const runningClubsData = await loadRunningClubsData();
        if (runningClubsData && runningClubsData.runningClubs) {
            displayClubsOnMap(runningClubsData.runningClubs, map);
            const closestClubs = findClosestClubs(runningClubsData.runningClubs, userLat, userLon);
            updateMapViewWithClubs(closestClubs, map);
        }

        displayClubsList(runningClubsData.runningClubs, userLat, userLon); // Now passing user location

    }, function(error) {
        // Geolocation failed or was denied by the user.
        console.warn(`Geolocation error: ${error.message}`);
        // You can handle this case as needed, maybe show a modal or alert.
        // Since the map is already initialized with a default view, it remains usable.
    });

    map.addControl(new L.Control.FullScreen({
        position: 'topright',
        title: 'Show me the full map',
        titleCancel: 'Exit fullscreen mode',
        forceSeparateButton: true,
    }));



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

// For Group Size buttons
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle 'active' class on click without affecting other buttons
        btn.classList.toggle('active');
    });
});



    function createSocialLink(id, href, iconClassOrImageUrl, text, isImage = false) {
        const link = document.createElement('a');
        link.id = id;
        link.href = href;
        link.target = "_blank";
        link.className = "social-link"; // Ensure this class is styled appropriately in your CSS
        if (isImage) {
            // If the link is for the X logo, use an <img> tag instead of an <i> tag
            link.innerHTML = `<img src="${iconClassOrImageUrl}" alt="${text}" style="height: 14px; width: 14px;">`;
        } else {
            // For other social links, continue using the <i> tag with Font Awesome classes
            link.innerHTML = `<i class="${iconClassOrImageUrl}"></i>`;
        }
        return link;
    }
    
    
    function createContactInfo(id, iconClass, content) {
            const container = document.createElement('p');
            container.innerHTML = `<i class="${iconClass}"></i> <span id="${id}">${content}</span>`;
            return container;
        }
    

    let modalMapInstance = null;
    
    function openModalWithClubInfo(details) {
        // Display the modal
        const modal = document.getElementById('club-info-modal');
        modal.style.display = "block";
        // Reference to containers
        const socialLinksContainer = document.querySelector('.modal-socials .social-links');
        const contactInfoContainer = document.querySelector('.modal-socials .contact-info');
    
        // Clear previous content
        socialLinksContainer.innerHTML = '';
        contactInfoContainer.innerHTML = '';
    
    // Check if the modal map has already been initialized
    if (!modalMapInstance) {
        // Initialize the map in the modal and assign it to the global variable
        modalMapInstance = L.map('map-section-info', {
            center: [details.location.lat, details.location.lon],
            zoom: 13
        });

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoicnVubmVyc2hpZ2hpbnN0IiwiYSI6ImNsc293d3VkaTBrM2Yya21wOGs5amltZzEifQ.wrp2n2y_MOPmKCQCrVulKQ'
        }).addTo(modalMapInstance);
    } else {
        // Map is already initialized, just update its view
        modalMapInstance.setView([details.location.lat, details.location.lon], 13);
    }
    // Clear existing markers before adding a new one
    modalMapInstance.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            modalMapInstance.removeLayer(layer);
        }
    });

    // Add marker to the map
    L.marker([details.location.lat, details.location.lon], {icon: clubIcon}).addTo(modalMapInstance);

        // Populate social media links if they exist
        details.socials.forEach(social => {
            if (social.instagram) {
                socialLinksContainer.appendChild(createSocialLink('instagram-link', social.instagram, 'fab fa-instagram', 'Instagram'));
            } else if (social.twitter) {
                // Use the provided logo URL for X (formerly Twitter) and set isImage to true
                socialLinksContainer.appendChild(createSocialLink('twitter-link', social.twitter, 'https://cdn.cms-twdigitalassets.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.768.png', 'X', true));
            } else if (social.website) {
                socialLinksContainer.appendChild(createSocialLink('website-link', social.website, 'fas fa-globe', 'Site'));
            } else if (social.phone) {
                document.querySelector('.modal-socials .contact-info').appendChild(createContactInfo('phone-number', 'fas fa-phone-alt', social.phone));
            } else if (social.email) {
                document.querySelector('.modal-socials .contact-info').appendChild(createContactInfo('email-address', 'fas fa-envelope', social.email));
            }
        });

        // Populate basic info
        document.getElementById('modal-club-name').textContent = details.name;
        document.getElementById('modal-club-type').querySelector('span').textContent = details.runType;
        document.getElementById('modal-club-affiliation').querySelector('span').textContent = details.businessName;

    
        const existingBadges = modal.getElementsByClassName('badges')[0];
        if (existingBadges) {
            existingBadges.remove();
        }

        // Add badges
        const badgesContainer = document.createElement('div');
        badgesContainer.className = 'badges';
        if (details.beginnerFriendly) {
            badgesContainer.appendChild(createBadge('Beginner Friendly', 'beginner-friendly'));
        }
        if (details.groupSize === '11-20') {
            badgesContainer.appendChild(createBadge('Small Group', 'small-group'));
        }
        if (details.bagDrop) {
            badgesContainer.appendChild(createBadge('Bag Drop', 'bag-drop'));
        }
    
        // Insert badges above the Club Social
        const runningDaysSection = document.getElementById('modal-socials');
        modal.getElementsByClassName('modal-content')[0].insertBefore(badgesContainer, runningDaysSection);
    
    
        // Populate Schedule Accordion
        const scheduleAccordion = document.getElementById('schedule-accordion');
        scheduleAccordion.innerHTML = ''; // Clear previous entries
        details.schedule.forEach(session => {
            scheduleAccordion.appendChild(createScheduleItem(session));
        });
    
        // Close button functionality
        document.querySelector('.close-button').onclick = function() {
            modal.style.display = "none";
        };
    
        // Clicking outside of the modal closes it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    // Add event listeners for "Add to Calendar" and "Print Schedule" buttons
    const addToCalendarButtons = document.querySelectorAll('#add-to-calendar-top, #add-to-calendar-bottom');
    const printScheduleButton = document.getElementById('print-schedule-bottom');

    // Remove existing event listeners to prevent duplicates
    addToCalendarButtons.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    printScheduleButton.replaceWith(printScheduleButton.cloneNode(true));

    // Re-query to get the cloned elements
    const clonedAddToCalendarButtons = document.querySelectorAll('#add-to-calendar-top, #add-to-calendar-bottom');
    const clonedPrintScheduleButton = document.getElementById('print-schedule-bottom');

    // Add new event listeners
    clonedAddToCalendarButtons.forEach(button => {
        button.addEventListener('click', () => downloadICS(details));
    });
    clonedPrintScheduleButton.addEventListener('click', () => printSchedule(details));
    }
    
    function createBadge(text, className) {
        const badge = document.createElement('span');
        badge.className = `badge ${className}`;
        badge.textContent = text;
        return badge;
    }
    
    function createScheduleItem(session) {
        const item = document.createElement('div');
        item.className = 'accordion-item';
        item.innerHTML = `
            <div class="accordion-header">${session.day} - ${session.time} <i class="arrow down"></i></div>
            <div class="accordion-content">
                <p>Distance: ${session.distance}</p>
                <p>Duration: ${session.duration}</p>
                <p>Pace: ${session.pace}</p>
                <p>Intention: ${session.intention}</p>
            </div>
        `;
    
        // Event listener for the accordion header
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', function() {
            const arrow = this.querySelector('.arrow');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                arrow.classList.replace('up', 'down');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                arrow.classList.replace('down', 'up');
            }
        });
    
        return item;
    }
    


