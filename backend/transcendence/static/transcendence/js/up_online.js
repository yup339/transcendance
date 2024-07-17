function gameReady()
{
    document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
    console.log("GAME READY");
    // updateUpGame();
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

function startUpOnline(data)
{
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
	stop = false;
	lastTime = performance.now();
	startTime = lastTime;
	if (data.side == 'left')
	{
		console.log("left")
		generateLevelOnline();
		onlineUpdate(data.side)
	}
	else{
		console.log("trash side")
		onlineUpdate(data.side);
	}
}

function prepareOnline()
{
	uponline = true;

	// prepareUpGame();
	upcanvas = document.getElementById('UpCanvas');
	// set up cameras
	for (let i = 0; i < views.length; ++i)
	{
		const view = views[i];
		const camera = new THREE.PerspectiveCamera(50, upcanvas.width/upcanvas.height, 0.1, 500);
		camera.position.fromArray(view.position);
		view.camera = camera;
	}

	setGlobals();

	upscene = new THREE.Scene();
	uprenderer = new THREE.WebGLRenderer({canvas: upcanvas});
	uprenderer.setSize(upcanvas.width, upcanvas.height);

	//players
	let geometry = new THREE.BoxGeometry(1, 1, 1);
	let material = new THREE.MeshStandardMaterial({color: 0xF8B7EE});
	players[0] = new UpObject(geometry, material, 1, 1);
	players[0].position.set(0, 0.2, 0);
	upscene.add(players[0]);
	
	let material2 = new THREE.MeshStandardMaterial({color: 0xC1F7B0});
	players[1] = new UpObject(geometry, material2, 1, 1);
	players[1].position.set(30, 0.2, 0);
	upscene.add(players[1]);
	
	//light
	let geo = new THREE.SphereGeometry(1, 32, 16);
	let mat = new THREE.MeshBasicMaterial({color: 0x404040});
	light1 = new THREE.PointLight(0x404040, 10, 50);
	light1.position.set( 0, 14, 5 );
	upscene.add(light1);
	
	
	//light for player 2
	light2 = new THREE.PointLight(0x404040, 10, 50);
	light2.position.set( 30, 14, 5 );
	upscene.add(light2);

	//add starting platform
	geometry = new THREE.BoxGeometry(15, 1, 5);
	material = new THREE.MeshStandardMaterial( { color: 0x7377ff } );
	let startPlat = new UpObject(geometry, material);
	let startPlat2 = new UpObject(geometry, material);
	startPlat.position.set(0, -1, 0);
	startPlat2.position.set(30, -1, 0);
	startPlat.render(upscene);
	startPlat2.render(upscene);
	objects.push(startPlat);
	objectsp2.push(startPlat2);

	renderUp();

	socket = new UpSocket()
}

function onlineUpdate(side)
{
	
	requestId = undefined;
	if (!requestId)
	requestId = requestAnimationFrame(updateUpGame);
	printPerSecond();
	if (stop)
	{
		upStop();
		return ;
	}

	if (second >= 60)
	{
		stop = true;
		console.log("Game Over");
	}

	// delta time
	// let elapsedTime = (performance.now() - lastTime) / 1000;
	// lastTime = performance.now();
	elapsedTime = 1/60.0;
	
	let i;
	if (side == 'left')
		i = 0;
	else
		i = 1;

	playerController(i);
	renderUp();
}

function playerController(i, elapsedTime)
{
	players[i].nextPos.set(0, 0, 0);

	if (keys[65]) // a 
	{
		if (players[i].position.x > -7)
			players[i].nextPos.x -= playerSpeed * elapsedTime;
	}
	if (keys[68]) // d 
	{
		if (players[i].position.x < 7)
			players[i].nextPos.x += playerSpeed * elapsedTime;
	}
	if (keys[87] && players[i].isJumping == false && players[i].isFalling == false) // w
	{
		players[i].isFalling = true;
		players[i].isJumping = true;
		players[i].jumpSet = false;
		jumpCount1 += 1;
	}

	jumpLogicOnline(i, elapsedTime);
}

function jumpLogicOnline(i, elapsedTime)
{
	if (players[i].isJumping)
	{
		players[i].isJumping = false;
		if (!players[i].jumpSet)
		{
			players[i].jumpSpeed = 30;
			players[i].jumpSet = true;
		}
	}
	if (players[i].isFalling)
	{
		if (!players[i].jumpSet)
		{
			players[i].jumpSpeed = 0;
			players[i].jumpSet = true;
		}
		players[i].nextPos.y += players[i].jumpSpeed * elapsedTime;
		
		if (players[i].jumpSpeed > -50)
			players[i].jumpSpeed -= 1;

	}
	else
	{
		players[i].jumpSet = false;
	}
}

function checkCollisionOnline(i)
{
	players[i].hitbox.setFromObject(players[i]);
	players[i].hitbox.translate(players[i].nextPos);

	let currentPlatform = Math.floor((players[i].position.y + 3) / 6);
	if (i == 0)
	{
		if (players[i].checkCollision(objects[currentPlatform].hitbox))
		{
			players[i].collisionResolution(objects[currentPlatform]);
		}

		if (players[i].position.x - 0.5 > objects[currentPlatform].position.x + objects[currentPlatform].width/2 ||
			players[i].position.x + 0.5 < objects[currentPlatform].position.x - objects[currentPlatform].width/2)
		{
			players[i].jumpTime = performance.now();
			players[i].isFalling = true;
		}
	}
	else
	{
		if (players[i].checkCollision(objectsp2[currentPlatform].hitbox))
		{
			players[i].collisionResolution(objectsp2[currentPlatform]);
		}

		if (players[i].position.x - 0.5 > objectsp2[currentPlatform].position.x + objectsp2[currentPlatform].width/2 ||
			players[i].position.x + 0.5 < objectsp2[currentPlatform].position.x - objectsp2[currentPlatform].width/2)
		{
			players[i].jumpTime = performance.now();
			players[i].isFalling = true;
		}
	}

	players[i].updatePos();
	updateStats();
}