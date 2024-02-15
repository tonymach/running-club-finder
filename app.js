document.addEventListener('DOMContentLoaded', () => {
    const provinceSelect = document.getElementById('club-province');
    const citySelect = document.getElementById('club-city');

    const citiesByProvince = {
        'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Fort McMurray', 'Medicine Hat', 'Grande Prairie'],
        'British Columbia': ['Vancouver', 'Victoria', 'Kelowna', 'Abbotsford', 'Kamloops', 'Nanaimo', 'Prince George'],
        'Manitoba': ['Winnipeg', 'Brandon', 'Steinbach', 'Portage la Prairie', 'Thompson'],
        'New Brunswick': ['Moncton', 'Saint John', 'Fredericton', 'Miramichi', 'Bathurst', 'Edmundston'],
        'Newfoundland and Labrador': ['St. John\'s', 'Corner Brook', 'Gander', 'Mount Pearl', 'Labrador City'],
        'Nova Scotia': ['Halifax', 'Sydney', 'Dartmouth', 'Truro', 'New Glasgow', 'Glace Bay'],
        'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London', 'Markham', 'Vaughan', 'Kitchener', 'Windsor', 'Guelph', 'Kingston'],
        'Prince Edward Island': ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Montague'],
        'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Levis', 'Trois-Rivieres'],
        'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Lloydminster', 'Swift Current'],
        'Northwest Territories': ['Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith', 'Behchoko'],
        'Nunavut': ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Baker Lake', 'Pangnirtung'],
        'Yukon': ['Whitehorse', 'Dawson City', 'Watson Lake', 'Haines Junction', 'Carmacks']
    };
    

    provinceSelect.addEventListener('change', () => {
        const selectedProvince = provinceSelect.value;
        const cities = citiesByProvince[selectedProvince] || [];
        citySelect.innerHTML = '<option value="">Select City</option>'; // Reset city selection
        cities.forEach(city => {
            const option = new Option(city, city);
            citySelect.add(option);
        });
    });
    
    const clubForm = document.getElementById('club-form');
    const clubsContainer = document.getElementById('clubs');

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

    function addClub(name, location, description, social, city) {
        let clubs = JSON.parse(localStorage.getItem('clubs')) || [];
        clubs.push({name, location, description, social, city});
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

    displayClubs(); // Initial display of clubs

    // Initialize the map
    const map = L.map('map').setView([56.1304, -106.3468], 5); // Center map on Canada
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    navigator.geolocation.getCurrentPosition(function(position) {
        const { latitude, longitude } = position.coords;
        const map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      });

      
    const reportMissingCityBtn = document.getElementById('report-missing-city');
    const cityNotListedSection = document.getElementById('city-not-listed');
    
    // Show the report button if the "Select City" option is chosen after selecting a province
    document.getElementById('club-city').addEventListener('change', function() {
        if (this.value === "") {
            cityNotListedSection.style.display = 'block';
        } else {
            cityNotListedSection.style.display = 'none';
        }
    });

    fetch('clubs.json').then(response => response.json()).then(clubs => {
        clubs.forEach(club => {
          if (isWithinDistance(userLocation, club.location, 20)) {
            L.marker([club.location.lat, club.location.lng]).addTo(map)
              .bindPopup(`${club.name}`);
          }
        });
      });

      
    // Email draft functionality
    reportMissingCityBtn.addEventListener('click', function() {
        const selectedProvince = document.getElementById('club-province').value;
        const mailto = `mailto:info@findmyrunners.com?subject=City Not Listed&body=Hi FindMyRunners Team,%0D%0A%0D%0AMy city is not listed in the ${selectedProvince} province dropdown. Could you please add it to your list?%0D%0A%0D%0AThank you!`;
        window.location.href = mailto;
    });
});
