document.addEventListener('DOMContentLoaded', function() {
    // Initialize typing test
    const typingTest = new TypingTest();
    
    // Settings modal
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsModal = document.getElementById('settings-modal');
    
    settingsToggle.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });
    
    // Profile modal
    const profileToggle = document.getElementById('profile-toggle');
    const profileModal = document.getElementById('profile-modal');
    
    profileToggle.addEventListener('click', () => {
        profileModal.classList.remove('hidden');
        typingTest.updateProfileStats();
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
    
    // Theme selection
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            
            // Remove active class from all theme buttons
            themeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to selected button
            button.classList.add('active');
            
            // Apply theme
            document.body.className = `theme-${theme}`;
            
            // Save preference
            localStorage.setItem('theme', theme);
        });
    });
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'default';
    document.body.className = `theme-${savedTheme}`;
    
    // Update active theme button
    document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`)?.classList.add('active');
    
    // Custom word list
    const saveWordListBtn = document.getElementById('save-word-list');
    const customWordListTextarea = document.getElementById('custom-word-list');
    
    saveWordListBtn.addEventListener('click', () => {
        const wordListText = customWordListTextarea.value.trim();
        
        if (!wordListText) {
            alert('Please enter some words');
            return;
        }
        
        // Split by spaces, commas, or new lines
        const words = wordListText.split(/[\s,\n]+/).filter(word => word.length > 0);
        
        if (words.length < 5) {
            alert('Please enter at least 5 words');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('customWordList', JSON.stringify(words));
        
        alert('Custom word list saved!');
    });
    
    // Load custom word list if available
    const savedWordList = localStorage.getItem('customWordList');
    if (savedWordList) {
        customWordListTextarea.value = JSON.parse(savedWordList).join('\n');
    }
    
    // Sound effects
    const soundToggle = document.getElementById('sound-toggle');
    const volumeSlider = document.getElementById('volume-slider');
    
    // Load sound preferences
    soundToggle.checked = localStorage.getItem('soundEnabled') !== 'false';
    volumeSlider.value = localStorage.getItem('soundVolume') || 50;
    
    // Save sound preferences
    soundToggle.addEventListener('change', () => {
        localStorage.setItem('soundEnabled', soundToggle.checked);
    });
    
    volumeSlider.addEventListener('change', () => {
        localStorage.setItem('soundVolume', volumeSlider.value);
    });
});
