    const keyToFingerMapping = {
        ' ': 'right thumb',
        'shiftleft': 'left hand pinky',
        'shiftright': 'right hand pinky',
        'enter': 'right hand pinky',
        '1': 'left hand pinky',
        '2': 'left hand ring finger',
        '3': 'left hand middle finger',
        '4': 'left hand index finger',
        '5': 'left hand index finger',
        '6': 'right hand index finger',
        '7': 'right hand index finger',
        '8': 'right hand middle finger',
        '9': 'right hand ring finger',
        '0': 'right hand pinky',
        'q': 'left hand pinky',
        'w': 'left hand ring finger',
        'e': 'left hand middle finger',
        'r': 'left hand index finger',
        't': 'left hand index finger',
        'y': 'right hand index finger',
        'u': 'right hand index finger',
        'i': 'right hand middle finger',
        'o': 'right hand ring finger',
        'p': 'right hand pinky',
        'a': 'left hand pinky',
        's': 'left hand ring finger',
        'd': 'left hand middle finger',
        'f': 'left hand index finger',
        'g': 'left hand index finger',
        'h': 'right hand index finger',
        'j': 'right hand index finger',
        'k': 'right hand middle finger',
        'l': 'right hand ring finger',
        ';': 'right hand pinky',
        'z': 'left hand pinky',
        'x': 'left hand ring finger',
        'c': 'left hand middle finger',
        'v': 'left hand index finger',
        'b': 'left hand index finger',
        'n': 'right hand index finger',
        'm': 'right hand index finger',
        ',': 'right hand middle finger',
        '.': 'right hand ring finger',
        '/': 'right hand pinky',
        // Add the shift characters and other special characters
            '+': 'right hand pinky', // same as '='
    '~': 'left hand pinky', // same as '`'
    '!': 'left hand pinky', // same as '1'
    '@': 'left hand ring finger', // same as '2'
    '#': 'left hand middle finger', // same as '3'
    '$': 'left hand index finger', // same as '4'
    '%': 'left hand index finger', // same as '5'
    '^': 'right hand index finger', // same as '6'
    '&': 'right hand index finger', // same as '7'
    '*': 'right hand middle finger', // same as '8'
    '(': 'right hand ring finger', // same as '9'
    ')': 'right hand pinky', // same as '0'
    '_': 'right hand pinky', // same as '-'
            '{': 'right hand pinky', // same as '['
    '}': 'right hand pinky', // same as ']'
    '|': 'right hand pinky', // same as '\\'
    '<': 'right hand middle finger', // same as ','
    '>': 'right hand ring finger', // same as '.'
    '?': 'right hand pinky', // same as '/'
    ':': 'right hand ring finger', // same as ';'
    '"': 'right hand pinky', // same as '\''

// ... etc.
    };


// BLOCK BROWSER SHORTCUTS - Selective approach
// Handle Firefox Quick Find keys (/ and ') inside Phaser's keyboard handler instead
document.addEventListener('keydown', (event) => {
    // Block function keys (F1-F12)
    if (event.key.startsWith('F') && event.key.length > 1) {
        event.preventDefault();
    }
    // Block Ctrl/Cmd combinations
    else if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
    }
    // Block Alt key
    else if (event.altKey) {
        event.preventDefault();
    }
    // Block Tab
    else if (event.key === 'Tab') {
        event.preventDefault();
    }
}, false);


    // You can access the data like this:
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    sound: {
        gamepad: false,  
        keyboard: false
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};




let game = new Phaser.Game(config);

const regularLayout = [
    '` 1 2 3 4 5 6 7 8 9 0 - =',
    'q w e r t y u i o p [ ] \\',
    'a s d f g h j k l ; \' Enter',
    'Shift z x c v b n m , . / Shift',
    'Space'
];

const shiftLayout = [
    '~ ! @ # $ % ^ & * ( ) _ +',
    'Q W E R T Y U I O P { } |',
    'A S D F G H J K L : " Enter',
    'Shift Z X C V B N M < > ? Shift',
    'Space'
];

let keysPressed = {};
let currentLayoutTextObjects = [];
let isShiftDown = false;
let currentLineIndex = 0;
let lines = [];
let cursor;
let lineComplete = false; // Flag to check if the current line was completed by the user
let targetKeyHighlight = null; // For highlighting the next key to type
let errorShakeTimer = null; // For error feedback


function preload() {
    this.load.image('background', 'bg.png');
    // this.load.audio('myAudio', 'soundtrack.mp3');
}

