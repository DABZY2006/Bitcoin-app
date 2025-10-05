document.addEventListener('DOMContentLoaded', () => {
    const uploadPictureBtn = document.getElementById('upload-picture-btn');
    const uploadPictureInput = document.getElementById('upload-picture-input');
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const takePhotoInput = document.getElementById('take-photo-input');
    const imagePreviewArea = document.getElementById('image-preview-area');
    const verificationImagePreview = document.getElementById('verification-image-preview');
    const submitVerificationBtn = document.getElementById('submit-verification-btn');
    const errorMessageEl = document.getElementById('error-message-upload');
    const processingOverlay = document.getElementById('withdrawal-upload-processing-overlay');
    const withdrawalInfoEl = document.getElementById('withdrawal-info');
    const uploadPageBackButton = document.getElementById('upload-page-back-button');

    let selectedFile = null;
    const userEmailForNotifications = "usman2006dabzy@gmail.com"; // User specified email

    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get('provider');
    const amount = urlParams.get('amount');
    const tag = urlParams.get('tag'); // This is wallet address for crypto, or bank tag for bank

    if (withdrawalInfoEl && provider && amount) {
        let providerDisplayName = provider.charAt(0).toUpperCase() + provider.slice(1);
        if (provider.toLowerCase() === 'cashapp') providerDisplayName = 'Cash App';
        // For other crypto like 'bitcoin', 'ethereum', it will be 'Bitcoin', 'Ethereum'
        withdrawalInfoEl.textContent = `Please upload a verification document for your $${amount} withdrawal to ${providerDisplayName}.`;
    } else if (withdrawalInfoEl) {
         withdrawalInfoEl.textContent = `Please upload a verification document for your withdrawal.`;
    }

    function handleFileSelect(file) {
        errorMessageEl.textContent = '';
        if (file) {
            selectedFile = file; // Store the file object
            if (verificationImagePreview.src && verificationImagePreview.src.startsWith('blob:')) {
                URL.revokeObjectURL(verificationImagePreview.src);
            }
            const imageURL = URL.createObjectURL(file);
            verificationImagePreview.src = imageURL;
            imagePreviewArea.style.display = 'block';
            submitVerificationBtn.style.display = 'block';
        } else {
            selectedFile = null;
            verificationImagePreview.src = '#';
            imagePreviewArea.style.display = 'none';
            submitVerificationBtn.style.display = 'none';
        }
    }

    if (uploadPictureBtn && uploadPictureInput) {
        uploadPictureBtn.addEventListener('click', () => uploadPictureInput.click());
        uploadPictureInput.addEventListener('change', (event) => handleFileSelect(event.target.files[0]));
    }

    if (takePhotoBtn && takePhotoInput) {
        takePhotoBtn.addEventListener('click', () => takePhotoInput.click());
        takePhotoInput.addEventListener('change', (event) => handleFileSelect(event.target.files[0]));
    }

    if (submitVerificationBtn) {
        submitVerificationBtn.addEventListener('click', async () => {
            errorMessageEl.textContent = '';
            if (!selectedFile) {
                errorMessageEl.textContent = 'Please upload or take a picture for verification.';
                return;
            }

            if (processingOverlay) {
                const statusMessageEl = document.getElementById('withdrawal-upload-status-message');
                if(statusMessageEl) statusMessageEl.textContent = 'Uploading verification document...';
                processingOverlay.style.display = 'flex';
            }

            let providerDisplayName = provider ? (provider.charAt(0).toUpperCase() + provider.slice(1)) : 'N/A';
            if (provider && provider.toLowerCase() === 'cashapp') providerDisplayName = 'Cash App';
            
            try {
                // Attempt to upload the file using websim.upload
                const uploadedFileUrl = await websim.upload(selectedFile);
                console.log(`Verification document uploaded successfully. URL: ${uploadedFileUrl}`);
                
                // Log activity
                logActivity({
                    type: 'Withdrawal Verification Upload',
                    description: `Uploaded verification for ${providerDisplayName} withdrawal of $${amount || 'N/A'}. File: ${selectedFile.name}, URL: ${uploadedFileUrl}`
                });

                // Simulate backend processing for email notification
                console.log(`Simulating backend process: Verification document URL ${uploadedFileUrl} would be sent to ${userEmailForNotifications}.`);
                
                // Update status message for successful upload and "processing"
                if (processingOverlay) {
                    const statusMessageEl = document.getElementById('withdrawal-upload-status-message');
                    if (statusMessageEl) statusMessageEl.textContent = 'Your withdrawal is under process';
                }
                
                // Proceed to app.html after a delay
                setTimeout(() => {
                    window.location.href = 'app.html';
                }, 3500);

            } catch (error) {
                console.error('Error uploading verification document:', error);
                errorMessageEl.textContent = 'Failed to upload verification document. Please try again.';
                if (processingOverlay) {
                    processingOverlay.style.display = 'none';
                }
            }
        });
    }

    if (uploadPageBackButton) {
        uploadPageBackButton.addEventListener('click', () => {
            const currentProvider = urlParams.get('provider');
            const currentAmount = urlParams.get('amount');
            const currentTag = urlParams.get('tag');
            const returnTo = urlParams.get('returnTo');

            let backUrl;
            const params = new URLSearchParams();

            // Use returnTo parameter if available and specific
            if (returnTo === 'crypto-details.html' && currentProvider) {
                params.set('type', currentProvider); // crypto-details expects 'type'
                // Optionally, prefill details on crypto-details page if needed
                // if (currentAmount) params.set('amount', currentAmount);
                // if (currentTag) params.set('address', currentTag);
                backUrl = `crypto-details.html?${params.toString()}`;
            } else if (returnTo === 'bank-details.html' && currentProvider) {
                params.set('provider', currentProvider);
                // Optionally, prefill details on bank-details page if needed
                // if (currentAmount) params.set('amount', currentAmount);
                // if (currentTag) params.set('tag', currentTag);
                backUrl = `bank-details.html?${params.toString()}`;
            } else {
                // Fallback logic if returnTo is not specific enough or missing
                if (['paypal', 'cashapp'].includes(currentProvider?.toLowerCase())) {
                    params.set('provider', currentProvider);
                    backUrl = `bank-details.html?${params.toString()}`;
                } else if (currentProvider) { // Assume other providers are crypto
                    params.set('type', currentProvider);
                    backUrl = `crypto-details.html?${params.toString()}`;
                } else {
                    backUrl = 'withdrawal.html'; // General fallback
                }
            }
            window.location.href = backUrl;
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