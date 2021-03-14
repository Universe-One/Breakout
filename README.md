# Breakout in JavaScript
[Breakout](https://en.wikipedia.org/wiki/Breakout_(video_game)) is a popular game involving a user-controlled paddle, a bouncing ball, and many breakable bricks. The object of the game is to achieve the highest possible score by completing all the levels, and each level is completed by breaking all of the bricks in it. A brick breaks when the bouncing ball hits it a sufficient number of times which depends on the brick's color. Darker bricks require more hits to break. If the ball ever touches the bottom of the screen, a life is lost and the ball is reset. If all lives are lost, the game is over. Bricks are located at the top of the screen, and the paddle rests just above the bottom of the screen. The purpose of the paddle is to guide the ball toward the remaining bricks in the level while preventing the ball from touching the bottom of the screen. The user controls this paddle by moving it left and right in an effort to meet the ball in time. Unfortunately, your browser does not support canvas, which is needed in order for this game to run.

## Play
[Live Demo](https://universe-one.github.io/Breakout/)

## Controls
A or &#8592; - Move Left  
D or &#8594; - Move Right  
Space (when ball rests atop paddle) - Launch Ball  
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;(when game is over) - Restart Game

## Technologies Used
* HTML5
* CSS3
* JavaScript
* Canvas API
* Web Storage API

## License
Licensed under the [MIT License](LICENSE)