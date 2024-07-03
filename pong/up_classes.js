class UpObject extends THREE.Mesh
{
	constructor(geometry, material, height)
	{
		super(geometry, material);
		this.height = height;
		this.nextPos = new THREE.Vector3(0, 0, 0);
		this.hitbox = new THREE.Box3().setFromObject(this);
		this.isRendered = false;
		this.castShadow = true;
	}

	setRaycast()
	{
		
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
		this.position.x += this.nextPos.x;
		this.position.y += this.nextPos.y;
		this.position.z += this.nextPos.z;
	}

	update()
	{
		
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