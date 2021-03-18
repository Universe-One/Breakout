import canvas, { ctx } from "./canvas.js";
import canvas2 from "./canvas2.js";
import { game } from "./app.js";
import paddle from "./paddle.js";


const ball = {
	xPos: paddle.xPos + paddle.width / 2 - 45,
	// Getter method is used for ball's yPos since its initial position is related to its size, and
	// the size needs to be referred to with the this keyword.
	get yPos() {
		// Nullish coalescing operator is used instead of OR operator to handle the case when
		// this._yPos equals 0. If the OR operator is used, the left operand evaluates to false,
		// resetting the y position of the ball to the bottom of the screen. This is not the
		// intended behavior.
		return this._yPos ?? canvas.height - (paddle.height * 2) - this.size + 29;
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
			// because of these corner cases. There is a small area near each corner of this outer rectangle which does not lead 
			// to a collision even if the circle's center resides in it. To fix this, and complete our modelling of the circle 
			// and original rectangle's hitboxes, we have to round the corners of the outer, expanded rectangle. This new rectangle
			// with rounded corners will represent all of the points where the circle's center can be for there to be a 
			// collision between the circle and the original rectangle.

			// Before solving the corner cases, the following code first solves every remaining case that is not a corner case.
			if (xDistBetweenCenters <= rect.width / 2) {
				return true;
			}
			if (yDistBetweenCenters <= rect.height / 2) {
				return true;
			}

			// The final step is to solve the corner cases. This is done by positing a triangle whose hypotenuse is the distance
			// from the center of the circle to the nearest corner of the rectangle. The other sides of this triangle are the
			// are the x distance and the y distance from the center of the circle to the nearest corner of the rectangle. 
			// If this hypotenuse is less than or equal to the radius of the circle, then the circle is touching the rectangle.
			// The hypotenuse is equal to the circle's radius when the circle is touching the rectangle at exactly its
			// corner, and is smaller than the circle's radius in all other cases near the corner. This gives us our bounding
			// rounded rectangle, and we are finished.
			return Math.sqrt((xDistBetweenCenters - rect.width / 2) ** 2 + (yDistBetweenCenters - rect.height / 2) ** 2) 
				   <= circle.size;
		}

		if (circleRectCollision(this, paddle)) {
			console.log("COLLISION");
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

export default ball;