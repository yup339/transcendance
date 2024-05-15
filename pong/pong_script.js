
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
		if (this.HitBox.doesCollide(leftPaddle.HitBox)){
			//wthis.velocityY =  leftPaddle.getImpactVector(this.y);
			//this.velocityX *= -1;
			this.vec.y =  leftPaddle.getImpactVector(this.y);
			this.vec.x *= -1;
			this.updateSpeed()
			this.HitBox.disable();
			leftPaddle.disableHitbox();
		}
		if(this.HitBox.doesCollide(rightPaddle.HitBox)){
			//this.velocityY =  rightPaddle.getImpactVector(this.y);
			//this.velocityX *= -1;
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
			console.log("score at: ", balls[0].y);
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
		//console.log(this.x, " , ", this.y);
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
		var hitPosition = (y - this.y) / (this.height * 2);
	
		var maxAngle = Math.PI / 2; 
		var minAngle = -Math.PI / 2; 
	
		var impactAngle = minAngle + (hitPosition * (maxAngle - minAngle));
	
		var dy = Math.sin(impactAngle);	
		dy = dy * -1;
		return dy;
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
}
let game_stop = true;

var BALL_SPEED = 1;
const GAME_WIDTH = 100;
const GAME_HEIGHT = 50;
const PADDLE_DISTANCE_FROM_GOAL = 10;
const BOUND_DEPTH = 50;
const wallcolorforbillythekid = randomColor();

let colorPicker;
let colorBox;
let canvas;
var ballSlider;
var ballSliderOutput;
var speedSlider;
var speedOutput;


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
var balls = [];
var   leftPlayerScore = 0;
var   rightPlayerScore = 0;








//--------------------------------- classes

//--------------------------------- functions

function handleColorPicked(event) {
	const color = event.target.value;
	colorBox.style.backgroundColor = color;
	for (let i = 0; i < balls.length; i++) {
		balls[i].changeColor(color);
	}
}

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

function getClosestBall(x){
	var ball = balls[0];
	for(let i = 1; i < balls.length; i++) {
		if (x - balls[i].x < x - ball)
		ball = balls[i];
	}
	return ball
}

function randomValue() {
    return Math.random() * 1.5 - 0.75;
}
function randomColor() {
    // Generate random values for red, green, and blue components
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    // Convert RGB to hex
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}



function score(side){
	if (side === "left")
		leftPlayerScore++;
	else if (side === "right")
		rightPlayerScore++;

	document.getElementById('leftPlayerScore').textContent = 'Left Player: ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = 'Right Player: ' + rightPlayerScore;	
}

function setBall(n){
	if (n > balls.length){
		const numberOfNewBall = n - balls.length;
		for (let i = 0; i < numberOfNewBall; i++) {
			balls.push(new Ball(0,0,randomSpeed(), randomValue(), randomColor()));
		}
	}
	else if (n < balls.length){
		for (let i = balls.length - 1; i >= n; i--) {
			balls.pop().cleanup();
		}
	}
}

function randomSpeed(){
	return Math.random() < 0.5 ? -1 : 1;
}

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

//--------------------------------- events


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


//-----------------------------------------


function executeGame()
{
	game_stop = false;
	BALL_SPEED = 1;
	const colorPicker = document.getElementById('colorPicker'); // assuming you have an input element with id 'colorPicker'
    colorBox = document.getElementById('colorBox'); // assuming you have a div element with id 'colorBox'
    canvas = document.getElementById("pongCanvas");
    ballSlider = document.getElementById("ballSlider");
    ballSliderOutput = document.getElementById("ballSliderValue");
    speedSlider = document.getElementById("speedSlider");
    speedOutput = document.getElementById("speedSliderValue");
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
	ballSliderOutput.innerHTML = ballSlider.value;
    balls.push(new Ball(0,0,1, randomValue(), randomColor()))	
	ballSlider.oninput = function() {
		
		ballSliderOutput.innerHTML = this.value;
		setBall(this.value);
	}
	
	speedSlider.oninput = function() {
		speedOutput.innerHTML = this.value;
		BALL_SPEED = this.value;
		for (let i = 0; i < balls.length; i++) {
			balls[i].updateSpeed();
		}
	}


	leftGoal.draw();
	rightGoal.draw();
	roof.draw();
	floor.draw();
	
	setUpScene();
	
	update();
	colorPicker.addEventListener('input', handleColorPicked);
    
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
}

function stopGame() 
{
	if(colorPicker)
		colorPicker.removeEventListener('input', handleColorPicked);

	
	document.removeEventListener('keydown', keyDownHandler);


	document.removeEventListener('keyup', keyUpHandler);
	leftPlayerScore = 0;
    rightPlayerScore = 0;
	balls = [];
	game_stop = true;
}

