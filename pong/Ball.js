

class Ball {
	constructor(color) {
		this.x = GAME_WIDTH / 2;
		this.y = GAME_HEIGHT / 2;
		this.color = color;
		this.radius = 3;
		const SphereGeometry = new THREE.SphereGeometry(this.radius , 128, 128);
		const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000}); // Red color
		this.sphereMesh = new THREE.Mesh(SphereGeometry, sphereMaterial);
		this.sphereMesh.position.set(this.x,this.y, 1)
		scene.add(this.sphereMesh)
		this.light = new THREE.PointLight( 0xffffff, 1, 0);
		this.light.castShadow = true;
		this.light.position.set( this.x, this.y, 0);
		scene.add(this.light)
		this.light.cast
		this.velocityX = 2;
		this.velocityY = 0;
		this.HitBox = new HitBox(this.x, this.y ,this.radius * 2,this.radius * 2, this.radius * 2);
	}

	draw() {
		
	}

	reset(side){
		this.x = 0;
		this.y = 0;
		this.velocityX = 4 * side;
		this.velocityY = 0;
		this.HitBox.setPosition(this.x, this.y)
		this.sphereMesh.position.set(this.x,this.y, 0)
	}

	update(){
		if (this.HitBox.doesCollide(leftPaddle.HitBox)){
			this.velocityY =  leftPaddle.getImpactVector(ball.y);
			this.velocityX *= -1;
		}

		if(this.HitBox.doesCollide(rightPaddle.HitBox)){
			this.velocityY =  rightPaddle.getImpactVector(ball.y);
			this.velocityX *= -1;
		}

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
		this.light.position.set( this.x, this.y, 0);
		this.sphereMesh.position.set(this.x,this.y, 0)
	}
}