
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


//--------------------------------- classes

class Ball {
	constructor(x, y , dx, dy, color) {
		this.x = x;
		this.y = y;
		this.radius = 3;
		const SphereGeometry = new THREE.SphereGeometry(this.radius , 128, 128);
		const sphereMaterial = new THREE.MeshBasicMaterial({ color: color}); // Red color
		this.sphereMesh = new THREE.Mesh(SphereGeometry, sphereMaterial);
		this.sphereMesh.position.set(this.x,this.y, 1)
		scene.add(this.sphereMesh)
		this.light = new THREE.PointLight(color, 1.5, 250);
		this.light.castShadow = true;
		this.light.position.set( this.x, this.y, 0);
		scene.add(this.light)
		//this.velocityX = dx;
		//this.velocityY = dy;
		this.vec = new THREE.Vector2(dx, dy);
		this.updateSpeed();
		this.HitBox = new HitBox(this.x, this.y ,this.radius * 2,this.radius * 2, this.radius * 2);
	}

	cleanup() {
		this.light.dispose();
		scene.remove(this.light);
		scene.remove(this.sphereMesh);
	}


	reset(side){
		this.x = 0;
		this.y = 0;
		//this.velocityX = BALL_SPEED * side;
		//this.velocityY = 0;
		this.vec.y = randomValue();
		this.vec.x = 1;
		this.vec.normalize();
		this.vec.x *= BALL_SPEED * side;
		this.vec.y *= BALL_SPEED;
		this.HitBox.setPosition(this.x, this.y)
		this.sphereMesh.position.set(this.x,this.y, 0)
	}

	update(){
		if(game_stop)
		{
			return ;
		}
		
		if (this.HitBox.doesCollide(leftPaddle.HitBox)){
			this.vec.y =  leftPaddle.getImpactVector(this.y);
			this.vec.x *= -1;
			this.updateSpeed()
			this.HitBox.disable();
			leftPaddle.disableHitbox();
		}
		if(this.HitBox.doesCollide(rightPaddle.HitBox)){
			this.vec.y =  rightPaddle.getImpactVector(this.y);
			this.vec.x *= -1;
			this.updateSpeed()
			this.HitBox.disable();
			rightPaddle.disableHitbox();
		}
		if (this.HitBox.doesCollide(roof) || this.HitBox.doesCollide(floor)){
			this.vec.y *= -1;
		}
			//this.velocityY *= -1;
		if (this.HitBox.doesCollide(leftGoal)){
			score("right");
			//this.velocityX *= -1;
			this.vec.x *= -1;
			this.reset(1);
			return;
		} else if (this.HitBox.doesCollide(rightGoal)){
			score("left");
			//this.velocityX *= -1;
			this.vec.x *= -1;
			this.reset(-1);
			return;
		}
			

		this.x += this.vec.x;
		this.y += this.vec.y;

		//this.x += this.velocityX;
		//this.y += this.velocityY;

		this.HitBox.setPosition(this.x, this.y);
		this.light.position.set( this.x, this.y, 0);
		this.sphereMesh.position.set(this.x,this.y, 0);
	}

	
	changeColor(color){
		this.light.color.set(color);
		this.sphereMesh.material.color.set(color);
		leftPaddle.changeColor(invertColor(color));
		rightPaddle.changeColor(invertColor(color));
	}
	
	updateSpeed(){
	
		this.vec.normalize();
		this.vec.x *= BALL_SPEED;
		this.vec.y *= BALL_SPEED;
	}
}


class HitBox{
	constructor(x,y, width, length, depth) {
		this.x = x;
		this.y = y;
        this.depth = depth;
		this.width = width;
		this.length = length;
        const geometry = new THREE.BoxGeometry(this.width,this.length ,this.depth , 1, 1, 1);
        const material = new THREE.MeshStandardMaterial( { color: wallcolorforbillythekid} );
        material.wireframeLinewidth = 5;
        this.model = new THREE.Mesh( geometry, material );
        this.model.position.set(this.x,this.y, 1)
        this.isAble = true;
	}

