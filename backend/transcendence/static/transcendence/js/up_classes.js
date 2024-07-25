class UpObject extends THREE.Mesh
{
	constructor(geometry, material, width, height)
	{
		super(geometry, material);
		this.width = width;
		this.height = height;
		this.nextPos = new THREE.Vector3(0, 0, 0);
		this.hitbox = new THREE.Box3().setFromObject(this);
		this.isRendered = false;
		this.jumpSpeed = -1;
		this.isJumping = false;
		this.isFalling = false;
		this.jumpSet = false;
		this.geometry.computeBoundingBox();
	}

	setHitbox()
	{
		this.hitbox = new THREE.Box3().setFromObject(this);
	}

	updatePos()
	{
		this.position.x += this.nextPos.x;
		this.position.y += this.nextPos.y;
		this.position.z += this.nextPos.z;
	}

	render(scene)
	{
		if (this.isRendered == false)
		{
			this.isRendered = true;
			scene.add(this);
		}
	}

	remove(scene)
	{
		if (this.isRendered == true)
		{
			this.isRendered = false;
			scene.remove(this);
		}
	}

	setPosition(x, y ,z)
	{
		this.position.set(x, y, z);
	}

	checkCollision(hitbox)
	{
		if (this.hitbox.intersectsBox(hitbox))
			return (true);
		return (false);
	}

	collisionResolution(object) // for adjusting movement after interaction with an object
	{
		let dirHitbox = new THREE.Box3().setFromObject(this);

		let yVector = new THREE.Vector3(0, this.nextPos.y, 0);
		let xVector = new THREE.Vector3(this.nextPos.x, 0, 0);

		dirHitbox.translate(yVector);
		if (dirHitbox.intersectsBox(object.hitbox))
		{
			if (this.nextPos.y < 0)
			{
				this.isFalling = false;
				this.jumpSpeed = -5;
			}
			else
			{
				this.jumpSpeed = 0;
			}

			//this.nextPos.y = 0;

			let curpos = new THREE.Box3().setFromObject(this);

			if (this.nextPos.y > 0)
				this.nextPos.y = object.hitbox.min.y - curpos.max.y - 0.01;
			else
				this.nextPos.y = object.hitbox.max.y - curpos.min.y + 0.01;
			
			return;
		}
		
		//dirHitbox.translate(this.nextPos.x, 0, 0);
		dirHitbox.translate(xVector);
		if (dirHitbox.intersectsBox(object.hitbox))
		{
			let curpos = new THREE.Box3().setFromObject(this);

			if (this.nextPos.x > 0)
				this.nextPos.x = object.hitbox.min.x - curpos.max.x - 0.01;
			else
				this.nextPos.x = object.hitbox.max.x - curpos.min.x + 0.01;
			return;
		}
	}

	serialize() {
		return JSON.stringify({
			type: 'playerPosition',
			x: this.position.x,
			y: this.position.y,
			side: socket.side
		});
	}
	
	deserialize(data) {
		this.position.x = data.x;
		this.position.y = data.y;
	}

	serializePlatform()
	{
		return ({
			type: 'platformPosition',
			x: this.position.x,
			y: this.position.y,
			width: this.width
		});
	}
}