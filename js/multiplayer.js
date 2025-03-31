class MultiplayerManager {
    constructor() {
        this.roomCode = null;
        this.playerName = null;
        this.isHost = false;
        this.players = [];
        this.gameState = 'waiting'; // waiting, countdown, playing, finished
        
        // DOM elements
        this.createRoomBtn = document.getElementById('create-room-btn');
        this.joinRoomBtn = document.getElementById('join-room-btn');
        this.createRoomSection = document.getElementById('create-room-section');
        this.joinRoomSection = document.getElementById('join-room-section');
        this.createRoomSubmit = document.getElementById('create-room-submit');
        this.joinRoomSubmit = document.getElementById('join-room-submit');
        this.waitingRoom = document.getElementById('waiting-room');
        this.displayRoomCode = document.getElementById('display-room-code');
        this.playersList = document.getElementById('players-list');
        this.startMultiplayerGame = document.getElementById('start-multiplayer-game');
        this.multiplayerModal = document.getElementById('multiplayer-modal');
        
        this.bindEventListeners();
    }
    
    bindEventListeners() {
        // Create room button
        this.createRoomBtn.addEventListener('click', () => {
            this.createRoomSection.classList.remove('hidden');
            this.joinRoomSection.classList.add('hidden');
        });
        
        // Join room button
        this.joinRoomBtn.addEventListener('click', () => {
            this.joinRoomSection.classList.remove('hidden');
            this.createRoomSection.classList.add('hidden');
        });
        
        // Create room submit
        this.createRoomSubmit.addEventListener('click', () => {
            const roomName = document.getElementById('room-name').value;
            const maxPlayers = document.getElementById('max-players').value;
            
            if (!roomName) {
                alert('Please enter a room name');
                return;
            }
            
            this.createRoom(roomName, maxPlayers);
        });
        
        // Join room submit
        this.joinRoomSubmit.addEventListener('click', () => {
            const roomCode = document.getElementById('room-code').value;
            
            if (!roomCode) {
                alert('Please enter a room code');
                return;
            }
            
            this.joinRoom(roomCode);
        });
        
        // Start game button
        this.startMultiplayerGame.addEventListener('click', () => {
            if (this.isHost) {
                this.startGame();
            }
        });
        
        // Open multiplayer modal
        document.getElementById('multiplayer-btn').addEventListener('click', () => {
            this.openMultiplayerModal();
        });
        
        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                modal.classList.add('hidden');
            });
        });
    }
    
    openMultiplayerModal() {
        this.multiplayerModal.classList.remove('hidden');
        
        // Reset UI state
        this.createRoomSection.classList.add('hidden');
        this.joinRoomSection.classList.add('hidden');
        this.waitingRoom.classList.add('hidden');
    }
    
    createRoom(roomName, maxPlayers) {
        // In a real implementation, this would make an API call to create a room
        // For this demo, we'll simulate it locally
        
        // Generate a random 4-character room code
        this.roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.isHost = true;
        
        // Set player name (in a real app, you'd prompt for this)
        this.playerName = 'Host';
        
        // Initialize players array with host
        this.players = [
            { id: 1, name: this.playerName, isHost: true, isReady: true }
        ];
        
        // Show waiting room
        this.createRoomSection.classList.add('hidden');
        this.waitingRoom.classList.remove('hidden');
        this.displayRoomCode.textContent = this.roomCode;
        
        // Enable start button for host
        this.startMultiplayerGame.disabled = false;
        
        // Update players list
        this.updatePlayersList();
        
        // In a real implementation, you would set up WebSocket connection here
        
        // For demo purposes, add some fake players after a delay
        this.addFakePlayers();
    }
    
    joinRoom(roomCode) {
        // In a real implementation, this would make an API call to join a room
        // For this demo, we'll simulate it locally
        
        // Set room code
        this.roomCode = roomCode;
        this.isHost = false;
        
        // Set player name (in a real app, you'd prompt for this)
        this.playerName = 'Player ' + Math.floor(Math.random() * 1000);
        
        // Initialize players array with some fake data
        this.players = [
            { id: 1, name: 'Host', isHost: true, isReady: true },
            { id: 2, name: this.playerName, isHost: false, isReady: true }
        ];
        
        // Add some more fake players
        if (Math.random() > 0.5) {
            this.players.push({ id: 3, name: 'Player 123', isHost: false, isReady: Math.random() > 0.5 });
        }
        
        // Show waiting room
        this.joinRoomSection.classList.add('hidden');
        this.waitingRoom.classList.remove('hidden');
        this.displayRoomCode.textContent = this.roomCode;
        
        // Disable start button for non-host
        this.startMultiplayerGame.disabled = true;
        
        // Update players list
        this.updatePlayersList();
        
        // In a real implementation, you would set up WebSocket connection here
    }
    
    addFakePlayers() {
        // For demo purposes only
        setTimeout(() => {
            if (Math.random() > 0.3 && this.players.length < 5) {
                const newPlayer = {
                    id: this.players.length + 1,
                    name: 'Player ' + Math.floor(Math.random() * 1000),
                    isHost: false,
                    isReady: Math.random() > 0.3
                };
                
                this.players.push(newPlayer);
                this.updatePlayersList();
                
                // Maybe add another player later
                this.addFakePlayers();
            }
        }, 2000 + Math.random() * 3000);
    }
    
    updatePlayersList() {
        this.playersList.innerHTML = '';
        
        this.players.forEach(player => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';
            
            playerItem.innerHTML = `
                <div class="player-status ${player.isReady ? 'ready' : 'waiting'}"></div>
                <div class="player-name">${player.name}${player.isHost ? ' (Host)' : ''}</div>
                <div class="player-status-text">${player.isReady ? 'Ready' : 'Waiting...'}</div>
            `;
            
            this.playersList.appendChild(playerItem);
        });
    }
    
    startGame() {
        // Check if enough players are ready
        const readyPlayers = this.players.filter(player => player.isReady);
        
        if (readyPlayers.length < 2) {
            alert('Need at least 2 ready players to start');
            return;
        }
        
        // In a real implementation, this would notify all players via WebSocket
        // For this demo, we'll just close the modal and start a normal game
        
        this.multiplayerModal.classList.add('hidden');
        
        // Start the typing test
        const typingTest = new TypingTest();
        typingTest.startTest();
        
        // In a real implementation, you would:
        // 1. Send the same text to all players
        // 2. Start a countdown
        // 3. Track progress of all players in real-time
        // 4. Show a live leaderboard
        // 5. Determine the winner
    }
}

// Initialize multiplayer manager
const multiplayerManager = new MultiplayerManager();
