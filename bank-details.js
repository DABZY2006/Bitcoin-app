document.addEventListener('DOMContentLoaded', () => {
    const bankDetailsTitle = document.getElementById('bank-details-title');
    const providerNameTagLabel = document.getElementById('provider-name-tag');
    const bankTagInput = document.getElementById('bank-tag');
    const withdrawalAmountInput = document.getElementById('withdrawal-amount');
    const submitWithdrawalBtn = document.getElementById('submit-withdrawal-btn');
    const errorMessageEl = document.getElementById('error-message-bank');
    const confirmationModal = document.getElementById('withdrawal-confirmation-modal');
    const proceedConfirmationBtn = document.getElementById('proceed-confirmation-btn');
    const cancelConfirmationBtn = document.getElementById('cancel-confirmation-btn');
    const confirmationMessageEl = document.getElementById('confirmation-message');

    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get('provider');

    let providerDisplayName = 'Provider'; // Default
    if (provider === 'paypal') {
        providerDisplayName = 'PayPal';
        bankTagInput.placeholder = 'e.g., your@email.com or PayPal.Me link';
    } else if (provider === 'cashapp') {
        providerDisplayName = 'Cash App';
        bankTagInput.placeholder = 'e.g., $YourCashtag';
    }

    if (bankDetailsTitle) {
        bankDetailsTitle.textContent = `Withdraw to ${providerDisplayName}`;
    }
    if (providerNameTagLabel) {
        providerNameTagLabel.textContent = providerDisplayName;
    }

    if (submitWithdrawalBtn) {
        submitWithdrawalBtn.addEventListener('click', () => {
            errorMessageEl.textContent = '';
            const bankTag = bankTagInput.value.trim();
            const withdrawalAmount = parseFloat(withdrawalAmountInput.value);

            if (!bankTag) {
                errorMessageEl.textContent = `Please enter your ${providerDisplayName} tag/ID.`;
                bankTagInput.focus();
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
            
            const bankTag = bankTagInput.value.trim();
            const withdrawalAmount = parseFloat(withdrawalAmountInput.value);

            const params = new URLSearchParams({
                provider: provider,
                amount: withdrawalAmount,
                tag: bankTag
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