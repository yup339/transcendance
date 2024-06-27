class Object
{
	constructor(mesh, x, y, position)
	{
		this.x = x;
		this.y = y;
		this.mesh = mesh;
		this.hitbox = new THREE.Box3().setFromObject(this.mesh);
		this.position = this.mesh.position;
		this.isRendered = false;
	}

	render(scene)
	{
		this.isRendered = true;
		scene.add(this.mesh);
	}

	remove(scene)
	{
		this.isRendered = false;
		scene.remove(this.mesh);
	}

	setPosition(position)
	{
		this.position = position;
		
	}

	doesCollide(hitbox)
	{

	}
}