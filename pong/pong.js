const GAME_WIDTH = 100;
const GAME_HEIGHT = 50;
const PADDLE_DISTANCE_FROM_GOAL = 10;
const BOUND_DEPTH = 50;

const canvas = document.getElementById("pongCanvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, canvas.width / canvas.height, 0.1, 1000 );
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add(light);
scene.background = new THREE.Color(0x000000);

const backgroundGeometry = new THREE.BoxGeometry(GAME_WIDTH * 2, GAME_HEIGHT * 2 ,1)
const backgroud_materail = new THREE.MeshStandardMaterial({color: 0x444444});
const background = new THREE.Mesh( backgroundGeometry, backgroud_materail);
background.position.z = -BOUND_DEPTH / 2;
scene.add(background);
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true, pixelRatio: window.devicePixelRatio });
const floor = new HitBox(0, -GAME_HEIGHT , GAME_WIDTH * 2, 1, BOUND_DEPTH);
const roof = new HitBox(0, GAME_HEIGHT, GAME_WIDTH * 2, 1, BOUND_DEPTH);
const leftGoal = new HitBox(-GAME_WIDTH , 0, 1, GAME_HEIGHT * 2, BOUND_DEPTH);
const rightGoal = new HitBox(GAME_WIDTH, 0, 1, GAME_HEIGHT * 2, BOUND_DEPTH); 
const leftPaddle = new Paddle(-GAME_WIDTH + PADDLE_DISTANCE_FROM_GOAL , 0, randomColor());
const rightPaddle = new Paddle(GAME_WIDTH - PADDLE_DISTANCE_FROM_GOAL, 0, randomColor());
const balls = [];
balls.push(new Ball(0,0,2, 0, randomColor()))
var   leftPlayerScore = 0;
var   rightPlayerScore = 0;

leftGoal.draw();
rightGoal.draw();
roof.draw();
floor.draw();
//rightPaddle.activateAI(rightGoal);
//leftPaddle.HitBox.draw();
//rightPaddle.HitBox.draw();
setUpScene();

function score(side){
	if (side === "left")
		leftPlayerScore++;
	else if (side === "right")
		rightPlayerScore++;

	document.getElementById('leftPlayerScore').textContent = 'Left Player: ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = 'Right Player: ' + rightPlayerScore;	
}

function setCamera(){

}

function setBall(n){
	if (n > balls.length){
		const numberOfNewBall = n - balls.length;
		for (let i = 0; i < numberOfNewBall; i++) {
			balls.push(new Ball(0,0,randomValue(), randomValue(), randomColor()));
		}
	}
	else if (n < balls.length){
		const numberOfBallsToRemove = balls.length - n;
		for (let i = balls.length ; i > n; i++) {
			balls[i].cleanup();
		}
		balls.splice(0, numberOfBallsToRemove);
	}
}

function update(){
	for (let i = 0; i < balls.length; i++) {
		balls[i].update();
	}
	leftPaddle.update();
	rightPaddle.update();
	renderer.render(scene, camera)
	requestAnimationFrame(update);
}



document.addEventListener('keydown', function(event) {
	console.log(event.key);
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

});

document.addEventListener('keyup', function(event) {
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
});

function randomValue() {
    return Math.random() * 2 - 1;
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

var slider = document.getElementById("mySlider");
var output = document.getElementById("sliderValue");
output.innerHTML = slider.value;

slider.oninput = function() {
	output.innerHTML = this.value;
	setBall(this.value);
}

update();