function create() {
    // Prevent browser shortcuts including Firefox Quick Find keys (/ and ')
    this.input.keyboard.on('keydown', (event) => {
        // Prevent Firefox Quick Find on '/' and ''' keys
        if (event.key === '/' || event.key === "'") {
            event.preventDefault();
        }
        // Prevent Cmd/Ctrl + key combinations
        else if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            return;
        }
        // Prevent browser shortcuts
        else if (event.key === 'r' || event.key === 'R') {
            event.preventDefault();
        }
        // Prevent tab from leaving the game
        else if (event.key === 'Tab') {
            event.preventDefault();
        }
    });

    // music = this.sound.add('myAudio', { loop: true });

    // Event listener for the external button
    // document.getElementById('toggleAudio').addEventListener('click', function() {
    //     if (music.isPlaying) {
    //         music.pause();
    //     } else {
    //         music.resume();
    //     }
    // });
    let image = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
    image.setDisplaySize(this.scale.width, this.scale.height);
    image.setTint(0x333333); // Darken the image
    
    console.log("Creating game environment...");
    
    // Initialize the text for the cursor. Position it where the text input begins.
    const cursorFontSize = Math.min(64, Math.max(32, this.scale.width / 25));
    cursor = this.add.text(this.scale.width / 2, 120, '_', { fontSize: `${cursorFontSize}px`, fill: '#FFF' });
    cursor.setOrigin(0.5, 0); // Center horizontally, top align

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
            
            // Calculate font size based on screen width
            const textFontSize = Math.min(64, Math.max(32, this.scale.width / 25));
            this.wordText = this.add.text(this.scale.width / 2, 120, '', { 
                fontSize: `${textFontSize}px`, 
                fill: '#FFF',
                wordWrap: { width: this.scale.width - 100 }
            }).setOrigin(0.5, 0);
            this.scoreText = this.add.text(32, 32, 'Score: 0', { fontSize: '48px', fill: '#FFF' });

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
                            updateTargetKey(this);
                        } else {
                            this.currentWord = lines[currentLineIndex];
                            this.wordText.text = this.currentWord;
                            console.log("Next line to type:", this.currentWord);
                            updateTargetKey(this);
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
                    
                    // Update target key highlight and finger guidance
                    updateTargetKey(this);
                } else if (!lineComplete && event.key.length === 1 && event.key !== this.currentWord[0]) {
                    // Wrong key pressed - show error feedback
                    showErrorFeedback(this);
                }
            });
            
            // Initialize target key highlight
            updateTargetKey(this);
        })
        .catch((error) => {
            console.error('Error during fetch:', error);
        });

    this.keysText = {};

    drawKeyboard(regularLayout, this);

    this.fingerText = this.add.text(this.scale.width / 2, 380, '', { font: 'bold 36px Arial', fill: '#00ff00' }).setOrigin(0.5);
    this.errorText = this.add.text(this.scale.width / 2, 80, '', { font: 'bold 72px Arial', fill: '#ff0000' }).setOrigin(0.5);

    this.input.keyboard.on('keydown', (event) => {
        let key = getRepresentativeCharacter(event);
        if (isShiftDown && key.length === 1) {
            key = key.toUpperCase();
        }

        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
            isShiftDown = true;
            drawKeyboard(shiftLayout, this);
            updateTargetKey(this);  // Re-highlight the target key in the new layout
        } else {
            highlightKey(key, this, true);
            keysPressed[key] = true;
            updateKeyVisuals();
        }
    });

    this.input.keyboard.on('keyup', (event) => {
        let key = getRepresentativeCharacter(event);

        if (isShiftDown && key.length === 1) {
            key = key.toUpperCase();
        }

        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
            isShiftDown = false;
            drawKeyboard(regularLayout, this);
            updateTargetKey(this);  // Re-highlight the target key in the new layout
        } else {
            highlightKey(key, this, false);
            keysPressed[key] = false;
            updateKeyVisuals();
        }
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
    
    // Update cursor position every frame to keep it aligned with the current letter
    updateCursorPosition(this);
}

function updateCursorPosition(scene) {
    if (cursor && scene.wordText) {
        // Position cursor at the left edge of the text (where the current letter is)
        cursor.x = scene.wordText.x - scene.wordText.width / 2;
        cursor.y = scene.wordText.y;
    }
}


function drawKeyboard(layout, scene) {
    currentLayoutTextObjects.forEach(textObject => textObject.destroy());
    currentLayoutTextObjects = [];
    scene.keysText = {}; // Clear keysText to remove references to destroyed objects
    targetKeyHighlight = null; // Reset target highlight since all key objects are destroyed

    const scale = Math.min(scene.scale.width / 1200, 1.5);
    const baseKeyWidth = 50 * scale;
    const keySpacing = 8 * scale; // Space between keys
    
    // Calculate the total width of each row to find the widest
    let maxRowWidth = 0;
    const rowWidths = [];
    
    layout.forEach((row) => {
        const keys = row.split(' ');
        let rowWidth = 0;
        keys.forEach((key, index) => {
            // Wider keys for special keys
            const keyWidth = (key === 'Shift' || key === 'Enter' || key === 'Space') ? baseKeyWidth * 2.5 : baseKeyWidth;
            rowWidth += keyWidth;
            if (index < keys.length - 1) {
                rowWidth += keySpacing;
            }
        });
        rowWidths.push(rowWidth);
        if (rowWidth > maxRowWidth) {
            maxRowWidth = rowWidth;
        }
    });
    
    let yPos = scene.scale.height - 280;

    layout.forEach((row, rowIndex) => {
        const keys = row.split(' ');
        // Center each row based on its width relative to the widest row
        let xPos = (scene.scale.width - rowWidths[rowIndex]) / 2;

        keys.forEach((key) => {
            const keyWidth = (key === 'Shift' || key === 'Enter' || key === 'Space') ? baseKeyWidth * 2.5 : baseKeyWidth;
            const keyText = scene.add.text(xPos, yPos, key, { font: `${Math.floor(24 * scale)}px Arial`, fill: '#ffffff' });
            scene.keysText[key] = keyText;
            currentLayoutTextObjects.push(keyText);
            xPos += keyWidth + keySpacing;
        });

        yPos += baseKeyWidth + 10;
    });

    updateKeyVisuals();
}

