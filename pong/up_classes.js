class UpObject extends THREE.Mesh
{
	constructor(geometry, material)
	{
		super(geometry, material);
		this.nextPos = new THREE.Vector3(this.position);
		this.isRendered = false;
	}

	setHitbox()
	{
		this.hitbox = new THREE.Box3().setFromObject(this);
	}

	updatePos()
	{
		this.mesh.position = this.nextPos;
	}

	updateNextPos(position)
	{
		this.nextPos.set(position);
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

	setPosition(position)
	{
		if (position != this.position)
			this.position.set(position);
	}
}

class Player
{
	constructor(geometry, material)
	{
		this.obj = new Object(geometry, material);
	}

	doesCollide()
	{
		for (let i = 0; i < platforms.length; i++)
		{
			if (platforms.hitbox.intersectsBox(this.obj.hitbox) == true)
				return (true);

		}
		return (false);
	}

	update()
	{
		this.nextPos = this.obj.mesh.position;
	}
}