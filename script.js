var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

// script.js
const puzzleGame = {
    init() {
        // Test image loading first
        this.pieces = Array.from({length: 15}, (_, i) => ({
            id: i,
            src: `./puzzle/${i + 1}.png` // Add ./ to ensure relative path from root
        }));

        // Verify images exist before creating board
        this.verifyImages().then(success => {
            if (success) {
                this.createBoard();
                this.setupEventListeners();
            } else {
                this.handleImageError();
            }
        });
    },

    async verifyImages() {
        const promises = this.pieces.map(piece => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = piece.src;
            });
        });

        const results = await Promise.all(promises);
        return results.every(result => result);
    },

    handleImageError() {
        const board = document.querySelector('.puzzle-board');
        board.innerHTML = '<div class="error-message">Error loading puzzle images. Please check image paths.</div>';
        console.error('Failed to load puzzle images. Check if images exist in puzzle/ directory');
    },

    createBoard() {
        const board = document.querySelector('.puzzle-board');
        const container = document.querySelector('.pieces-container');
        
        board.innerHTML = '';
        container.innerHTML = '';

        // Create slots
        for (let i = 0; i < 15; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.index = i;
            board.appendChild(slot);
        }

        // Create pieces with error handling
        const shuffledPieces = [...this.pieces].sort(() => Math.random() - 0.5);
        shuffledPieces.forEach(piece => {
            const img = document.createElement('img');
            img.src = piece.src;
            img.className = 'puzzle-piece';
            img.draggable = true;
            img.dataset.id = piece.id;
            img.onerror = () => this.handleImageError();
            container.appendChild(img);
        });
    },

    setupEventListeners() {
        const pieces = document.querySelectorAll('.puzzle-piece');
        const slots = document.querySelectorAll('.puzzle-slot');
        const startButton = document.getElementById('startGame');

        pieces.forEach(piece => {
            piece.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
            });
        });

        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => e.preventDefault());
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                const pieceId = parseInt(e.dataTransfer.getData('text/plain'));
                const slotIndex = parseInt(slot.dataset.index);

                if (pieceId === slotIndex) {
                    const piece = document.querySelector(`[data-id="${pieceId}"]`);
                    slot.appendChild(piece);
                    piece.draggable = false;
                    this.checkWin();
                }
            });
        });

        startButton.addEventListener('click', () => {
            this.startTimer();
            startButton.disabled = true;
        });
    },

    startTimer() {
        this.startTime = new Date();
        this.timerInterval = setInterval(() => {
            const now = new Date();
            const diff = Math.floor((now - this.startTime) / 1000);
            const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
            const seconds = (diff % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        }, 1000);
    },

    checkWin() {
        const placedPieces = document.querySelectorAll('.puzzle-slot .puzzle-piece');
        if (placedPieces.length === this.pieces.length) {
            clearInterval(this.timerInterval);
            alert('Congratulations! Puzzle completed!');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    puzzleGame.init();
});


        function toggleTheme() {
            document.body.dataset.theme = document.body.dataset.theme === 'dark' ? '' : 'dark';
            localStorage.setItem('theme', document.body.dataset.theme);
        }

        // Load saved theme
        document.body.dataset.theme = localStorage.getItem('theme') || '';