    doesCollide(hitBox) {
        // Calculate boundaries of each hitbox
        if (!this.isAble && !hitBox.isAble)
            return ;

        const thisLeft = this.x - this.width / 2;
        const thisRight = this.x + this.width / 2;
        const thisTop = this.y + this.length / 2;
        const thisBottom = this.y - this.length / 2;
    
        const hitBoxLeft = hitBox.x - hitBox.width / 2;
        const hitBoxRight = hitBox.x + hitBox.width / 2;
        const hitBoxTop = hitBox.y + hitBox.length / 2;
        const hitBoxBottom = hitBox.y - hitBox.length / 2;

        return thisLeft < hitBoxRight &&
            thisRight > hitBoxLeft &&
            thisBottom < hitBoxTop &&
            thisTop > hitBoxBottom;
    }

	setPosition(x,y){
		this.x = x;
		this.y = y;
        this.model.position.set(this.x ,this.y, 1);
	}

	draw(){
		scene.add(this.model)
	}

    remove(){
        scene.remove(this.model)
    }

    disable(){
        this.isAble = false;
        setTimeout(() => {
            this.isAble = true;
        }, 1000);
    }
}


class PongAi {
    constructor(paddle, goal, ball,){
		this.ball = ball;
        this.paddle = paddle;
        this.goal = goal;
        this.expectedCollision = 0;
		this.resetPos = goal.x;
    }

    getBallPosition(){
		if(game_stop)
			return ;
		this.ball = getClosestBall(this.paddle.x);
		this.posX = this.ball.x;
		this.posY = this.ball.y;
        this.vec = new THREE.Vector2(this.ball.vec.x, this.ball.vec.y);
		this.expectedCollision = this.calcCollision();
    }
	
	calcCollision(){
		this.vec.normalize();
		this.calcFirstRebound();
		var slope = this.vec.y/ this.vec.x;
		return slope * (this.paddle.x - this.posX) + this.posY;
	}

	doesImpactY(impactLine, limit) {
		if (this.vec.x >= impactLine.x - limit && this.vec.x <= impactLine.x + limit) {
			return true;
		} else {
			return false; 
		}
	}

	calcFirstRebound(){
		if (this.vec.y < 0){
			if (this.doesImpactY(floor.y)){

				this.posX = this.posX + (this.vec.x / this.vec.y) * (floor.y - this.posY)
				this.posY = floor.y;
				this.vec.y *= -1;
			}
		} else{
			if (this.doesImpactY(roof.y)){
				this.posX = this.posX + (this.vec.x / this.vec.y) * (roof.y - this.posY)
				this.posY = roof.y;
				this.vec.y *= -1;
			}
		}
	}

    update(){
		if (this.expectedCollision < this.paddle.y){
			this.paddle.down = false;
            this.paddle.up = true;
        }
        if (this.expectedCollision > this.paddle.y){
			this.paddle.up = false;
            this.paddle.down = true;
        }
		if (Math.abs(this.expectedCollision - this.paddle.y) <= 5)
		{
			this.paddle.up = false;
			this.paddle.down = false;
		}
		
    }
}


class Paddle {
	constructor(x, y, color) {
		this.aiActive = false
		this.x = x;
		this.y = y;
		this.down = false;
		this.up = false;
		this.speed = 1.5;
		const width = 5;
		this.height = 35;
		const depth = 5;
		this.color = color;
		this.HitBox = new HitBox(this.x,this.y,width, this.height , depth);
		const geometry = new THREE.BoxGeometry(width, this.height ,depth);
        const material = new THREE.MeshPhongMaterial( { color: color} );
		material.shininess = 100;
        this.model = new THREE.Mesh( geometry, material );
		this.model.position.set(this.x,this.y, 1)
		scene.add(this.model);
	}

	draw() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	update(){
		if(game_stop)
			return ;
		if (this.aiActive)
			this.ai.update();
		if(this.up && !this.down){
			if (!this.HitBox.doesCollide(floor))
			this.y -= this.speed;
		}
		if(this.down && !this.up){
			if (!this.HitBox.doesCollide(roof))
				this.y += this.speed;
		}
		this.HitBox.setPosition(this.x,this.y)
		this.model.position.set(this.x, this.y , 0);
	}

