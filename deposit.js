document.addEventListener('DOMContentLoaded', () => {
    const paypalBtn = document.getElementById('paypal-btn');
    const cashappBtn = document.getElementById('cashapp-btn');
    const giftcardBtn = document.getElementById('giftcard-btn'); 
    const notificationMessageEl = document.getElementById('deposit-notification-message');

    const notificationText = "Oops! Feature isn't available yet! We'll notify you when it's ready. Thanks";

    function showNotification(message) {
        notificationMessageEl.textContent = message;
        setTimeout(() => {
            // notificationMessageEl.textContent = ''; // Keep message for clarity unless UX demands clearing
        }, 5000); 
    }

    if (paypalBtn) {
        paypalBtn.addEventListener('click', () => {
            showNotification(notificationText);
        });
    }

    if (cashappBtn) {
        cashappBtn.addEventListener('click', () => {
            showNotification(notificationText);
        });
    }

    if (giftcardBtn) {
        giftcardBtn.addEventListener('click', () => {
            // Navigate to the new gift card selection page
            window.location.href = 'giftcards.html';
        });
    }
});