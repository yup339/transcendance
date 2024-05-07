class HitBox{
	constructor(x,y, width, length, depth) {
		this.x = x;
		this.y = y;
        this.depth = depth;
		this.width = width;
		this.length = length;
        const geometry = new THREE.BoxGeometry(this.width,this.length ,this.depth , 1, 1, 1);
        const material = new THREE.MeshStandardMaterial( { color: randomColor()} );
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
    
        // Check for collision
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
