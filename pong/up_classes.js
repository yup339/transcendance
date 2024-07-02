class UpObject extends THREE.Mesh
{
	constructor(geometry, material)
	{
		super(geometry, material);
		this.nextPos = this.position;
		this.isRendered = false;
		this.castShadow = true;
	}

	setHitbox()
	{
		this.hitbox = new THREE.Box3().setFromObject(this);
	}

	printPos()
	{

	}

	updatePos()
	{
		this.position.set(this.nextPos.x, this.nextPos.y, this.nextPos.z);
	}

	update()
	{
		this.hitbox = new THREE.Box3().setFromObject(this);
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
		if (this.hitboxSet)
		{
			if (this.hitbox.intersectsBox(hitbox))
				return (true);
		}
		return (false);
	}
}