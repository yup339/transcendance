Enumerator = {
	'paddle_touched': 0,
	'player_won': 1,
	'player_online_end': 2,
	'player_offline_end': 3,
}

class game_event {
	constructor(name, player) {
		this.name = name;
		this.player = player;
	}
	
	serialize() {
		return JSON.stringify({
			type: 'event',
			name: this.name,
			player: this.player
		});
	}
	
	deserialize(data) {
		if (data.type === 'event') {
			if (data.hasOwnProperty('name')) {
				this.name = data.name;
			}
			if (data.hasOwnProperty('player')) {
				this.player = data.player;
			}
		}
	}
}

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
		this.online = false;
	}

	snap(x, y){

		if (y == -1){
			this.HitBox.snapX(x, this.vec);
		}
		else {
			this.HitBox.snapY(y, this.vec);
		}
		this.y = this.HitBox.y;
		this.x = this.HitBox.x;
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

	setOnline(){
		this.online = true;
	}

	update(magnitude){
		if(game_stop)
		{
			return ;
		}
		
		if (this.HitBox.doesCollide(leftPaddle.HitBox, magnitude)){
			this.vec.y =  leftPaddle.getImpactVector(this.y);
			this.vec.x *= -1;
			this.updateSpeed();
			this.snap((leftPaddle.HitBox.x + (leftPaddle.HitBox.width / 2 + this.radius)), -1);
			this.HitBox.disable();
			leftPaddle.disableHitbox();
			if (this.online && socket.side === 'left') 
				socket.sendInfo(this.serialize());
		}
		if(this.HitBox.doesCollide(rightPaddle.HitBox, magnitude)){
			this.vec.y =  rightPaddle.getImpactVector(this.y);
			this.vec.x *= -1;
			this.updateSpeed()
			this.snap(rightPaddle.HitBox.x - (rightPaddle.HitBox.width / 2 + this.radius), -1);			
			this.HitBox.disable();
			rightPaddle.disableHitbox();
			if (this.online && socket.side === 'right')
				socket.sendInfo(this.serialize());
		}
		if (this.HitBox.doesCollide(roof, magnitude)){
			this.vec.y *= -1;
			this.snap(-1, roof.y - ((roof.length / 2) + this.radius));			
		}
		if (this.HitBox.doesCollide(floor, magnitude)){
			this.vec.y *= -1;
			this.snap(-1, floor.y + ((floor.length / 2) + this.radius));
		}

			//this.velocityY *= -1;
		if (this.HitBox.doesCollide(leftGoal, magnitude)){
				score("right");
				this.vec.x *= -1;
				this.reset(1);

			if (this.online && socket.side === 'left'){
				socket.sendInfo(JSON.stringify({"type" : "scorePoint", "group" : socket.group, "side" : "right"}));
				socket.sendInfo(this.serialize());}
			return;
		} else if (this.HitBox.doesCollide(rightGoal, magnitude)){
				score("left");
				this.vec.x *= -1;
				this.reset(-1);
			if (this.online && socket.side == 'right'){
				socket.sendInfo(JSON.stringify({"type" : "scorePoint", "group" : socket.group, "side" : "left"}));
				socket.sendInfo(this.serialize());}
			return;
		}
			

		this.x += this.vec.x * magnitude;
		this.y += this.vec.y * magnitude;


		this.HitBox.setPosition(this.x, this.y);
		this.light.position.set( this.x, this.y, 0);
		this.sphereMesh.position.set(this.x,this.y, 0);
	}

	deserialize(data) {
        if (data.type === 'ballPositionSync') {
            if (data.hasOwnProperty('x')) {
                this.x = data.x;
            }
            if (data.hasOwnProperty('y')) {
                this.y = data.y;
            }
            if (data.hasOwnProperty('dx')) {
                this.vec.y = data.dy;
            }
            if (data.hasOwnProperty('dx')) {
                this.vec.x = data.dx;
            }
		}
	}

	serialize() {
        return JSON.stringify({
        	type: 'ballPosition',
            x: this.x,
			y: this.y,
			dx: this.vec.x,
			dy: this.vec.y,
			group: socket.group
        });
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


class HitBox{
	constructor(x,y, width, length, depth) {
		this.x = x;
		this.y = y;
        this.depth = depth;
		this.width = width;
		this.length = length;
        const geometry = new THREE.BoxGeometry(this.width,this.length ,this.depth , 1, 1, 1);
        const material = new THREE.MeshStandardMaterial( { color: wallcolorforbillythekid} );
        material.wireframeLinewidth = 5;
        this.model = new THREE.Mesh( geometry, material );
        this.model.position.set(this.x,this.y, 1)
        this.isAble = true;
	}

	snapX(newX, directionVector) {
		const slope = directionVector.y / directionVector.x;
	
		this.y = slope * (newX - this.x) + this.y;
	
		this.x = newX;
	
		this.model.position.set(this.x, this.y, 1);
	}

	snapY(newY, directionVector) {
		// Calculate the direction vector's slope (dx/dy)
		const slope = directionVector.x / directionVector.y;
	
		// Calculate the new X position based on the slope and the new Y position
		this.x = slope * (newY - this.y) + this.x;
	
		// Update the Y position
		this.y = newY;
	
		// Update the model's position in the scene
		this.model.position.set(this.x, this.y, 1);
	}

    doesCollide(hitBox, magnitude) {
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


class PongAi {
    constructor(paddle, goal, ball,){
		this.ball = ball;
        this.paddle = paddle;
        this.goal = goal;
        this.expectedCollision = 0;
		this.resetPos = goal.x;
    }

    getBallPosition(){
		if(game_stop)
			return ;
		this.ball = getClosestBall(this.paddle.x);
		this.posX = this.ball.x;
		this.posY = this.ball.y;
        this.vec = new THREE.Vector2(this.ball.vec.x, this.ball.vec.y);
		this.expectedCollision = this.calcCollision();
    }
	
	calcCollision(){
		this.vec.normalize();
		this.calcFirstRebound();
		var slope = this.vec.y/ this.vec.x;
		return slope * (this.paddle.x - this.posX) + this.posY;
	}

	doesImpactY(impactLine, limit) {
		if (this.vec.x >= impactLine.x - limit && this.vec.x <= impactLine.x + limit) {
			return true;
		} else {
			return false; 
		}
	}

	calcFirstRebound(){
		if (this.vec.y < 0){
			if (this.doesImpactY(floor.y)){

				this.posX = this.posX + (this.vec.x / this.vec.y) * (floor.y - this.posY)
				this.posY = floor.y;
				this.vec.y *= -1;
			}
		} else{
			if (this.doesImpactY(roof.y)){
				this.posX = this.posX + (this.vec.x / this.vec.y) * (roof.y - this.posY)
				this.posY = roof.y;
				this.vec.y *= -1;
			}
		}
	}

    update(){
		if (this.expectedCollision < this.paddle.y){
			this.paddle.down = false;
            this.paddle.up = true;
        }
        if (this.expectedCollision > this.paddle.y){
			this.paddle.up = false;
            this.paddle.down = true;
        }
		if (Math.abs(this.expectedCollision - this.paddle.y) <= 5)
		{
			this.paddle.up = false;
			this.paddle.down = false;
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
		this.online = false;
	}

	setOnline(){
		this.online = true;
	}

	draw() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	deserialize(data) {
        if (data.type === 'paddlePositionSync') {
            if (data.hasOwnProperty('x')) {
                this.x = data.x;
            }
            if (data.hasOwnProperty('y')) {
                this.y = data.y;
            }
            if (data.hasOwnProperty('down')) {
                this.down = data.down;
            }
            if (data.hasOwnProperty('up')) {
                this.up = data.up;
            }
		}
	}

	serialize() {
        return JSON.stringify({
            type: 'paddlePosition',
            x: this.x,
			y: this.y,
			down: this.down,
			up: this.up,
			side: socket.side,
			group: socket.group
        });
    }

	update(magnitude){
		if(game_stop)
			return ;
		if (this.aiActive)
			this.ai.update();
		if(this.up && !this.down){
			if (!this.HitBox.doesCollide(floor, magnitude))
				this.y -= this.speed * magnitude;
		}
		if(this.down && !this.up){
			if (!this.HitBox.doesCollide(roof, magnitude))
				this.y += this.speed * magnitude;
		}
		this.HitBox.setPosition(this.x,this.y)
		this.model.position.set(this.x, this.y , 0);
		if (this.online){
			socket.sendInfo(this.serialize());
		}
	}

	getImpactVector(y) {
		const MAX_ANGLE = 3;
		var hitPosition = (y - this.y) / (this.height/2);
		var maxAngle = Math.PI / MAX_ANGLE; 
		var minAngle = -Math.PI / MAX_ANGLE; 
		var impactAngle = hitPosition * (maxAngle - minAngle) / 2;
		var dy = Math.sin(impactAngle);	
	
		return dy * BALL_SPEED;
	}

	activateAI(goal, ball){
		this.aiActive = true;
		this.ai = new PongAi(this, goal, ball);
		this.aiIntervalId = setInterval(() => this.ai.getBallPosition(), 1000);
	}

	deactivateAI() {
	
		this.aiActive = false;
		clearInterval(this.aiIntervalId);
	}

	changeColor(color){
		this.model.material.color.set(color);
	}

	disableHitbox(){
		this.HitBox.disable();
	}

	remove(){
        scene.remove(this.model)
	}
	
}