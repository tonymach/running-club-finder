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
