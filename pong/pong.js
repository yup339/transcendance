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
const leftPaddle = new Paddle(-GAME_WIDTH + PADDLE_DISTANCE_FROM_GOAL , 0, 0x88ff7a);
const rightPaddle = new Paddle(GAME_WIDTH - PADDLE_DISTANCE_FROM_GOAL, 0, 0x88ff7a);
const ball = new Ball('red');
var   leftPlayerScore = 0;
var   rightPlayerScore = 0;

leftGoal.draw();
rightGoal.draw();
roof.draw();
floor.draw();
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
function update(){
	ball.update();
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


update();