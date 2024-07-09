function keysEvent(elapsedTime)
{
	players[0].nextPos.set(0, 0, 0);
	players[1].nextPos.set(0, 0, 0);

	// player 1 movement
	if (keys[65]) // a 
	{
		if (players[0].position.x > -7)
			players[0].nextPos.x -= playerSpeed * elapsedTime;
	}
	if (keys[68]) // d 
	{
		if (players[0].position.x < 7)
			players[0].nextPos.x += playerSpeed * elapsedTime;
	}
	if (keys[87] && players[0].isJumping == false && players[0].isFalling == false) // w
	{
		players[0].isFalling = true;
		players[0].isJumping = true;
		players[0].jumpSet = false;
		jumpCount1 += 1;
	}

	//TODO: REMOVE
	if (keys[32]) // space
	{
		players[0].position.y = 250
	}

	// player 2 movement
	if (keys[37]) // left
	{
		if (players[1].position.x > 30 - 7)
			players[1].nextPos.x -= playerSpeed * elapsedTime;
	}
	if (keys[39]) // right
	{
		if (players[1].position.x < 30 + 7)
			players[1].nextPos.x += playerSpeed * elapsedTime;
	}
	if (keys[38] && players[1].isJumping == false && players[1].isFalling == false) // up
	{
		players[1].isFalling = true;
		players[1].isJumping = true;
		players[1].jumpSet = false;
		jumpCount2 += 1;
	}

	jumpLogic(elapsedTime);
	checkCollision();
}

function checkCollision()
{
	let hit = false;
	let hit2 = false;

	players[0].hitbox.setFromObject(players[0]);
	players[0].hitbox.translate(players[0].nextPos);
	players[1].hitbox.setFromObject(players[1]);
	players[1].hitbox.translate(players[1].nextPos);
	
	// for (let i = 0; i < objects.length; i++)
	// {
	// 	if (players[0].checkCollision(objects[Math.floor((players[0].position.y + 3) / 6)].hitbox))
	// 	{
	// 		players[0].collisionResolution(objects[i])
	// 		console.log("player 1 hit");
	// 		hit = true;
	// 		break;
	// 	}
	// }
	// for (let i = 0; i < objectsp2.length; i++)
	// {
	// 	if (players[1].checkCollision(objectsp2[i].hitbox))
	// 	{
	// 		players[1].collisionResolution(objectsp2[i])
	// 		// console.log("player 2 hit");
	// 		hit2 = true;
	// 		break;
	// 	}
	// }

	//TODO: add checks for falling off platforms(the smart way), just check the x coordinate bozo

	let currentPlatform = Math.floor((players[0].position.y + 3) / 6);

	if (players[0].checkCollision(objects[currentPlatform].hitbox))
	{
		players[0].collisionResolution(objects[currentPlatform]);
		console.log("player 1 hit");
		hit = true;
	}

	currentPlatform = Math.floor((players[1].position.y + 3) / 6);	

	if (players[1].checkCollision(objectsp2[currentPlatform].hitbox))
	{
		players[1].collisionResolution(objectsp2[currentPlatform]);
		// console.log("player 2 hit");
		hit2 = true;
	}
	
	players[0].updatePos();
	players[1].updatePos();
	
	// players[0].raycaster.ray.origin.copy(players[0].position);
	// let intersections = players[0].raycaster.intersectObjects(objects);
	// if (intersections.length <= 0)
	// {
	// 	if (!hit)
	// 		players[0].isFalling = true;
	// }
	// players[1].raycaster.ray.origin.copy(players[1].position);
	// intersections = players[1].raycaster.intersectObjects(objectsp2);
	// if (intersections.length <= 0)
	// {
	// 	if (!hit2)
	// 		players[1].isFalling = true;
	// }

	updateStats();
}

function updateStats()
{
	if (players[0].position.y > distanceTravelled1)
		distanceTravelled1 = players[0].position.y;
	if (players[1].position.y > distanceTravelled2)
		distanceTravelled2 = players[1].position.y;
}

function jumpLogic(elapsedTime)
{
	// jump logic

	for (let i = 0; i < 2; i++)
	{
		if(players[i].isJumping)
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
}

function renderUp()
{
	// camera renders
	for (let i = 0; i < views.length; ++i)
	{
		const view = views[i];
		const camera = view.camera;
		const left = Math.floor(upcanvas.width * view.left);
		const bottom = Math.floor(upcanvas.height * view.bottom);
		const width = Math.floor(upcanvas.width * view.width);
		const height = Math.floor(upcanvas.height * view.height);
		uprenderer.setViewport(left, bottom, width, height);
		uprenderer.setScissor(left, bottom, width, height);
		uprenderer.setScissorTest(true);
		uprenderer.setClearColor(view.background);
		if (i == 0)
		{
			light1.position.y = players[0].position.y + 14;
			camera.position.y = players[0].position.y + 10; // update camera position depending on player position
		}
		else
		{
			light2.position.y = players[1].position.y + 14;
			camera.position.y = players[1].position.y + 10;
		}
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		uprenderer.render(upscene, camera);
	
	}
}

function updateUpGame()
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
	let elapsedTime = (performance.now() - lastTime) / 1000;
	lastTime = performance.now();

	keysEvent(elapsedTime);
	renderUp();
}

function printPerSecond() // handles time events in the update loop
{
	// get time for current instance
	
	let currentTime = performance.now();
	let showTime = Math.floor((currentTime - startTime) / 1000);

	if (showTime != second)
	{
		console.log(showTime);
		second = showTime;
	}
}