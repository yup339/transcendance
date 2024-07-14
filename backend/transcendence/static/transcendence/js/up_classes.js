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
		this.jumpCount = 0;
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

function deserializePlatform(data)
{
	//console.log("je suis une fonction pas faites snif snif snif sad face");
	//console.log("je vais travailler sur la fonction un peu, assez de snif snif sad face par ici")

	let platformPos = data.pos;
	let geometry;
	let material = new THREE.MeshStandardMaterial({color: 0x7377ff});

	for (let i = 0; i < platformPos.length; i++)
	{
		geometry = new THREE.BoxGeometry(platformPos[i].width, 1, 5);
		objects[i + 1] = new UpObject(geometry, material, platformPos[i].width, 1);
		objects[i + 1].position.set(platformPos[i].x, platformPos[i].y, 0);
		objectsp2[i + 1] = new UpObject(geometry, material, platformPos[i].width, 1);
		objectsp2[i + 1].position.set(platformPos[i].x + 30, platformPos[i].y, 0);
		objects[i + 1].setHitbox();
		objectsp2[i + 1].setHitbox();
		upscene.add(objects[i + 1]);
		upscene.add(objectsp2[i + 1]);
	}
	renderUp();
	socket.sendInfo(JSON.stringify({type: "gameReady"}))
}