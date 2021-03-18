// Update imports once other objects have been turned into their own modules
import { game } from "./app.js";
import ball from "./ball.js";

// canvas variables suffixed with a 2 are related to the display on the bottom right corner of the
// canvas container showing how many extra balls (lives) the player has left.
const canvasElem2 = document.querySelector("#lives-canvas");
const ctx2 = canvasElem2.getContext("2d");

// Display panel that shows how many extra lives remain.
const canvas2 = {
	width: canvasElem2.width,
	height: canvasElem2.height,
	// getter function is used so that the ball icon's x position can be assigned in relation to the 
	// width of canvas2 using the this keyword. An extra 1 pixel offset is subtracted to maintain the 
	// roundness of the right part of the ball icon.
	get xPosBall() {
		return this._xPosBall || this.width - ball.size - 1;
	},
	// Since xPosBall is accessed with a getter function, a setter is necessary to change its value.
	set xPosBall(value) {
		this._xPosBall = value;
	},
	// Vertically center ball icons. A getter is used so the ball's y position can be assigned in relation to
	// the height of canvas2 using the this keyword.
	get yPosBall() {
		return this.height / 2;
	},

	// Show how many extra lives the player has remaining.
	displayLives: function() {
		// The lives display panel will show ball icons based on how many extra lives the player has left.
		// It will display one fewer ball than the player has lives because the current ball in play
		// represents one life.
		for (let i = 0; i < game.lives - 1; i++) {
			this.drawBallIcon();
			this.xPosBall -= 25;
		}
		// Reset canvas2.xPosBall's value to the initial position at the right of the panel. If this step
		// is neglected, then the next time canvas2.displayLives() is called, the remaining ball icons will
		// be drawn starting from the left of the most recently drawn ball icon. The remaining ball icons
		// should always be drawn starting from the far right of the panel.
		this.xPosBall = this.width - ball.size - 1;
	},

	// Clear the lives canvas. This is done after losing or gaining a life and before calling canvas2.displayLives(),
	// to update the display.
	clear: function() {
		ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
	},

	// Draw an icon that visually matches the ball. These icons are used to represent extra lives remaining.
	drawBallIcon: function() {
		ctx2.fillStyle = ball.color;
		ctx2.beginPath();
		
		ctx2.arc(this.xPosBall, this.yPosBall, ball.size, 0, 2 * Math.PI);
		ctx2.fill();
	}
}

export default canvas2;