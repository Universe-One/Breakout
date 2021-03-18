// TODO

// look for more appealing hues of bricks
// Fix lives panel update
// Redundant comments occur over every instance of a design pattern. Rewrite these comments to appear once ath
// the beginning of the program or only the first time a design pattern occurs.
// Confine lives from 0/1-5 and update lives panel to reflect that

// REMOVE canvasElem later
import canvas, { ctx } from "./canvas.js";
import canvas2 from "./canvas2.js";
import ball from "./ball.js";
import paddle from "./paddle.js";

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


export { game };