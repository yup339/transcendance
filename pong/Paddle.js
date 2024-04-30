


class Paddle {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.down = false;
		this.up = false;
		this.speed = 1;
		const width = 5;
		this.height = 35;
		const depth = 5;
		this.color = color;
		this.HitBox = new HitBox(this.x,this.y,width,this.height, depth);
		const geometry = new THREE.BoxGeometry(width,this.height ,depth);
        const material = new THREE.MeshBasicMaterial( { color: 0x8a42f5 } );
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
}