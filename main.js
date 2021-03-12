// TODO

// look for more appealing hues of bricks
// Fix lives panel update
// Redundant comments occur over every instance of a design pattern. Rewrite these comments to appear once ath
// the beginning of the program or only the first time a design pattern occurs.

// The element references have "Elem" suffixes to differentiate them from variables used in the program.
const canvasElem = document.querySelector("#game-canvas");
const ctx = canvasElem.getContext("2d");
// canvas variables suffixed with a 2 are related to the display on the bottom right corner of the
// canvas container showing how many balls (lives) the player has left.
const canvasElem2 = document.querySelector("#lives-canvas");
const ctx2 = canvasElem2.getContext("2d");
const scoreElem = document.querySelector("#current-score");
const highScoreElem = document.querySelector("#high-score");

const canvas = {
	width: canvasElem.width,
	height: canvasElem.height,
	clear: function() {
		ctx.clearRect(0, 0, this.width, this.height);
	}
}

// Display panel that shows lives remaining.
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
	displayLives: function() {
		// The lives display panel will show ball icons based on how many lives the player has left.
		// It will display one fewer ball than the player has lives because the current ball in play
		// represents one life.
		for (i = 0; i < game.lives - 1; i++) {
			this.drawBallIcon();
			this.xPosBall -= 25;
		}
	},

	clear: function() {
		ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
	},

	// Draw an icon that visually matches the ball. These icons are used to represent lives remaining.
	drawBallIcon: function() {
		ctx2.fillStyle = ball.color;
		ctx2.beginPath();
		
		ctx2.arc(this.xPosBall, this.yPosBall, ball.size, 0, 2 * Math.PI);
		ctx2.fill();
	}
}

const game = {
	// preStart is true when the game first loads, a life is lost, or when the game is reset.
	// In this state, the player will be able to move the paddle with the ball on it.
	// When the paddle and ball are in the desired position, the player may start the game
	// by pressing the Space button, which will send the ball bouncing.
	preStart: true,
	lives: 3, // 5 is the maximum number of lives that a player can accumulate.
	startListener: function(e) {
		if (e.code === "Space") {
			game.start();
		}
	},

	// start refers to putting the current ball in play. If all lives are lost, the user will have
	// the opportunity to reset the game and play again.
	start: function() {
		this.preStart = false;
		window.removeEventListener("keydown", game.startListener);

		// EXTREMELY SIMPLE IMPLEMENTATION OF BALL MOVEMENT
		// CHANGE LATER. Current values are just to test if collision detection is working properly.
		ball.xVel = ball.speed;
		ball.yVel = ball.speed;
	},

	loop: function() {
		canvas.clear();
		paddle.handleMovement();
		paddle.draw();
		ball.move();
		ball.draw();

		// Establish the game loop. window.requestAnimationFrame runs its callback function before
		// the browser performs the next repaint. This often happens 60 times per second, but will
		// generally match the display refresh rate in most web browsers.
		window.requestAnimationFrame(game.loop);
	},
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
	yPos: 368,
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
			// If the game is in the pre-start state, the ball's movement follows the paddle's movement.
			// This makes it appear as though the ball is stuck to the center of the paddle.
			if (game.preStart) {
				ball.xPos += this.moveSpeed;
			}
		} else if (this.direction[0] === 1 && this.direction[1] === 0 && this.xPos > 0) {
			this.xPos -= this.moveSpeed;
			if (game.preStart) {
				ball.xPos -= this.moveSpeed;
			}
		}
	}
}

const ball = {
	xPos: canvas.width / 2,
	// Getter method is used for ball's yPos since its initial position is related to its size, and
	// the size needs to be referred to with the this keyword.
	get yPos() {
		// Nullish coalescing operator is used instead of OR operator to handle the case when
		// this._yPos equals 0. If the OR operator is used, the left operand evaluates to false,
		// resetting the y position of the ball to the bottom of the screen. This is not the
		// intended behavior.
		return this._yPos ?? canvas.height - (paddle.height * 2) - this.size;
	},
	// Since yPos is accessed with a getter method, a setter method is necessary to change its value
	set yPos(value) {
		this._yPos = value;
	},
	xVel: 0,
	yVel: 0,
	size: 8,
	speed: 10,
	color: "rgb(0, 0, 255)",
	draw: function() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		// 2 * pi radians is equal to 360 degrees. This draws a full circle. The values of the first and second
		// arguments are chosen to ensure that the ball is drawn sitting just on top of the middle of the paddle.
		ctx.arc(this.xPos, this.yPos, this.size, 0, 2 * Math.PI);
		ctx.fill();
	},
	move: function() {
		ctx.arc(this.xPos += this.xVel, this.yPos -= this.yVel, this.size, 0, 2 * Math.PI);
		this.detectCollision();
	},
	detectCollision: function() {
		// Detect collision with left and right walls
		if (this.xPos <= 0 + this.size || this.xPos >= canvas.width - this.size) {
			this.xVel = -(this.xVel);
		}
		// Detect collision with top wall
		if (this.yPos <= 0 + this.size) {
			this.yVel = -(this.yVel);
		// Detect collision with an "imaginary" plane below the bottom of the canvas. If the ball ever collides with this plane,
		// a life is lost and the game reenters the preStart state in which the ball sits atop the paddle waiting to be 
		// launched again.

		// Maybe explain reason why this is better than detecting collision with the actual bottom of the screen.
		// Also, tweak value.
		} else if (this.yPos >= canvas.height + 100 && !game.preStart) {
			console.log("Dead");
			
			// Refactor the following into RESET HANDLER FUNCTION
			game.lives -= 1;
			canvas2.clear();
			canvas2.displayLives();
			// Spawn a new ball on top of the center of the paddle.
			ball.xPos = paddle.xPos + paddle.width / 2;
			ball.yPos = canvas.height - (paddle.height * 2) - this.size;
			ball.xVel = 0;
			ball.yVel = 0;
			game.preStart = true;
			window.addEventListener("keydown", game.startListener);
		}
	}
}

const Brick = function(xPos, yPos, hitsLeft) {
	this.xPos = null;
	this.yPos = null;
	this.width = 60;
	this.height = 10;
	this.hitsLeft = hitsLeft;
	// The shade of the brick signifies how many hits are required to break it. Darker bricks require more 
	// hits to break.
	switch (this.hitsLeft) {
		case 1:
			this.color = "rgb(0, 255, 0)";
			break;
		case 2:
			this.color = "rgb(0, 192, 0)";
			break;
		case 3:
			this.color = "rgb(0, 128, 0)";
			break;
	}

	this.draw();
}

Brick.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
};

for (let i = 0; i < 5; i++) {
	const brick = new Brick(this.width + i, 100, 2);
}

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

// Enter the game loop
window.requestAnimationFrame(game.loop);

// This listener puts the ball in play. When the ball is launched, this listener is removed.
// It is again added when a life is lost and the next ball is ready to be launched, or when
// the game is reset, and a new game begins.
window.addEventListener("keydown", game.startListener);

// inside some init function
canvas2.displayLives();