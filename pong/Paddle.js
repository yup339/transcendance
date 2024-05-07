var previousX = 0;
var newX = 0;
var previousY = 0;
var newY = 0;

class PongAi {
    constructor(paddle, goal){
        this.paddle = paddle;
        this.goal = goal;
        this.expectedCollision = 0;
    }

    getBallPosition(){
        previousX = newX;
        previousY = newY;
        newX = ball[0].x;
        newY = ball[0].y;
        this.expectedCollision = this.calcCollision();
    }
	
	calcCollision(){
			const slope = (newY - previousY) / (newX - previousX);
			const y = slope * (this.paddle.x - previousX) + previousY;
			return (GAME_HEIGHT % y) - GAME_HEIGHT/2;
		}



    update(){
        if (this.expectedCollision > this.paddle.y){
			this.paddle.down = false;
            this.paddle.up = true;
        }
        if (this.expectedCollision < this.paddle.y){
			this.paddle.up = false;
            this.paddle.down = true;
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
	
		var maxAngle = Math.PI / 1; 
		var minAngle = -Math.PI / 1; 
	
		var impactAngle = minAngle + (hitPosition * (maxAngle - minAngle));
	
		var dy = Math.sin(impactAngle);	
		dy = dy * -2;
		return dy;
	}

	activateAI(goal){
		this.aiActive = true;
		this.ai = new PongAi(this, goal);
		setInterval(() => this.ai.getBallPosition(), 1000);
	}

	changeColor(color){
		this.model.material.color.set(color);
	}

	disableHitbox(){
		this.HitBox.disable();
	}
}