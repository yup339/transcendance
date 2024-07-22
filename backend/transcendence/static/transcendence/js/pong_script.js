
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
let previousTimePong;

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
let socket;
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


// ---------------------------------------------- tournament

function prepare_tournament()
{
	
	let pong_content = document.getElementById("pong-content");
	old_content = pong_content.innerHTML;
	pong_content.innerHTML = `<form>
	<div class="row gy-5 gx-5">
	   <div class="col-12 mb-3">
		<h1 class="text-white text-center"> Enter players name</h1>
	  </div>
	  <div class="col-6 form-group" >
		<label for="player1" class="text-white">First player</label>
		<input id="player1" type="text" class="form-control mt-2" placeholder="Player name" maxlength="15">
	  </div>
	  <div class="col-6 form-group">
		<label for="player2" class="text-white">Second player</label>
		<input id="player2" type="text" class="form-control mt-2" placeholder="Player name" maxlength="15">
	  </div>
	  <div class="col-6 form-group">
		<label for="player3" class="text-white">Third player</label>
		<input id="player3" type="text" class="form-control mt-2" placeholder="Player name" maxlength="15">
	  </div>
	  <div class="col-6 form-group">
		<label for="player4" class="text-white">Fourth player</label>
		<input id="player4" type="text" class="form-control mt-2" placeholder="Player name" maxlength="15">
	  </div>
	  <div class="col-12">
		  <button type="button" class="btn btn-color text-white w-50 d-block m-auto mt-4 py-3" onclick="validate_tournament_users()">Start</button>
	  </div>
	</div>
</form>`;


}

function validate_tournament_users()
{
	player1 = document.getElementById('player1').value.trim();
	player2 = document.getElementById('player2').value.trim();
	player3 = document.getElementById('player3').value.trim();
	player4 = document.getElementById('player4').value.trim();
	
	if (player1 !== '' && player2 !== '' && player3 !== '' && player4 !== '') 
	{
		document.getElementById("pong-content").innerHTML = old_content;
		
		round = 1;
		set_round();
		prepareGame();
	} 
}


function endRound(winner, loser)
{
	if(round == 1)
	{
		r1_winner = winner;
		r1_loser = loser;
	}
	else if(round == 2)
	{
		r2_winner = winner;
		r2_loser = loser
	}
	else if(round == 3)
	{
		first_pos = winner;
		second_pos = loser;
	}
	else if(round == 4)
	{
		third_pos = winner;
	}
	
	if(round < 4)
	{
		round++;
		document.getElementById("play-link").style.visibility = 'visible';
		//restartGame();
	}
	else
	{
		$("#winModal").modal('show');
		document.getElementById('winner').innerHTML = `<p id="pos1"></p><p id="pos2"></p><p id="pos3"></p> `;
		document.getElementById("pos1").textContent = "First: " + first_pos;
		document.getElementById("pos2").textContent = "Second: " + second_pos;
		document.getElementById("pos3").textContent = "Third: " + third_pos;
	}
}

function set_round()
{
	document.getElementById("round").innerHTML = "Round: " + round;
	if(round == 1)
	{
		leftPlayer = player1;
		rightPlayer = player2;
	}
	else if(round == 2)
	{
		leftPlayer = player3;
		rightPlayer = player4;
	}
	else if(round == 3)
	{
		
		leftPlayer = r1_winner;
		rightPlayer = r2_winner;
	}
	else if(round == 4)
	{
		leftPlayer = r1_loser;
		rightPlayer = r2_loser;
	}
}