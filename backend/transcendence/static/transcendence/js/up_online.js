function gameReady()
{
    document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
	stop = false;
	startTime = performance.now();
    console.log("GAME READY FOR BOTH PLAYER");

	const onscreenTimer = document.getElementById("gameTime");
	onscreenTimer.textContent = count;
	//Make names appear
	if(currentSide == 'left'){
		const name1 = document.getElementById("namePlayer1");
		name1.textContent = user.username;
		name1.style.color = 'lightgreen';
		const name2 = document.getElementById("namePlayer2");
		name2.textContent = "opponent";
		name2.style.color = 'lightpink';
	}
	else if(currentSide){
		const name1 = document.getElementById("namePlayer1");
		name1.textContent = "opponent";
		name1.style.color = 'lightgreen';
		const name2 = document.getElementById("namePlayer2");
		name2.textContent = user.username;
		name2.style.color = 'lightpink';
	}

	countdownOnline();
}

function countdownOnline()
{
	requestId = undefined;
	if (!requestId)
	{
		requestId = requestAnimationFrame(countdownOnline);
	}
	if (count < 1)
	{
		console.log("countdown over");
		cancelAnimationFrame(requestId);
		second = 0;
		startTime = performance.now();
		onlineUpdate(currentSide);
		return;
	}

	let currentTime = performance.now();
	let showTime = Math.floor((currentTime - startTime) / 1000);
	
	if (showTime != second)
	{
		console.log(count);
		count -= 1;
		second = showTime;
	}
	const onscreenTimer = document.getElementById("gameTime");
	onscreenTimer.textContent = count;
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
	socket.sendInfo(JSON.stringify({type: "gameReady"}))

	renderUp();
}

function updatePosition(data)
{
	if (stop)
	{
		upStop();
		return ;
	}

	if (data.side == 'left')
	{
		players[0].deserialize(data);
	}
	else
	{
		players[1].deserialize(data);
	}
}

function startUpOnline(data) // separation of 2 players
{
	currentSide = data.side;
	if (data.side == 'left')
	{
		console.log("Generating level...");
		generateLevelOnline();
	}
}

function prepareOnline()
{
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
	
	//lights
	let geo = new THREE.SphereGeometry(1, 32, 16);
	let mat = new THREE.MeshBasicMaterial({color: 0x404040});
	light1 = new THREE.PointLight(0x404040, 10, 50);
	light1.position.set( 0, 14, 5 );
	upscene.add(light1);
	
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
	startPlat.setHitbox();
	startPlat2.setHitbox();


	renderUp();

	socket = new UpSocket()
}

function generateLevelOnline()
{
	let platform;
	let material = new THREE.MeshStandardMaterial( { color: 0x7377ff } );
	let y = 5; 
	for (let i = 0; i < 100; i++)
	{
		if (y < 50)
			platform = new UpObject(platformsGeo[0], material, 5, 1);
		else if (y < 100)
			platform = new UpObject(platformsGeo[1], material, 4, 1);
		else if (y < 150)
			platform = new UpObject(platformsGeo[2], material, 3, 1);
		else if (y < 200)
			platform = new UpObject(platformsGeo[3], material, 2, 1);
		else if (y < 250)
			platform = new UpObject(platformsGeo[4], material, 1, 1);
		else
			platform = new UpObject(platformsGeo[5], material, 0.5, 1);

		platform.position.x = GetRandomInt(-5, 5);
		if (y > 150 && Math.max(platform.position.x, objects[i-1].position.x) - Math.min(platform.position.x, objects[i-1].position.x) > 5)
		{
			if (platform.position.x > objects[i-1].position.x)
				platform.position.x -= 5;
			else
				platform.position.x += 5;
		}
		platform.position.y = y;
		y += 6;
		objects.push(platform);
		platform.render(upscene);
	}
	
	let platformJSON = [];
	for (let i = 1; i < objects.length; i++) // clone objects for player 2
	{
		objectsp2[i] = objects[i].clone();
		objectsp2[i].height = objects[i].height;
		objectsp2[i].width = objects[i].width;
		objectsp2[i].position.x += 30;
		objects[i].setHitbox();
		objectsp2[i].setHitbox();
		platformJSON.push(objects[i].serializePlatform());
		objectsp2[i].render(upscene);
	}
	socket.sendInfo(JSON.stringify(platformJSON));
	renderUp();
}

function onlineUpdate(side)
{
	if (!currentSide)
		currentSide = side;
	requestId = undefined;
	if (!requestId)
		requestId = requestAnimationFrame(onlineUpdate);
	printPerSecond();
	
	if (second >= 60)
	{
		console.log("Game Over");
		const onscreenTimer = document.getElementById("gameTime");
		onscreenTimer.textContent = 0;
		upStop();
		return ;
	}

	// delta time
	// let elapsedTime = (performance.now() - lastTime) / 1000;
	// lastTime = performance.now();
	elapsedTime = 1/60.0;

	playerController(currentSide, elapsedTime);
	renderUp();
	updateOnScreen();
}

function playerController(side, elapsedTime)
{
	if (side == 'left')
	{
		players[0].nextPos.set(0, 0, 0);
	
		if (keys[65] || keys[37]) // a 
		{
			if (players[0].position.x > -7)
				players[0].nextPos.x -= playerSpeed * elapsedTime;
		}
		if (keys[68] || keys[39]) // d 
		{
			if (players[0].position.x < 7)
				players[0].nextPos.x += playerSpeed * elapsedTime;
		}
		if ((keys[87] || keys[38]) && players[0].isJumping == false && players[0].isFalling == false) // w
		{
			players[0].isFalling = true;
			players[0].isJumping = true;
			players[0].jumpSet = false;
			jumpCount1 += 1;
		}
	}
	else
	{
		players[1].nextPos.set(0, 0, 0);
	
		if (keys[65]) // a 
		{
			if (players[1].position.x > -7 + 30)
				players[1].nextPos.x -= playerSpeed * elapsedTime;
		}
		if (keys[68]) // d 
		{
			if (players[1].position.x < 7 + 30)
				players[1].nextPos.x += playerSpeed * elapsedTime;
		}
		if (keys[87] && players[1].isJumping == false && players[1].isFalling == false) // w
		{
			players[1].isFalling = true;
			players[1].isJumping = true;
			players[1].jumpSet = false;
			jumpCount2 += 1;
		}
	}

	jumpLogicOnline(side, elapsedTime);
	checkCollisionOnline(side);
}

function jumpLogicOnline(side, elapsedTime)
{
	let i;
	if (side == 'left')
		i = 0;
	else
		i = 1;

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

function checkCollisionOnline(side)
{
	let i;
	if (side == 'left')
		i = 0;
	else
		i = 1;

	players[i].setHitbox();
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
	if (players[i].nextPos != new THREE.Vector3(0, 0, 0))
	{
		socket.sendInfo(players[i].serialize());
	}
	updateStatsOnline(side);
}

function updateStatsOnline(side)
{
	if (players[0].position.y > distanceTravelled1)
		distanceTravelled1 = Math.floor(players[0].position.y);
	if (players[1].position.y > distanceTravelled2)
		distanceTravelled2 = Math.floor(players[1].position.y);
}