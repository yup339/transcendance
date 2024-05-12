const colorPicker = document.getElementById('colorPicker'); // assuming you have an input element with id 'colorPicker'
const colorBox = document.getElementById('colorBox'); // assuming you have a div element with id 'colorBox'

var BALL_SPEED = 1;

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

function handleColorPicked(event) {
	const color = event.target.value;
	colorBox.style.backgroundColor = color;
	for (let i = 0; i < balls.length; i++) {
		balls[i].changeColor(color);
	}
}

colorPicker.addEventListener('input', handleColorPicked); //<------------event


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