function updateKeyVisuals() {
    for (let textObject of currentLayoutTextObjects) {
        if (keysPressed[textObject.text.toLowerCase()] || keysPressed[textObject.text.toUpperCase()]) {
            textObject.setFill('#ff0000');
        } else {
            textObject.setFill('#ffffff');
        }
    }
}

function highlightKey(key, scene, isKeyDown) {
    let fingerKey = key.toLowerCase(); // Ensure we're using the lowercase key for finger mapping

    // Handle special keys that might not be in keysText directly
    if (!scene.keysText[key]) {
        return;
    }
    
    // Check if we have a mapping for this key (including special keys)
    if (!keyToFingerMapping[fingerKey] && !keyToFingerMapping[key]) {
        return;
    }

    if (isKeyDown) {
        const finger = keyToFingerMapping[fingerKey] || keyToFingerMapping[key];
        console.log("Key:", key, "Finger:", finger);
        scene.keysText[key].setStyle({ fill: '#ff0000' });
    }
}

function findersOn(key, scene, isKeyDown) {
    let fingerKey = key.toLowerCase();
    
    if (isKeyDown && keyToFingerMapping[fingerKey]) {
        const fingerUsed = keyToFingerMapping[fingerKey] || 'unknown';
        scene.fingerText.setText('Use: ' + fingerUsed);
    } else {
        scene.fingerText.setText('');
    }
}

function getRepresentativeCharacter(event) {
    if (event.key.length === 1) {
        return event.key.toLowerCase();
    } else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        return event.code;  // Return the code for shift keys
    } else if (event.code === 'Enter') {
        return 'Enter';  // Return 'Enter' for the Enter key
    }
    return '';
}

function updateTargetKey(scene) {
    // Clear previous highlight - only if the object is still valid/active
    if (targetKeyHighlight && targetKeyHighlight.keyText && targetKeyHighlight.keyText.active) {
        targetKeyHighlight.keyText.setStyle({ fill: '#ffffff' });
    }
    
    if (!scene.currentWord || scene.currentWord.length === 0) {
        scene.fingerText.setText(lineComplete ? "Press ENTER to continue" : "");
        return;
    }
    
    const nextChar = scene.currentWord[0];
    const keyObj = scene.keysText[nextChar];
    
    // Always highlight the key on the keyboard if it's visible and active
    if (keyObj && keyObj.active) {
        keyObj.setStyle({ fill: '#00ff00' });
        targetKeyHighlight = { keyText: keyObj, char: nextChar };
    }
    
    // Always show finger guidance based on keyToFingerMapping, regardless of whether key is visible
    const finger = keyToFingerMapping[nextChar.toLowerCase()];
    if (finger) {
        scene.fingerText.setText('Next: ' + finger);
    } else {
        scene.fingerText.setText('');
    }
    
    // Update cursor position to match word text
    if (cursor && scene.wordText) {
        cursor.x = scene.wordText.x - scene.wordText.width / 2;
        cursor.y = scene.wordText.y;
    }
}

function showErrorFeedback(scene) {
    // Show red "X" briefly
    scene.errorText.setText('✗');
    
    // Shake the word text (keep it centered)
    const originalX = scene.scale.width / 2;
    scene.wordText.x = originalX + 5;
    if (cursor) cursor.x = scene.wordText.x - scene.wordText.width / 2;
    
    setTimeout(() => { 
        scene.wordText.x = originalX - 5; 
        if (cursor) cursor.x = scene.wordText.x - scene.wordText.width / 2;
    }, 50);
    setTimeout(() => { 
        scene.wordText.x = originalX + 5; 
        if (cursor) cursor.x = scene.wordText.x - scene.wordText.width / 2;
    }, 100);
    setTimeout(() => { 
        scene.wordText.x = originalX; 
        if (cursor) cursor.x = scene.wordText.x - scene.wordText.width / 2;
    }, 150);
    
    // Clear error after 500ms
    if (errorShakeTimer) clearTimeout(errorShakeTimer);
    errorShakeTimer = setTimeout(() => {
        scene.errorText.setText('');
    }, 500);
}
