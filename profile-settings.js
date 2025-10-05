document.addEventListener('DOMContentLoaded', () => {
    const profileNameEl = document.getElementById('setting-profile-name');
    const profileEmailEl = document.getElementById('setting-profile-email');
    const logoutBtn = document.getElementById('logout-btn');

    const registeredName = localStorage.getItem('registeredUserName');
    const registeredEmail = localStorage.getItem('registeredUserEmail');

    if (registeredName) {
        profileNameEl.textContent = registeredName;
    } else {
        profileNameEl.textContent = 'N/A'; // Default if not found
    }

    if (registeredEmail) {
        profileEmailEl.textContent = registeredEmail;
    } else {
        profileEmailEl.textContent = 'N/A'; // Default if not found
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Optional: Clear any other session-specific localStorage items here
            // For example: localStorage.removeItem('userToken');
            // For this app, returning to index.html effectively logs out.
            window.location.href = 'index.html';
        });
    }
});