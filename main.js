// TODO

// Color of brick = how many more times it has to be hit to break. Darker bricks require more hits to break
// 


// The element references have "Elem" suffixes to differentiate them from variables used in the program.
const canvasElem = document.querySelector("#game-canvas");
const ctx = canvasElem.getContext("2d");
const scoreElem = document.querySelector("#current-score");
const highScoreElem = document.querySelector("#high-score");

// Keyboard controls
// The keydown event fires when a key is first pressed, and then after a delay, continuously fires if the key 
// is held down. As a result of this delay, paddle.handleMovement() is not smooth if called directly here. 
// To solve this issue, physically moving the paddle is done every update of the game loop and the keyboard controls 
// simply change the paddle direction property. When a key is pressed, the paddle direction property is set to
// the appropriate direction until that key is lifted, at which point the paddle direction property is set back to null.
window.addEventListener("keydown", function(e) {
	switch (e.code) {
		case "KeyA":
		case "ArrowLeft":
			paddle.direction[0] = 1;
			break;
		case "KeyD":
		case "ArrowRight":
			paddle.direction[1] = 1;
			break;
	}
});

// When letting go of a direction, only set the direction to null if another direction is not
// already being pressed. This check is necessary for smooth paddle movement.
window.addEventListener("keyup", function(e) {
	switch (e.code) {
		case "KeyA":
		case "ArrowLeft":
			paddle.direction[0] = 0;
			break;
		case "KeyD":
		case "ArrowRight":
			paddle.direction[1] = 0;
			break;
	}
});

const canvas = {
	width: canvasElem.width,
	height: canvasElem.height,
	clear: function() {
		ctx.clearRect(0, 0, this.width, this.height);
	}
}

const game = {
	loop: function() {
		canvas.clear();
		paddle.draw();
		paddle.handleMovement();

		// Establish the game loop. window.requestAnimationFrame runs its callback function before
		// the browser performs the next repaint. This often happens 60 times per second, but will
		// generally match the display refresh rate in most web browsers.
		window.requestAnimationFrame(game.loop);
	}
}

const ball = {
	draw: function() {
		
	}
}


const paddle = {

	// The paddle should initially be drawn at the middle of the screen. However, fillRect treats
	// the x argument as the left edge of the paddle, so we need to subtract half of the width of
	// the paddle to center it. A getter function is used so that the width of the paddle can be
	// referred to using this.width. A getter cannot return itself and a setter cannot set a value
	// to itself because both of these cause infinite recursive calls. New properties must be created,
	// and the convention is to prepend an underscore (_) to the getter/setter name.
	get xPos() {
		// Nullish coalescing operator is used instead of OR operator to handle the case when
		// this._xPos equals 0. If the OR operator is used, the left operand evaluates to false,
		// resetting the position of the paddle to the center of the screen. This is not the
		// intended behavior.
		return this._xPos ?? (canvas.width / 2) - (this.width / 2);
	},
	set xPos(value) {
		this._xPos = value;
	},
	// width and moveSpeed values should be carefully chosen based on the value of the other, canvas.width, and
	// the starting xPos to ensure that the paddle remains perfectly confined to the canvas (play area).
	yPos: 360,
	width: 80,
	height: 16,
	moveSpeed: 5,
	// direction[0] is left direction and direction[1] is right direction. If a direction key is pressed, that
	// pressed direction is represented by a 1. If it is not pressed, it is represented by a 0. Thus,
	// [0, 0] amd [1, 1] mean no movement. [1, 0] means move left. [0, 1] means move right.
	// direction is stored in this way to deal cases in which both direction keys are being pressed.
	direction: [0, 0],
	color: "rgb(0, 190, 255)",
	draw: function() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
	},
	handleMovement: function() {
		if (this.direction[0] === 0 && this.direction[1] === 1 && this.xPos < canvas.width - this.width) {
			this.xPos += this.moveSpeed;
		} else if (this.direction[0] === 1 && this.direction[1] === 0 && this.xPos > 0) {
			this.xPos -= this.moveSpeed;
		}
	}
}

// Enter the game loop
window.requestAnimationFrame(game.loop);