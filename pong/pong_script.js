
const GAME_WIDTH = 100;
const GAME_HEIGHT = 50;
const PADDLE_DISTANCE_FROM_GOAL = 10;
const BOUND_DEPTH = 50;
const wallcolorforbillythekid = randomColor();

//html elements
let canvas;
let colorPicker;
let colorBox;
var ballSlider;
var ballSliderOutput;
var speedSlider;
var speedOutput;

//scene
let scene;
let camera;
let light; 
let backgroundGeometry;
let backgroud_materail;
let background;
let renderer;
let floor;
let roof;
let leftGoal;
let rightGoal; 
let leftPaddle;
let rightPaddle;

//balls
var balls = [];
var BALL_SPEED = 1;
let ball_color;
let extra_ball_number;

//score/players
var leftPlayerScore = 0;
var rightPlayerScore = 0;
let scoreToWin;
let leftPlayer;
let rightPlayer;

//game
let game_stop = true;
let game_mode = "";

//tournament
let round;
let old_content;

let player1;
let player2;
let player3;
let player4;

let r1_winner;
let r1_loser;
let r2_winner;
let r2_loser;
let first_pos;
let second_pos;
let third_pos;

//--------------------------------- random and colors

// Function to invert a color passed in hexadecimal format
function invertColor(hex) {
	// Remove # if it's there
    hex = hex.replace('#', '');
    // Convert hex to RGB
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    // Invert each component
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    // Convert RGB back to hex
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Function to generate a random color in hexadecimal format
function randomColor() {
	// Generate random values for red, green, and blue components
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    // Convert RGB to hex
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}

function randomValue() {
	return Math.random() * 1.5 - 0.75;
}


function randomSpeed(){
	return Math.random() < 0.5 ? -1 : 1;
}

// ---------------------------------------------- scene

function setUpScene(){
	camera.position.z = 75;
	
}

//bullshit object is place from center not top left so this just adjust it so its placed top left 
function adjustGeometryCenter(geometry, width, height, depth) {
	geometry.vertices.forEach(vertex => {
		vertex.x -= width / 2;
        vertex.y -= height / 2;
        vertex.z -= depth / 2;
    });
}


// ---------------------------------------------- balls

function setBall(n){
	if(n == 0)
	return ;
	if (n > balls.length){
		const numberOfNewBall = n - balls.length;
		for (let i = 0; i < numberOfNewBall; i++) {
			balls.push(new Ball(0,0,BALL_SPEED, randomValue(), ball_color));
		}
	}
	else if (n < balls.length){
		for (let i = balls.length - 1; i >= n; i--) {
			balls.pop().cleanup();
		}
	}
}

function getClosestBall(x)
{
	var ball = balls[0];
	for(let i = 1; i < balls.length; i++) 
	{
		if (x - balls[i].x < x - ball)
		ball = balls[i];
	}
	return ball
}

//--------------------------------- events

function handleColorPicked(event) {
	const color = event.target.value;
	colorBox.style.backgroundColor = color;
	ball_color = color;
	for (let i = 0; i < balls.length; i++) {
		balls[i].changeColor(color);
	}
}

function keyDownHandler(event) {
	if (event.key === 'w' || event.key === 'W' ) {
		leftPaddle.down = true;
    }
	if (event.key === 's' || event.key === 'S') {
		leftPaddle.up = true;
    }
	
	if (event.key === 'ArrowUp') {
		rightPaddle.down = true;
    }
	if (event.key === 'ArrowDown') {
		rightPaddle.up = true;
    }
	
}

function keyUpHandler(event) {
	if (event.key === 'w' || event.key === 'W' ) {
		leftPaddle.down = false;
    }
	if (event.key === 's' || event.key === 'S') {
		leftPaddle.up = false;
    }
	if (event.key === 'ArrowUp') {
		rightPaddle.down = false;
    }
	if (event.key === 'ArrowDown') {
		rightPaddle.up = false;
    }
}
