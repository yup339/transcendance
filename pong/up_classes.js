class Object
{
	constructor(mesh, x, y, color)
	{
		this.x = x;
		this.y = y;
		this.mesh = mesh;
		this.box3 = new THREE.Box3().setFromObject(this.mesh);
	}
}