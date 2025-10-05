document.addEventListener('DOMContentLoaded', () => {
    const cryptoDetailsTitle = document.getElementById('crypto-details-title');
    const cryptoNameTagLabel = document.getElementById('crypto-name-tag');
    const walletAddressInput = document.getElementById('wallet-address');
    const withdrawalAmountInput = document.getElementById('withdrawal-amount-crypto');
    const submitCryptoWithdrawalBtn = document.getElementById('submit-crypto-withdrawal-btn');
    const errorMessageEl = document.getElementById('error-message-crypto');
    
    const confirmationModal = document.getElementById('crypto-withdrawal-confirmation-modal');
    const proceedConfirmationBtn = document.getElementById('proceed-crypto-confirmation-btn');
    const cancelConfirmationBtn = document.getElementById('cancel-crypto-confirmation-btn');
    // const confirmationMessageEl = document.getElementById('crypto-confirmation-message'); // Message is static in HTML

    const urlParams = new URLSearchParams(window.location.search);
    const cryptoType = urlParams.get('type'); // e.g., "bitcoin", "ethereum"
    const cryptoDisplayName = urlParams.get('name') || (cryptoType ? cryptoType.charAt(0).toUpperCase() + cryptoType.slice(1) : 'Crypto');

    if (cryptoDetailsTitle) {
        cryptoDetailsTitle.textContent = `Withdraw ${cryptoDisplayName}`;
    }
    if (cryptoNameTagLabel) {
        cryptoNameTagLabel.textContent = cryptoDisplayName;
    }
     if (walletAddressInput) {
        walletAddressInput.placeholder = `Enter ${cryptoDisplayName} wallet address`;
    }


    if (submitCryptoWithdrawalBtn) {
        submitCryptoWithdrawalBtn.addEventListener('click', () => {
            errorMessageEl.textContent = '';
            const walletAddress = walletAddressInput.value.trim();
            const withdrawalAmount = parseFloat(withdrawalAmountInput.value);

            if (!walletAddress) {
                errorMessageEl.textContent = `Please enter your ${cryptoDisplayName} wallet address.`;
                walletAddressInput.focus();
                return;
            }

            if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
                errorMessageEl.textContent = 'Please enter a valid withdrawal amount.';
                withdrawalAmountInput.focus();
                return;
            }
            
            if (confirmationModal) {
                confirmationModal.style.display = 'flex';
            }
        });
    }

    if (proceedConfirmationBtn) {
        proceedConfirmationBtn.addEventListener('click', () => {
            if (confirmationModal) {
                confirmationModal.style.display = 'none';
            }
            
            const walletAddress = walletAddressInput.value.trim();
            const withdrawalAmount = parseFloat(withdrawalAmountInput.value);

            // Navigate to withdrawal-upload.html
            // 'provider' will be the cryptoType (e.g., "bitcoin")
            // 'tag' will be the walletAddress
            const params = new URLSearchParams({
                provider: cryptoType, 
                amount: withdrawalAmount,
                tag: walletAddress, // 'tag' is used by withdrawal-upload.js for the identifier
                returnTo: 'crypto-details.html' // For the back button on withdrawal-upload page
            });
            window.location.href = `withdrawal-upload.html?${params.toString()}`;
        });
    }

    if (cancelConfirmationBtn) {
        cancelConfirmationBtn.addEventListener('click', () => {
            if (confirmationModal) {
                confirmationModal.style.display = 'none';
            }
        });
    }
});