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
		this.isJumping = false;
		this.isFalling = false;
		this.jumpSet = false;
		this.raycaster = new THREE.Raycaster(this.position, new THREE.Vector3(0, -1, 0), 0, 1);
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
}