	getImpactVector(y) {
		const MAX_ANGLE = 3;
		var hitPosition = (y - this.y) / (this.height/2);
		var maxAngle = Math.PI / MAX_ANGLE; 
		var minAngle = -Math.PI / MAX_ANGLE; 
		var impactAngle = hitPosition * (maxAngle - minAngle) / 2;
		var dy = Math.sin(impactAngle);	
	
		return dy * BALL_SPEED;
	}

	activateAI(goal, ball){
		this.aiActive = true;
		this.ai = new PongAi(this, goal, ball);
		setInterval(() => this.ai.getBallPosition(), 1000);
	}

	changeColor(color){
		this.model.material.color.set(color);
	}

	disableHitbox(){
		this.HitBox.disable();
	}

	remove(){
        scene.remove(this.model)
    }
}

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


//----------------------------------------- game logic 

function update(){
	if(game_stop)
		return ;
	for (let i = 0; i < balls.length; i++) {
		balls[i].update();
	}
	leftPaddle.update();
	rightPaddle.update();
	renderer.render(scene, camera)
	requestAnimationFrame(update);
}

function score(side){
	if (side === "left")
		leftPlayerScore++;
	else if (side === "right")
		rightPlayerScore++;

	document.getElementById('leftPlayerScore').textContent = leftPlayer + ': ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = rightPlayer + ': ' + rightPlayerScore;	

	if(leftPlayerScore == scoreToWin || rightPlayerScore == scoreToWin)
	{
		let winner;
		let loser;
		
		game_stop = true;
		
		if(leftPlayerScore > rightPlayerScore)
		{
			winner = leftPlayer;
			loser = rightPlayer;
		}
		else
		{
			winner = rightPlayer;
			loser = leftPlayer;
		}
		
		if(game_mode == "pong_tournament")
		{
			endRound(winner, loser);
		}
		else
		{
			$("#winModal").modal('show');
			document.getElementById('winner').textContent = winner + " won!";
		}
		
	}
}

function start_pong()
{
	if(game_mode == "pong_tournament" && round > 1)
	{
		restartGame();
	}
	else
		startMatch();
}

function PongGame()
{
	game_stop = false;

	if(game_mode == 'pong_dual')
	{
		leftPlayer = 'Left player';
		rightPlayer = 'Right player';
		prepareGame();

	}
	else if(game_mode == 'pong_ai')
	{
		leftPlayer = 'You';
		rightPlayer = 'Ai';
		prepareGame();
	}
	else if(game_mode == 'pong_tournament')
	{
		prepare_tournament();
	}
}

