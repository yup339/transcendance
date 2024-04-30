

class Ball {
	constructor(color) {
		this.x = GAME_WIDTH / 2;
		this.y = GAME_HEIGHT / 2;
		this.radius = 3;
		const SphereGeometry = new THREE.SphereGeometry(this.radius , 128, 128);
		const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000}); // Red color
		this.sphereMesh = new THREE.Mesh(SphereGeometry, sphereMaterial);
		this.sphereMesh.position.set(this.x,this.y, 1)
		scene.add(this.sphereMesh)
		this.color = color;
		this.velocityX = 1;
		this.velocityY = 1;
		this.HitBox = new HitBox(this.x, this.y ,this.radius * 2,this.radius * 2, this.radius * 2);
	}

	draw() {
		
	}

	reset(side){
		this.x = GAME_WIDTH / 2;
		this.y = GAME_HEIGHT / 2;
		this.velocityX = 2 * side;
		this.velocityY = 2;
		this.HitBox.setPosition(this.x, this.y)
		this.sphereMesh.position.set(this.x,this.y, 0)
	}

	update(){
		if (this.HitBox.doesCollide(leftPaddle.HitBox) || this.HitBox.doesCollide(rightPaddle.HitBox))
			this.velocityX *= -1;
		if (this.HitBox.doesCollide(roof) || this.HitBox.doesCollide(floor))
			this.velocityY *= -1
		if (this.HitBox.doesCollide(leftGoal)){
			score("right");
			this.velocityX *= -1;
			this.reset(1);
			return;
		} else if (this.HitBox.doesCollide(rightGoal)){
			score("left");
			this.velocityX *= -1;
			this.reset(-1);
			return;
		}
			

		this.x += this.velocityX;
		this.y += this.velocityY;
		this.HitBox.setPosition(this.x, this.y)
		this.sphereMesh.position.set(this.x,this.y, 0)
	}
}