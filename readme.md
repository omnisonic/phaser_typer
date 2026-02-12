# ⌨️ Phaser Typer

> **Learn to type by typing real code.** A browser-based touch typing trainer built with Phaser.js that helps you master the keyboard while reading actual JavaScript.

![Typing Game Screenshot](bg.png)

## 🎯 Why This Project?

**For Coding Students:**
- Practice typing with real JavaScript code - the same code that powers this game!
- Get comfortable with symbols you'll use daily: `{}`, `[]`, `()`, `;`, `=>`, etc.
- Build muscle memory for typing syntax without looking at the keyboard

**For Typing Learners:**
- Visual keyboard shows exactly which key to press next (highlighted in **green**)
- Finger guidance tells you which finger to use for every key
- Real-time feedback: correct keys advance the cursor, wrong keys shake the screen
- No boring drills - you're typing actual working code!

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎮 **Visual Keyboard** | On-screen keyboard shows key locations with responsive layout |
| 💚 **Target Highlight** | The next key to press glows green |
| ❤️ **Press Feedback** | Keys turn red when pressed |
| 🖐️ **Finger Guidance** | Text prompt shows which finger to use (e.g., "Next: left hand index finger") |
| 📱 **Responsive** | Adapts to different screen sizes |
| ⏸️ **Error Prevention** | Blocks browser shortcuts (Ctrl, Alt, F-keys, Tab) so you stay focused |
| 🎯 **Score Tracking** | Earn points for every correct keystroke |
| ⚡ **Shift Support** | Visual keyboard switches between lower/uppercase when Shift is held |

## 🚀 Quick Start

No installation required! This game runs entirely in your browser.

### Option 1: Open Directly (with a local server)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx serve)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Option 2: VS Code Live Server
Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension and click "Go Live".

> ⚠️ **Note:** Due to browser security (CORS), you must serve the files through a web server rather than opening `index.html` directly with `file://`.

## 🎓 How to Use

1. **Start typing** the code shown on screen
2. **Watch the green highlight** on the keyboard - that's your next key!
3. **Read the finger guidance** - it tells you exactly which finger to use
4. **Press keys correctly** to advance the cursor and earn points
5. **Complete each line**, then press **Enter** to continue
6. **Finish the entire file** to complete the exercise!

### Typing Tips for Beginners

- **Keep your fingers on the home row**: ASDF (left hand) and JKL; (right hand)
- **Look at the screen, not your hands** - the visual keyboard is your guide
- **Use the correct finger** for each key - this builds proper muscle memory
- **Don't rush** - accuracy is more important than speed when learning

## 🛠️ Tech Stack

- **[Phaser 3](https://phaser.io/)** - HTML5 game framework
- **Vanilla JavaScript** - No build tools, no bundlers, just clean JS
- **HTML5 Canvas** - Hardware-accelerated rendering

## 📁 Project Structure

```
phaser_typer/
├── index.html          # Entry point - loads Phaser and game scripts
├── practice_diagram.js # Main game logic, keyboard rendering, input handling
├── game.js             # Source file used as the typing exercise
├── bg.png              # Background image
└── readme.md           # This file!
```

## 🎮 Customization

Want to practice typing something else? Edit the `fetch()` call in `practice_diagram.js`:

```javascript
// Change this line to load any text file
fetch('game.js')  // Try 'my-code.js', 'readme.md', etc.
```

Or modify the `lines` array directly to type custom content:

```javascript
lines = [
    "function hello() {",
    "    console.log('Hello, World!');",
    "}"
];
```

## 🔮 Roadmap

- [ ] Combine keyboard map with typing exercises
- [ ] Highlight current lesson character alongside pressed key indicators
- [ ] Enhanced scoring with per-key error tracking
- [ ] Save/load score sheets with session history
- [ ] User accounts for progress tracking
- [ ] AI-generated lessons based on error patterns
- [ ] Custom topic selection for AI-tailored lessons

## 🤝 Contributing

This is an open-source project perfect for:
- **Beginners** learning JavaScript and game development
- **Students** practicing touch typing
- **Educators** teaching programming or typing skills

Feel free to fork, modify, and share your improvements!

## 📜 License

This project is open source. Use it, learn from it, and happy typing! ⌨️✨

---

> 💡 **Pro Tip:** The best way to improve your typing is consistent practice. Even 15 minutes a day will show results within weeks!
