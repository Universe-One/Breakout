// The element references have "Elem" suffixes to differentiate them from variables used in the program.
const canvasElem = document.querySelector("#game-canvas");
const ctx = canvasElem.getContext("2d");
const scoreElem = document.querySelector("#current-score");
const highScoreElem = document.querySelector("#high-score");

// Keyboard controls
window.addEventListener("keydown", function(e) {
	switch (e.code) {
		case "KeyA":
		case "ArrowLeft":
			console.log("left");
			break;
		case "KeyD":
		case "ArrowRight":
			console.log("right");
			break;
	}
});

const canvas = {
	width: canvasElem.width,
	height: canvasElem.height
}

/*const game = {
	isOver = false
}
*/

const paddle = {
	// The paddle should initially be drawn at the middle of the screen. However, fillRect treats
	// the x argument as the left edge of the paddle, so we need to subtract half of the width of
	// the paddle to center it. A getter function is used so that the width of the paddle can be
	// referred to using this.width.
	get xPos() {
		return (canvas.width / 2) - (this.width / 2);
	},
	yPos: 360,
	width: 80,
	height: 16,
	draw: function() {
		ctx.fillStyle = "rgb(0, 190, 255)";
		ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
		console.log(this.yPos);
	}
	move: function() {
		
	}
}

paddle.draw();