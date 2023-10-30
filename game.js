// Global variables to manage the game state across functions.
let currentLineIndex = 0;
let lines = [];
let cursor;
let lineComplete = false; // Flag to check if the current line was completed by the user

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
});

function preload() {
    console.log("Preloading game assets if any...");
    // No game assets to load in this example, but this is where they would be included.
}

function create() {
    console.log("Creating game environment...");

    this.cameras.main.setBackgroundColor('#88F');

    // Initialize the text for the cursor. Position it where the text input begins.
    cursor = this.add.text(150, 250, '_', { fontSize: '32px', fill: '#FFF' });
    cursor.setOrigin(0.0, 0.0); // Set origin to center for more predictable positioning

    // Fetch and process the game's own script.
    fetch('game.js') // Please ensure this path points to your actual 'game.js' file.
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            lines = data.split('\n').map(line => line.trim());
            currentLineIndex = 0;

            // Set up the game scene after the script is loaded.
            this.score = 0;
            this.wordText = this.add.text(150, 250, '', { fontSize: '32px', fill: '#FFF' });
            this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });

            // Start with the first line of the script.
            this.currentWord = lines[currentLineIndex];
            this.wordText.text = this.currentWord;

            // Set up the input handler for typing.
            this.input.keyboard.on('keydown', (event) => {
                // If "Enter" is pressed, move to the next line, taking blank lines into account
                if (event.keyCode === 13) { // 13 is the keyCode for the "Enter" key
                    if (lineComplete || this.currentWord.length === 0) {
                        // Ready to move to the next line
                        lineComplete = false; // Reset for the next line

                        currentLineIndex++;
                        if (currentLineIndex >= lines.length) {
                            console.log("End of script reached!");
                            this.wordText.text = "End of script! Reload to start over.";
                        } else {
                            this.currentWord = lines[currentLineIndex];
                            this.wordText.text = this.currentWord;
                            console.log("Next line to type:", this.currentWord);
                        }
                        return; // So that we skip the rest of the function until the next key event
                    }
                }

                // Regular typing handling below
                console.log("Key pressed:", event.key);

                if (!lineComplete && event.key === this.currentWord[0]) { // Only if the line isn't completed yet
                    this.currentWord = this.currentWord.substr(1);
                    this.wordText.text = this.currentWord;

                    // If the line is finished, wait for the "Enter" key to be pressed.
                    if (this.currentWord.length === 0) {
                        lineComplete = true; // Set the flag to true when line is completed
                        console.log("Line complete! Press 'Enter' to continue.");
                    }

                    // Update the score as the user types.
                    this.score += 10;
                    this.scoreText.text = 'score: ' + this.score;
                    console.log("Current score:", this.score);
                }
            });
        })
        .catch((error) => {
            console.error('Error during fetch:', error);
        });
}

function update() {
    // This function is called continuously throughout the game.
    // Simple blinking effect. The cursor will toggle visibility every half-second.
    if (Math.floor(this.time.now / 500) % 2) {
        cursor.setVisible(true); // Show the cursor
    } else {
        cursor.setVisible(false); // Hide the cursor
    }
    // The logic is handled within the event callbacks in create, so no need to continuously update anything else here.
}

// This full script sets up your Phaser game, fetches the script, and uses it as the basis for the typing game.
// Remember to serve your HTML file through a server environment rather than opening it directly in a browser with a "file://" URL due to CORS policy.
