// The element references have "Elem" suffixes to differentiate them from variables used in the program.
const canvasElem = document.querySelector("#game-canvas");
const ctx = canvasElem.getContext("2d");

const canvas = {
	width: canvasElem.width,
	height: canvasElem.height,
	clear: function() {
		ctx.clearRect(0, 0, this.width, this.height);
	},
	drawText: function(text, font, color, xPos, yPos, textAlign = "center") {
		ctx.fillStyle = color;
		ctx.textAlign = textAlign;
		ctx.textBaseline = "middle";
		ctx.font = font;
		ctx.fillText(text, xPos, yPos);
	},
	drawArrowIcon: function(direction, xPos, yPos) {
		let xOffsetStem = 8;
		let yOffsetStem = 1;
		let xOffsetHead; // Depends on direction
		let yOffsetHead = 5;
		let headPoint; // Depends on direction
		switch (direction) {
			// Set variables related to drawing arrow head, then draw it.
			case "left":
				xOffsetHead = 4;
				headPoint = xOffsetHead - 6;
				ctx.beginPath();
				ctx.moveTo((xPos - xOffsetStem) + xOffsetHead, yPos - yOffsetHead);
				ctx.lineTo((xPos - xOffsetStem) + headPoint, yPos);
				ctx.lineTo((xPos - xOffsetStem) + xOffsetHead, yPos + yOffsetHead);
				ctx.fill();
				break;
			case "right":
				xOffsetHead = -4;
				headPoint = xOffsetHead + 6;
				ctx.beginPath();
				ctx.moveTo((xPos + xOffsetStem) + xOffsetHead, yPos - yOffsetHead);
				ctx.lineTo((xPos + xOffsetStem) + headPoint, yPos);
				ctx.lineTo((xPos + xOffsetStem) + xOffsetHead, yPos + yOffsetHead);
				ctx.fill();
				break;
		}
		// Draw arrow stem
		ctx.beginPath();
		ctx.moveTo(xPos - xOffsetStem, yPos - yOffsetStem);
		ctx.lineTo(xPos - xOffsetStem, yPos + yOffsetStem);
		ctx.lineTo(xPos + xOffsetStem, yPos + yOffsetStem);
		ctx.lineTo(xPos + xOffsetStem, yPos - yOffsetStem);
		ctx.fill();
	}
}

export default canvas;
export { ctx };