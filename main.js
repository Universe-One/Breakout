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
			paddle.move("left");
			break;
		case "KeyD":
		case "ArrowRight":
			paddle.move("right");
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
	// referred to using this.width. A getter cannot return itself and a setter cannot set a value
	// to itself because both of these cause infinite recursive calls. New properties must be created,
	// and the convention is to prepend an underscore (_) to the getter/setter name.
	get xPos() {
		return this._xPos || (canvas.width / 2) - (this.width / 2);
	},
	set xPos(value) {
		this._xPos = value;
	},
	yPos: 360,
	width: 80,
	height: 16,
	draw: function() {
		ctx.fillStyle = "rgb(0, 190, 255)";
		ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
	},
	move: function(direction) {
		if (direction === "right") {
			this.xPos += 1;
			console.log(this.xPos);
		} else {
			this.xPos -= 1;
		}
	}
}

//setInterval(paddle.draw, 400);
paddle.draw();