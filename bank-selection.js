document.addEventListener('DOMContentLoaded', () => {
    const bankOptionButtons = document.querySelectorAll('.bank-option-button');

    bankOptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const provider = button.dataset.provider;
            if (provider) {
                window.location.href = `bank-details.html?provider=${provider}`;
            }
        });
    });
});

