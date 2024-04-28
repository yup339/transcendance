const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

class HitBox{
	constructor(x,y, width, length) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.length = length;
	}

	doesCollide(hitBox) {
        if (this.x < hitBox.x + hitBox.width &&
            this.x + this.width > hitBox.x &&
            this.y < hitBox.y + hitBox.length &&
            this.y + this.length > hitBox.y) {
            return true;
        } else {
            return false;
        }
    }

	setPosition(x,y){
		this.x = x;
		this.y = y;
	}

	draw(){
		context.strokeStyle = 'yellow'; 
        context.lineWidth = 1; 
        context.strokeRect(this.x, this.y, this.width, this.length); 
	}
}

class Ball {
	constructor(color) {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.radius = canvas.width * 0.01;
		this.color = color;
		this.velocityX = 2;
		this.velocityY = 2;
		this.HitBox = new HitBox(this.x, this.y ,this.radius * 2,this.radius * 2);
	}

	draw() {
		context.beginPath();
		context.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
		context.fillStyle = this.color;
		context.fill();
		context.closePath();
		//this.HitBox.draw()
	}

	reset(side){
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.velocityX = 2 * side;
		this.velocityY = 2;
		this.HitBox.setPosition(this.x, this.y)
	}

	update(){
		if (this.HitBox.doesCollide(leftPaddle.HitBox) || this.HitBox.doesCollide(rightPaddle.HitBox))
			this.velocityX *= -1;
		if (this.HitBox.doesCollide(roof) || this.HitBox.doesCollide(floor))
			this.velocityY *= -1
		if (this.HitBox.doesCollide(leftGoal)){
			score("right");
			this.reset(1);
			return;
		} else if (this.HitBox.doesCollide(rightGoal)){
			score("left");
			this.reset(-1);
			return;
		}
			

		this.x += this.velocityX;
		this.y += this.velocityY;
		this.HitBox.setPosition(this.x, this.y)
	}
}

class Paddle {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.down = false;
		this.up = false;
		this.speed = canvas.height * 0.02;
		this.width = canvas.width * 0.01;
		this.height = canvas.height * 0.25;
		this.color = color;
		this.HitBox = new HitBox(this.x,this.y,this.width,this.height);
	}

	draw() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	update(){
		if(this.up && !this.down){
			if (this.y - this.speed > 0)
				this.y -= this.speed;
		}
		if(this.down && !this.up){
			if (this.y + this.height + this.speed < canvas.height)
				this.y += this.speed;
		}
		this.HitBox.setPosition(this.x,this.y)
	}
}


const roof = new HitBox(0, 0, canvas.width, 1);
const floor = new HitBox(0, canvas.height, canvas.width, 1);
const leftGoal = new HitBox(0, 0, 1, canvas.height);
const rightGoal = new HitBox(canvas.width, 0, 1, canvas.height); 
const leftPaddle = new Paddle(canvas.width * 0.05 , canvas.height / 2 - (canvas.height / 8), 'green');
const rightPaddle = new Paddle(canvas.width - (canvas.width * 0.05), canvas.height / 2 - (canvas.height / 8), 'blue');
const ball = new Ball('red');
var   leftPlayerScore = 0;
var   rightPlayerScore = 0;


function score(side){
	if (side === "left")
		leftPlayerScore++;
	else if (side === "right")
		rightPlayerScore++;

	document.getElementById('leftPlayerScore').textContent = 'Left Player: ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = 'Right Player: ' + rightPlayerScore;	
}

function draw(){
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);
	ball.draw();
	rightPaddle.draw();
	leftPaddle.draw();
	roof.draw();
	floor.draw();
}

function update(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	ball.update();
	leftPaddle.update();
	rightPaddle.update();
	draw();
	requestAnimationFrame(update);
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'w') {
        leftPaddle.up = true;
    }
	if (event.key === 's') {
        leftPaddle.down = true;
    }
});

document.addEventListener('keyup', function(event) {
	if (event.key === 'w') {
        leftPaddle.up = false;
    }
	if (event.key === 's') {
        leftPaddle.down = false;
    }
});




update();