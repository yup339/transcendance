


class Paddle {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.down = false;
		this.up = false;
		this.speed = 1.5;
		const width = 5;
		this.height = 35;
		const depth = 5;
		this.color = color;
		this.HitBox = new HitBox(this.x,this.y,width,this.height, depth);
		const geometry = new THREE.BoxGeometry(width,this.height ,depth);
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
		if(this.up && !this.down){
			if (!this.HitBox.doesCollide(floor))
			this.y -= this.speed;
		}
		if(this.down && !this.up){
			console.log(this.HitBox.doesCollide(floor));
			if (!this.HitBox.doesCollide(roof))
				this.y += this.speed;
		}
		this.HitBox.setPosition(this.x,this.y)
		this.model.position.set(this.x, this.y , 0);
	}

	getImpactVector(y) {
		var hitPosition = (y - this.y) / (this.height * 2);
		console.log("hitPosition:", hitPosition);
	
		var maxAngle = Math.PI / 1; 
		var minAngle = -Math.PI / 1; 
	
		var impactAngle = minAngle + (hitPosition * (maxAngle - minAngle));
		console.log("impactAngle:", impactAngle);
	
		var dy = Math.sin(impactAngle);
		console.log("dy:", dy);
	
		dy = dy * -7;
		return dy;
	}

}