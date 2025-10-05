document.addEventListener('DOMContentLoaded', () => {
    const bankWithdrawBtn = document.getElementById('bank-withdraw-btn');
    const cryptoWithdrawBtn = document.getElementById('crypto-withdraw-btn');
    const notificationMessageEl = document.getElementById('withdrawal-notification-message');

    const cryptoNotificationText = "Oops! Feature isn't available yet! We'll notify you when it's ready. Thanks";

    function showCryptoNotification(message) {
        notificationMessageEl.textContent = message;
        // Optional: Clear message after some time
        setTimeout(() => {
            // notificationMessageEl.textContent = ''; 
        }, 5000); 
    }

    if (bankWithdrawBtn) {
        bankWithdrawBtn.addEventListener('click', () => {
            // Navigate to the bank selection page
            window.location.href = 'bank-selection.html';
        });
    }

    if (cryptoWithdrawBtn) {
        cryptoWithdrawBtn.addEventListener('click', () => {
            // showCryptoNotification(cryptoNotificationText); // Previous behavior
            window.location.href = 'crypto-selection.html'; // Navigate to crypto selection page
        });
    }
});