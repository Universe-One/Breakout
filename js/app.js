// TODO

// look for more appealing hues of bricks
// Fix lives panel update
// Redundant comments occur over every instance of a design pattern. Rewrite these comments to appear once ath
// the beginning of the program or only the first time a design pattern occurs.
// Confine lives from 0/1-5 and update lives panel to reflect that

import canvas, { ctx } from "./canvas.js";
import canvas2 from "./canvas2.js";

const scoreElem = document.querySelector("#current-score");
const highScoreElem = document.querySelector("#high-score");
const levelElem = document.querySelector("#level");

const game = {
	// preStart is true when the game first loads, a life is lost, or when the game is reset.
	// In this state, the player will be able to move the paddle with the ball on it.
	// When the paddle and ball are in the desired position, the player may start the game
	// by pressing the Space button, which will send the ball bouncing.
	preStart: true,
	firstPreStart: true, // Used to determine if the keyboard control screen should be displayed.
	isOver: false,
	lives: 3, // 5 is the maximum number of lives that a player can accumulate.
	level: 1, // When the player completes a level, gain a life unless already at the maximum
	score: 0,
	highScore: 0,
	requestId: null,

	// If there is a stored high score, retrieve it. Otherwise, set high score to 0.
	// Then, set the high score text to be whatever the high score is.
	retrieveHighScore: function() {
		localStorage.getItem("highScore") !== null ?
		this.highScore = localStorage.getItem("highScore") :
		this.highScore = 0;
		highScoreElem.textContent = `High Score: ${this.highScore}`;
	},
	startListener: function(e) {
		if (e.code === "Space") {
			game.start();
		}
	},

	// start refers to putting the current ball in play. If all lives are lost, the user will have
	// the opportunity to reset the game and play again.
	start: function() {
		this.preStart = false;
		this.firstPreStart = false;
		window.removeEventListener("keydown", game.startListener);

		// EXTREMELY SIMPLE IMPLEMENTATION OF BALL MOVEMENT
		// CHANGE LATER. Current values are just to test if collision detection is working properly.
		ball.xVel = ball.speed;
		ball.yVel = ball.speed;
	},

	// The this keyword must not be used in the game.loop function because it is called from
	// window.requestAnimationFrame().
	loop: function() {
		canvas.clear();

		paddle.handleMovement();
		paddle.draw();




		// BRICK STUFF
		drawBrickRow(10);
		drawBrickRow(30);
		drawBrickRow(50);
		drawBrickRow(70);
		drawBrickRow(90);
		drawBrickRow(110);



		ball.move();
		ball.draw();

		// game.firstPreStart is only true when the game first loads, before the player has pressed Space to launch the ball.
		// After the ball is launched, the keyboard control screen no longer needs to be displayed, as the controls
		// will be familiar to the player. It will not be displayed when the player restarts a game. To see the controls again,
		// the page must be reloaded.
		if (game.firstPreStart) {
			// Show keyboard control screen
			ctx.fillStyle = "#CCCCCC";
			ctx.fillRect(90, 187, 220, 113);

			canvas.drawText("Space", "1.8em monospace", "#000000", canvas.width / 2 - 90, canvas.height / 2 + 17, "start");
			canvas.drawText("-", "1.8em monospace", "#000000", canvas.width / 2 - 15, canvas.height / 2 + 17);
			canvas.drawText("launch ball", "1.2em monospace", "#000000", canvas.width / 2 + 90, canvas.height / 2 + 18, "end");

			canvas.drawText("A /", "1.8em monospace", "#000000", canvas.width / 2 - 90, canvas.height / 2 + 45, "start");
			canvas.drawText("-", "1.8em monospace", "#000000", canvas.width / 2 - 4, canvas.height / 2 + 45);
			canvas.drawText("move left", "1.2em monospace", "#000000", canvas.width / 2 + 90, canvas.height / 2 + 45, "end");
			canvas.drawArrowIcon("left", canvas.width / 2 - 29, canvas.height / 2 + 45);

			canvas.drawText("D /", "1.8em monospace", "#000000", canvas.width / 2 - 90, canvas.height / 2 + 73, "start");
			canvas.drawText("-", "1.8em monospace", "#000000", canvas.width / 2 - 7, canvas.height / 2 + 73);
			canvas.drawText("move right", "1.2em monospace", "#000000", canvas.width / 2 + 90, canvas.height / 2 + 73, "end");
			canvas.drawArrowIcon("right", canvas.width / 2 - 29, canvas.height / 2 + 73);
		}
		
		// Establish the game loop. window.requestAnimationFrame runs its callback function before
		// the browser performs the next repaint. This often happens 60 times per second, but will
		// generally match the display refresh rate in most web browsers.
		game.requestId = window.requestAnimationFrame(game.loop);
		
		// Exit the game loop
		if (game.isOver) {
			window.cancelAnimationFrame(game.requestId);
		}
	},
	gameOver: function() {
		this.isOver = true;
		// When the game ends, move the ball up one pixel from the death plane so it doesn't continue
		// to trigger the collision detection code.
		ball.yPos -= ball.size + 1;

		// Add a listener that resets the game when space is pressed.
		window.addEventListener("keydown", this.resetListener);

		// Show game over screen
		ctx.fillStyle = "#CCCCCC";
		ctx.fillRect(100, 140, 200, 120);

		// Prompt user to start a new game by pressing Space
		canvas.drawText("Game Over!", "2em monospace", "#000000", canvas.width / 2, canvas.height / 2 - 20);
		canvas.drawText("Press Space", "1.2em monospace", "#000000", canvas.width / 2, canvas.height / 2 + 10);
		canvas.drawText("to Restart", "1.2em monospace", "#000000", canvas.width / 2, canvas.height /2 + 28);
	},

	// Add listener when game is over, allowing game to be reset when Space is pressed.
	// Remove listener when Space is pressed and game is reset.
	// Since the listener is added to the window object, game.reset() must be used.
	// this.reset() does not work because the keyword this refers to the window object.
	resetListener: function(e) {
		if (e.code === "Space") {
			//setInterval(game.reset, 1000);
			game.reset();
		}
	},

	// Reset the game, preparing it to be played again.
	reset: function() {
		window.removeEventListener("keydown", this.resetListener);

		// Possibly refactor the following into an init-type function

		this.isOver = false;
		this.preStart = true;
		this.level = 1;
		level.textContent = `Level ${this.level}`;
		this.score = 0;
		scoreElem.textContent = `Score: ${this.score}`;
		this.lives = 3;
		canvas2.displayLives();
		paddle.xPos = (canvas.width / 2) - (paddle.width / 2);
		ball.xPos = paddle.xPos + paddle.width / 2;
		ball.yPos = canvas.height - (paddle.height * 2) - ball.size;

		window.addEventListener("keydown", this.startListener);
		
		game.requestId = window.requestAnimationFrame(game.loop);
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
	xPos: paddle.xPos + paddle.width / 2 - 40 - 4,
	// Getter method is used for ball's yPos since its initial position is related to its size, and
	// the size needs to be referred to with the this keyword.
	get yPos() {
		// Nullish coalescing operator is used instead of OR operator to handle the case when
		// this._yPos equals 0. If the OR operator is used, the left operand evaluates to false,
		// resetting the y position of the ball to the bottom of the screen. This is not the
		// intended behavior.
		return this._yPos ?? canvas.height - (paddle.height * 2) - this.size + 16;
	},
	// Since yPos is accessed with a getter method, a setter method is necessary to change its value
	set yPos(value) {
		this._yPos = value;
	},
	xVel: 0,
	yVel: 0,
	size: 8, // Used as radius of ball
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
		// Check if a circle is colliding with a rectangle. Used for ball and paddle collision detection, as well
		// as ball and brick collision detection.
		function circleRectCollision(circle, rect) {
			let xDistBetweenCenters = Math.abs(circle.xPos - (rect.xPos + rect.width / 2));
			let yDistBetweenCenters = Math.abs(circle.yPos - (rect.yPos + rect.height / 2));

			// If the x distance between the center of the circle and the center of the rectangle is
			// less than or equal to the circle's radius plus half the rectangle's width, there is no collision.
			if (xDistBetweenCenters > circle.size + rect.width / 2) {
				return false;
			}
			// If the y distance between the center of the circle and the center of the rectangle is
			// less than or equal to the circle's radius plus half the rectangle's height, there is no collision.
			if (yDistBetweenCenters > circle.size + rect.height / 2) {
				return false;
			}
			// Therefore, if the function reaches this point, xDistBetweenCenters is less than or equal to the circle's 
			// radius plus half the rectangle's width, and yDistBetweenCenters is less than or equal to the circle's
			// radius plus half the rectangle's height. This means the circle is either touching the rectangle or 
			// "relatively close" to touching it. The circle's center is somewhere inside (or resting on an edge or corner)
			// of a new, expanded rectangle that surrounds the original rectangle. This new rectangle's dimensions are what
			// would result from expanding each edge outward by the radius of the circle). However, knowing that the 
			// circle's center lives inside (or on an edge/corner) of this new outer rectangle is not enough to determine if 
			// the circle and rectangle are colliding. In fact, if the circle's center is on one of this outer rectangle's
			// corners, then the circle is definitely not colliding with the rectangle. In short, there is more work to be done
			// because of these corner cases. There is a small area near each corner which does not lead to a collision even
			// if the circle's center resides in it. To fix this, and complete our modelling of the circle and original 
			// rectangle's hitboxes, we have to round the corners of the outer, expanded rectangle. This new rectangle
			// with rounded corners will represent all of the points where the circle's center can be for there to be a 
			// collision between the circle and the original rectangle.


			// THE FOLLOWING IS INCORRECT AND MUST BE FIXED

			// To solve this corner case, the final step is to calculate the distance from the center of the rectangle
			// to one of its corners, then add the radius of the circle to it. This will give us the farthest distance
			// that the center of the circle can be from the center of the rectangle for the circle and rectangle to
			// still be colliding. This means that any time the distance between the circle's center and the rectangle's
			// center is less than or equal to this maximum distance, the circle and rectangle are colliding, and any time
			// the distance between the two centers is greater than this maximum distance, the circle and rectangle
			// are not colliding. By finding this maximum distance, we are effectively rounding the corners of the outer
			// circle.

			// Possibly refactor since maxDist is static. NOT WORKING
			/*let maxDist = Math.sqrt((paddle.width / 2) ** 2 + (paddle.height / 2) ** 2) + circle.size;
			if (Math.sqrt(xDistBetweenCenters ** 2 + yDistBetweenCenters ** 2) <= maxDist) {
				console.log(Math.sqrt(xDistBetweenCenters ** 2 + yDistBetweenCenters ** 2));
				
			}*/

			// Rework begun
			return Math.sqrt((xDistBetweenCenters - rect.width / 2) ** 2 + (yDistBetweenCenters - rect.height / 2) ** 2) <= circle.size;
		}

		console.log(circleRectCollision(this, paddle));

		if (this.xPos >= paddle.xPos - this.size && this.xPos <= paddle.xPos + paddle.width + this.size && 
			this.yPos >= paddle.yPos - this.size && this.yPos <= paddle.yPos + paddle.height + this.size) {


			//------------------------------------------------------------------------------

			//------------------------------------------------------------------------






			// NEGATIVE 7 to 87 --------
			//console.log(this.xPos - paddle.xPos);
			if (this.yVel <= 0) {
				this.yVel = -(this.yVel);
			}

		}






		// Detect collision with left and right walls
		if (this.xPos <= 0 + this.size || this.xPos >= canvas.width - this.size) {
			this.xVel = -(this.xVel);
		}
		// Detect collision with top wall
		if (this.yPos <= 0 + this.size) {
			this.yVel = -(this.yVel);

		// Detect collision with a death plane below the bottom of the canvas. If the ball ever collides with this plane,
		// a life is lost and if there is at least one more life remaining, the game reenters the preStart state in which 
		// the ball sits atop the paddle waiting to be launched again. If there are no lives remaining, trigger game over.
		} else if (this.yPos >= canvas.height + 100 - this.size && !game.preStart) {
			
			
			// Refactor the following into RESET HANDLER FUNCTION

			// Make the ball stop moving
			this.xVel = 0;
			this.yVel = 0;
			// Lose a life
			game.lives -= 1;
			canvas2.clear();
			canvas2.displayLives();
			// After losing a life, if the player has at least one life remaining, reset the ball to the top of the 
			// center of the paddle, and let the player launch it again.
			if (game.lives >= 1) {
				this.xPos = paddle.xPos + paddle.width / 2;
				this.yPos = canvas.height - (paddle.height * 2) - this.size;
				
				// game.preStart is used to determine if a ball should rest atop the paddle. When a life is lost and at least
				// 1 life remains, then this should happen. If the final life is lost, a ball should not be placed atop the paddle
				// since it is game over. If the users restarts the game, then a ball will once again rest atop the paddle.
				game.preStart = true;
				window.addEventListener("keydown", game.startListener);
			} else {
				// Handle end-of-game operations
				game.gameOver();
			}
		}
	}
}

