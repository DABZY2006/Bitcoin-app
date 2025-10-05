document.addEventListener('DOMContentLoaded', () => {
    const activityListContainer = document.getElementById('activity-list-container');
    const noActivitiesMessage = document.getElementById('no-activities-message');

    function loadActivities() {
        const activities = JSON.parse(localStorage.getItem('userActivities')) || [];

        if (activities.length === 0) {
            if (noActivitiesMessage) noActivitiesMessage.style.display = 'block';
            return;
        }
        if (noActivitiesMessage) noActivitiesMessage.style.display = 'none';

        activityListContainer.innerHTML = ''; // Clear previous items

        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.classList.add('activity-item');

            const header = document.createElement('div');
            header.classList.add('activity-header');

            const typeSpan = document.createElement('span');
            typeSpan.classList.add('activity-type');
            typeSpan.textContent = activity.type;

            const timestampSpan = document.createElement('span');
            timestampSpan.classList.add('activity-timestamp');
            timestampSpan.textContent = formatTimestamp(activity.timestamp);

            header.appendChild(typeSpan);
            header.appendChild(timestampSpan);

            const descriptionP = document.createElement('p');
            descriptionP.classList.add('activity-description');
            descriptionP.textContent = activity.description;

            activityItem.appendChild(header);
            activityItem.appendChild(descriptionP);

            activityListContainer.appendChild(activityItem);
        });
    }

    function formatTimestamp(isoString) {
        if (!isoString) return 'N/A';
        try {
            const date = new Date(isoString);
            return date.toLocaleString(); // Adjust formatting as needed
        } catch (e) {
            return isoString; // Fallback if parsing fails
        }
    }

    // Initial load
    loadActivities();
});

// Helper function (can be moved to a shared utility if needed, but fine here for now)
// Kept global for access by other scripts that will log activities
function logActivity(activity) {
    let activities = JSON.parse(localStorage.getItem('userActivities')) || [];
    // Add to the beginning to show newest first
    activities.unshift({ ...activity, timestamp: new Date().toISOString() }); 
    
    // Optional: Limit the number of stored activities
    const MAX_ACTIVITIES = 50; // Example limit
    if (activities.length > MAX_ACTIVITIES) {
        activities = activities.slice(0, MAX_ACTIVITIES);
    }
    
    localStorage.setItem('userActivities', JSON.stringify(activities));
}