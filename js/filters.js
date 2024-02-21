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
    document.querySelector('#filter-type .any').addEventListener('click', () => toggleAnyOptions('#filter-type', '.type-btn'));
    document.querySelector('#filter-days .any').addEventListener('click', () => toggleAnyOptions('#filter-days', '.day-btn'));
    document.querySelector('#filter-time .any').addEventListener('click', () => toggleAnyOptions('#filter-time', '.time-btn'));
    document.querySelector('#filter-group-size .any').addEventListener('click', () => toggleAnyOptions('#filter-group-size', '.group-size-btn'));


    
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });
     
    
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