const brickField = {
	numBricksInRow: 6,
	numBricksInColumn: 6,


	create: function() {

	}


}

const Brick = function(xPos, yPos, hitsLeft) {
	this.xPos = xPos;
	this.yPos = yPos;
	this.width = 55;
	this.height = 10;
	this.hitsLeft = hitsLeft;
	// The shade of the brick signifies how many hits are required to break it. Darker bricks require more 
	// hits to break.
	switch (this.hitsLeft) {
		case 1:
			this.color = "rgb(128, 224, 128)";
			break;
		case 2:
			this.color = "rgb(32, 192, 32)";
			break;
		case 3:
			this.color = "rgb(0, 128, 0)";
			break;
	}
}

Brick.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
};

// 55 * 6 = 330
// 70 remaining spaced out 10 each
// TEST FUNCTION
function drawBrickRow(yPos) {
	let brick1 = new Brick(0 + 10, yPos, 1);
	brick1.draw();
	let brick2 = new Brick(55 + 10 + 10, yPos, 1);
	brick2.draw();
	let brick3 = new Brick(110 + 10 + 20, yPos, 1);
	brick3.draw();
	let brick4 = new Brick(165 + 10 + 30, yPos, 1);
	brick4.draw();
	let brick5 = new Brick(220 + 10 + 40, yPos, 1);
	brick5.draw();
	let brick6 = new Brick(275 + 10 + 50, yPos, 1);
	brick6.draw();
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
game.retrieveHighScore();
canvas2.displayLives();



// TEST FUNCTION FOR LIVES PANEL
window.addEventListener("keydown", function(e) {
	/*if (e.code === "KeyJ") {
		if (game.lives > 0) {
			game.lives -= 1;
			canvas2.clear();
			canvas2.displayLives();
		}
	}*/

	// Next Level tester
	if (e.code === "KeyL") {
		if (game.level < 5) {
			game.level += 1;
			levelElem.textContent = `Level ${game.level}`;
			if (game.lives < 5) {
				game.lives += 1;
				console.log("Gain life");
				canvas2.clear();
				canvas2.displayLives();
			}
		}
	}

	// Score tester
	if (e.code === "KeyP") {
		game.score += 5;
		if (game.highScore < game.score) {
			game.highScore = game.score;

			localStorage.setItem("highScore", game.highScore);
		}
		// Update score and high score text with current values
			scoreElem.textContent = `Score: ${game.score}`;
			highScoreElem.textContent = `High Score: ${game.highScore}`;
	}
});


export { game, ball };