function prepareGame()
{
	document.getElementById('leftPlayerScore').textContent = leftPlayer + ': ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = rightPlayer + ': ' + rightPlayerScore;	

	colorPicker = document.getElementById('colorPicker'); // assuming you have an input element with id 'colorPicker'
    colorBox = document.getElementById('colorBox'); // assuming you have a div element with id 'colorBox'
    canvas = document.getElementById("pongCanvas");
    ballSlider = document.getElementById("ballSlider");
	scoreSlider = document.getElementById("scoreSlider");
    ballSliderOutput = document.getElementById("ballSliderValue");
    speedSlider = document.getElementById("speedSlider");
    speedOutput = document.getElementById("speedSliderValue");
	scoreOutput = document.getElementById("scoreSliderValue");
	scene = new THREE.Scene();
	
	backgroundGeometry = new THREE.BoxGeometry(GAME_WIDTH * 2, GAME_HEIGHT * 2 ,1)
	backgroud_materail = new THREE.MeshStandardMaterial({color: 0x444444});
	background = new THREE.Mesh( backgroundGeometry, backgroud_materail);
	background.position.z = -BOUND_DEPTH / 2;
	renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true, pixelRatio: window.devicePixelRatio });
	camera = new THREE.PerspectiveCamera( 90, canvas.width / canvas.height, 0.1, 1000 );
	light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add(light);
	scene.background = new THREE.Color(0x000000);
	scene.add(light);
	scene.background = new THREE.Color(0x000000);
	scene.add(background);
 	floor = new HitBox(0, -GAME_HEIGHT , GAME_WIDTH * 2, 1, BOUND_DEPTH);
 	roof = new HitBox(0, GAME_HEIGHT, GAME_WIDTH * 2, 1, BOUND_DEPTH);
 	leftGoal = new HitBox(-GAME_WIDTH , 0, 1, GAME_HEIGHT * 2, BOUND_DEPTH);
	rightGoal = new HitBox(GAME_WIDTH, 0, 1, GAME_HEIGHT * 2, BOUND_DEPTH); 
	leftPaddle = new Paddle(-GAME_WIDTH + PADDLE_DISTANCE_FROM_GOAL , 0, randomColor());
	rightPaddle = new Paddle(GAME_WIDTH - PADDLE_DISTANCE_FROM_GOAL, 0, randomColor());
	speedOutput.innerHTML = speedSlider.value;
	BALL_SPEED = speedSlider.value;
	ball_color = randomColor();
	extra_ball_number = 0;
	scoreToWin = scoreSlider.value;
	leftGoal.draw();
	rightGoal.draw();
	roof.draw();
	floor.draw();
	
	setUpScene();
	ballSliderOutput.innerHTML = ballSlider.value;
	scoreOutput.innerHTML = scoreSlider.value;
	update();
	
	colorPicker.addEventListener('input', handleColorPicked);
	
	ballSlider.oninput = function() {
		
		ballSliderOutput.innerHTML = this.value;
		extra_ball_number = this.value;
		//setBall(this.value);
	}
	
	speedSlider.oninput = function() {
		speedOutput.innerHTML = this.value;
		BALL_SPEED = this.value;
		/*for (let i = 0; i < balls.length; i++) {
			balls[i].updateSpeed();
		}*/
	}

		
	scoreSlider.oninput = function() {
		scoreOutput.innerHTML = this.value;
		scoreToWin  = this.value;
	}
	//ball for presentation
	balls.push(new Ball(0,0,0, 0, ball_color));
}

function startMatch()
{
	document.getElementById("play-link").style.visibility = 'hidden';
	
	//delete the presentation ball
	balls[0].cleanup();
	balls = [];

	//first ball
	balls.push(new Ball(0,0,BALL_SPEED, randomValue(), ball_color))

	//extra balls
	setBall(extra_ball_number);

	if(game_mode === 'pong_ai')
		rightPaddle.activateAI(leftGoal,balls);

	document.getElementById("customs").remove();
    
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
}

function stopGame() 
{
	if(colorPicker)
		colorPicker.removeEventListener('input', handleColorPicked);

	
	document.removeEventListener('keydown', keyDownHandler);

	game_mode = "";

	document.removeEventListener('keyup', keyUpHandler);
	leftPlayerScore = 0;
    rightPlayerScore = 0;
	balls = [];
	game_stop = true;
}

function restartGame()
{

	document.getElementById("play-link").style.visibility = 'hidden';
	set_round();
	game_stop = false;
	leftPlayerScore = 0;
    rightPlayerScore = 0;
	
	while(balls.length > 0)
	{
		balls.pop().cleanup();
	}

	document.getElementById('leftPlayerScore').textContent = leftPlayer + ': ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = rightPlayer + ': ' + rightPlayerScore;


	leftPaddle.remove();
	rightPaddle.remove();
	leftPaddle = new Paddle(-GAME_WIDTH + PADDLE_DISTANCE_FROM_GOAL , 0, randomColor());
	rightPaddle = new Paddle(GAME_WIDTH - PADDLE_DISTANCE_FROM_GOAL, 0, randomColor());

	balls.push(new Ball(0,0,BALL_SPEED, randomValue(), ball_color))
	setBall(extra_ball_number);
	update();
}


