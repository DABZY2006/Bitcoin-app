document.addEventListener('DOMContentLoaded', () => {
    const cryptoOptionButtons = document.querySelectorAll('.crypto-option-button');

    cryptoOptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cryptoType = button.dataset.crypto;
            const cryptoName = button.dataset.name; // For potential use in the next page title
            if (cryptoType) {
                window.location.href = `crypto-details.html?type=${cryptoType}&name=${encodeURIComponent(cryptoName)}`;
            }
        });
    });
});