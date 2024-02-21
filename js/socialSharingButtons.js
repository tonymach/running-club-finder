// Func demo calls: 
// document.getElementById('add-to-calendar-top').addEventListener('click', () => downloadICS(salsClubDetails));
// document.getElementById('add-to-calendar-bottom').addEventListener('click', () => downloadICS(salsClubDetails));

// document.getElementById('print-schedule-bottom').addEventListener('click', () => printSchedule(salsClubDetails));


function downloadICS(clubDetails) {
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Your Organization//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ];

    clubDetails.schedule.forEach((session, index) => {
        // Determine the correct date for the session, ensuring it's the next occurrence
        let sessionDay = moment().day(session.day); // Get the date for this week's session day
        if (sessionDay.isBefore(moment(), 'day')) {
            sessionDay.add(7, 'days'); // Move to next week if today is past the session day
        }
        
        const sessionTime = moment(session.time, 'h:mm A');
        const sessionDate = sessionDay.set({
            hour: sessionTime.get('hour'),
            minute: sessionTime.get('minute'),
            second: 0
        });

        // Calculate the duration based on distance
        const distanceInKm = parseFloat(session.distance); // Assuming distance is already in km
        const estimatedDurationHours = (distanceInKm / 5) * 0.75; // 45 minutes per 5km, converted to hours
        const endTime = sessionDate.clone().add(estimatedDurationHours, 'hours');

        icsContent.push(
            'BEGIN:VEVENT',
            `UID:${index}@salsclub.com`,
            `DTSTAMP:${moment.utc().format('YYYYMMDDTHHmmss')}Z`,
            `DTSTART:${sessionDate.utc().format('YYYYMMDDTHHmmss')}Z`,
            `DTEND:${endTime.utc().format('YYYYMMDDTHHmmss')}Z`,
            `SUMMARY:${clubDetails.name} - ${session.intention}`,
            `DESCRIPTION:Distance: ${session.distance}, Pace: ${session.pace}, Group Size: ${clubDetails.groupSize}, Beginner Friendly: ${clubDetails.beginnerFriendly ? 'Yes' : 'No'}`,
            'END:VEVENT'
        );
    });

    icsContent.push('END:VCALENDAR');
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${clubDetails.name.replace(/\s+/g, '_')}_Schedule.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function printSchedule(clubDetails) {
    const printableWindow = window.open('', '_blank', 'width=600,height=400');
    printableWindow.document.write('<html><head><title>Print Schedule</title>');
    printableWindow.document.write('<style>');
    printableWindow.document.write('table { width: 100%; border-collapse: collapse; }');
    printableWindow.document.write('th, td { border: 1px solid black; padding: 8px; text-align: left; }');
    printableWindow.document.write('th { background-color: #f2f2f2; }');
    printableWindow.document.write('</style>');
    printableWindow.document.write('</head><body>');
    printableWindow.document.write(`<h2>${clubDetails.name} Schedule</h2>`);
    printableWindow.document.write('<table><tr><th>Day</th><th>Time</th><th>Distance</th><th>Duration</th><th>Pace</th><th>Intention</th></tr>');

    clubDetails.schedule.forEach(session => {
        printableWindow.document.write(`<tr>
            <td>${session.day}</td>
            <td>${session.time}</td>
            <td>${session.distance}</td>
            <td>${session.duration}</td>
            <td>${session.pace}</td>
            <td>${session.intention}</td>
        </tr>`);
    });

    printableWindow.document.write('</table>');
    printableWindow.document.write('</body></html>');
    printableWindow.document.close(); // Close the document for writing, ready for print
    printableWindow.focus(); // Focus on the new window to make sure the print dialog appears on top

    // Use timeout to ensure everything is loaded before opening the print dialog
    setTimeout(() => {
        printableWindow.print(); // Open the print dialog
        printableWindow.close(); // Close the window after printing
    }, 250);
}
