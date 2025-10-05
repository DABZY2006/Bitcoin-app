document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorMessageElement = document.getElementById('error-message');
    const statusOverlay = document.getElementById('status-overlay'); 
    const statusMessageElement = document.getElementById('status-message'); 
    const loginTriggerLink = document.getElementById('login-trigger-link'); 

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        errorMessageElement.textContent = '';

        const fullName = document.getElementById('full-name').value.trim();
        const phoneNumber = document.getElementById('phone-number').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!fullName || !phoneNumber || !email || !password || !confirmPassword) {
            errorMessageElement.textContent = 'All fields are required.';
            return;
        }

        if (password.length < 8) {
            errorMessageElement.textContent = 'Password must be at least 8 characters long.';
            return;
        }

        if (password !== confirmPassword) {
            errorMessageElement.textContent = 'Passwords do not match.';
            confirmPasswordInput.focus();
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorMessageElement.textContent = 'Please enter a valid email address.';
            return;
        }

        localStorage.setItem('registeredUserName', fullName);
        localStorage.setItem('registeredUserEmail', email); // Added to save email
        
        // Log account creation activity
        logActivity({
            type: 'Account Creation',
            description: `Account created for ${fullName} (${email}).`
        });

        if (statusOverlay && statusMessageElement) {
            statusMessageElement.textContent = 'YOUR ACCOUNT HAS BEEN SUCCESSFULLY CREATED';
            statusOverlay.style.display = 'flex';
        }

        setTimeout(() => {
            window.location.href = 'app.html';
        }, 3500); 

    });

    if (loginTriggerLink) {
        loginTriggerLink.addEventListener('click', function(event) {
            event.preventDefault();
            if (statusOverlay && statusMessageElement) {
                statusMessageElement.textContent = 'WELCOME BACK';
                statusOverlay.style.display = 'flex';
            }
            setTimeout(() => {
                window.location.href = 'app.html';
            }, 3500); 
        });
    }
});

// Helper function to add activity to localStorage (ensure this is defined if not using activity-log.js on this page)
// If activity-log.js is loaded before this, it might be available. For safety, define it or ensure load order.
// For simplicity in this structure, assuming activity-log.js defines it globally or it's defined here.
if (typeof logActivity === 'undefined') {
    function logActivity(activity) {
        let activities = JSON.parse(localStorage.getItem('userActivities')) || [];
        activities.unshift({ ...activity, timestamp: new Date().toISOString() });
        const MAX_ACTIVITIES = 50;
        if (activities.length > MAX_ACTIVITIES) {
            activities = activities.slice(0, MAX_ACTIVITIES);
        }
        localStorage.setItem('userActivities', JSON.stringify(activities));
    }
}