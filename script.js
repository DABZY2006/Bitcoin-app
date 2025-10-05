import confetti from 'confetti-js';

document.addEventListener('DOMContentLoaded', () => {
    const btcPriceEl = document.getElementById('btc-price');
    const btcChangeEl = document.getElementById('btc-change');
    const usdBalanceEl = document.getElementById('usd-balance');
    const btcBalanceEl = document.getElementById('btc-balance');
    const amountInput = document.getElementById('amount-input');
    const buyBtn = document.getElementById('buy-btn');
    const sellBtn = document.getElementById('sell-btn');
    const notificationMessageEl = document.getElementById('notification-message');
    const profileNameTextEl = document.getElementById('profile-name-text'); // For displaying user's name
    
    const buySound = createSound('buy-sound.mp3');
    const sellSound = createSound('sell-sound.mp3');
    const errorSound = createSound('error-sound.mp3');

    let currentBtcPrice = 107207.90; // Updated initial Bitcoin price
    let usdBalance = 0.00; // Updated initial USD balance
    let btcBalance = 0.0000;

    // Update profile name from localStorage
    if (profileNameTextEl) {
        const registeredName = localStorage.getItem('registeredUserName');
        if (registeredName) {
            profileNameTextEl.textContent = registeredName;
            // Keep 'registeredUserName' in localStorage if persistence across refresh is desired
            // localStorage.removeItem('registeredUserName'); // Remove if name should only show once after registration
        } else {
            profileNameTextEl.textContent = 'User'; // Default if no name found
        }
    }

    // Mock price update interval
    setInterval(updateMockPrice, 3000);

    function updateMockPrice() {
        const changePercent = (Math.random() - 0.5) * 2; // Random change between -1% and 1%
        currentBtcPrice *= (1 + changePercent / 100);
        // Format price with commas and $ symbol
        btcPriceEl.textContent = currentBtcPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        btcChangeEl.textContent = `${changePercent.toFixed(2)}%`;
        if (changePercent > 0) {
            btcChangeEl.className = 'positive';
        } else if (changePercent < 0) {
            btcChangeEl.className = 'negative';
        } else {
            btcChangeEl.className = 'neutral';
        }
    }

    function updateBalances() {
        // Format USD balance with commas and $ symbol
        usdBalanceEl.textContent = usdBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        btcBalanceEl.textContent = `${btcBalance.toFixed(8)} BTC`;
    }
    
    function showNotification(message, type = 'info') {
        notificationMessageEl.textContent = message;
        notificationMessageEl.style.color = type === 'error' ? 'var(--danger-color)' : 
                                           type === 'success' ? 'var(--accent-color)' : 
                                           'var(--text-color)';
        setTimeout(() => {
            notificationMessageEl.textContent = '';
        }, 3000);
    }

    buyBtn.addEventListener('click', () => {
        const amountUSD = parseFloat(amountInput.value);
        if (isNaN(amountUSD) || amountUSD <= 0) {
            showNotification('Please enter a valid amount.', 'error');
            playSound(errorSound);
            return;
        }
        if (amountUSD > usdBalance) {
            showNotification('Insufficient USD balance.', 'error');
            playSound(errorSound);
            return;
        }

        const amountBTC = amountUSD / currentBtcPrice;
        usdBalance -= amountUSD;
        btcBalance += amountBTC;
        
        updateBalances();
        showNotification(`Successfully bought ${amountBTC.toFixed(8)} BTC!`, 'success');
        playSound(buySound);
        triggerConfetti();
    });

    sellBtn.addEventListener('click', () => {
        const amountUSDToSellFor = parseFloat(amountInput.value);
         if (isNaN(amountUSDToSellFor) || amountUSDToSellFor <= 0) {
            showNotification('Please enter a valid USD amount to target for selling.', 'error');
            playSound(errorSound);
            return;
        }

        const amountBTCToSell = amountUSDToSellFor / currentBtcPrice;

        if (amountBTCToSell > btcBalance) {
            showNotification('Insufficient BTC balance for this USD amount.', 'error');
            playSound(errorSound);
            return;
        }
        if (btcBalance <= 0) {
             showNotification('No BTC to sell.', 'error');
             playSound(errorSound);
             return;
        }
        
        usdBalance += (amountBTCToSell * currentBtcPrice); // effectively amountUSDToSellFor
        btcBalance -= amountBTCToSell;

        updateBalances();
        showNotification(`Successfully sold ${amountBTCToSell.toFixed(8)} BTC!`, 'success');
        playSound(sellSound);
    });

    function triggerConfetti() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1000';
        document.body.appendChild(canvas);

        const myConfetti = confetti.create(canvas, {
            resize: true,
            useWorker: true
        });
        myConfetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        setTimeout(() => {
            document.body.removeChild(canvas);
        }, 3000); // Remove canvas after confetti animation
    }
    
    // Web Audio API Sound Effect Functions
    let audioContext;

    function getAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    function createSound(src) {
        // Pre-create an AudioBufferSourceNode and buffer for reuse, or just load on demand
        // For simplicity here, we'll just return the src and load on playSound
        return { src: src, buffer: null }; 
    }

    async function loadSound(soundObj) {
        if (soundObj.buffer) return; // Already loaded

        const context = getAudioContext();
        if (!context) return; // Web Audio API not supported

        try {
            const response = await fetch(soundObj.src);
            const arrayBuffer = await response.arrayBuffer();
            soundObj.buffer = await context.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error(`Error loading sound ${soundObj.src}:`, error);
        }
    }
    
    // Ensure sounds are preloaded after user interaction / page load
    // Some browsers restrict audio until user interaction
    Promise.all([loadSound(buySound), loadSound(sellSound), loadSound(errorSound)]).catch(error => {
        console.warn("Could not preload all sounds initially:", error);
    });


    async function playSound(soundObj) {
        const context = getAudioContext();
        if (!context) return; // Web Audio API not supported

        if (!soundObj.buffer) {
            await loadSound(soundObj); // Try to load if not already loaded
            if (!soundObj.buffer) { // Still not loaded (e.g., network error)
                console.error(`Cannot play sound ${soundObj.src}, buffer not loaded.`);
                return;
            }
        }
        
        // Ensure context is running (especially important after user interaction)
        if (context.state === 'suspended') {
            try {
                await context.resume();
            } catch (e) {
                console.error("AudioContext resume failed:", e);
                return; // Can't play if context can't resume
            }
        }

        const source = context.createBufferSource();
        source.buffer = soundObj.buffer;
        source.connect(context.destination);
        source.start(0);
    }


    // Initialize
    updateMockPrice(); // Initial price display
    updateBalances(); // Initial balance display
});