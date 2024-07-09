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
		this.castShadow = true; //TODO: make sure renderer does shadows
		this.jumpSpeed = -1;
		this.isJumping = false;
		this.isFalling = false;
		this.jumpSet = false;
		this.jumpTimer = 0;
		this.raycaster = new THREE.Raycaster(this.position, new THREE.Vector3(0, -1, 0), 0, 1);
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
		let newPos = new THREE.Vector3()
		
		dirHitbox.translate(this.nextPos.x, 0, 0);
		if (dirHitbox.intersectsBox(object.hitbox))
		{
			// console.log("min in", this.dirHitbox.min);
			this.nextPos.x = 0;
		}

		dirHitbox.translate(-this.nextPos.x, this.nextPos.y, 0);
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
			this.nextPos.y = 0;
		}
		
		dirHitbox.translate(this.nextPos.x, 0, 0);
		if (dirHitbox.intersectsBox(object.hitbox))
		{
			this.nextPos.x = 0;
			this.nextPos.y = 0;
			return;
		}
	}
}