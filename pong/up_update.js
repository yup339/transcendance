function keysEvent(elapsedTime)
{
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

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
	if (keys[87] && isJumping == false && isFalling == false) // w
	{
		isFalling = true;
		isJumping = true;
		jumpCount1 += 1;
		jumpSet = false;
		// jumpPos = players[0].position.y;
		// players[0].nextPos.y += playerSpeed * elapsedTime;
	}
	if (keys[83]) // s
	{
		players[0].nextPos.y -= playerSpeed * elapsedTime;
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
	if (keys[38] && isJumping == false) // up
	{
		// isJumping = true;
		players[1].nextPos.y += playerSpeed * elapsedTime;
	}
	if (keys[40]) // down
	{
		players[1].nextPos.y -= playerSpeed * elapsedTime;
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
	
	for (let i = 0; i < objects.length; i++)
	{
		if (players[0].checkCollision(objects[i].hitbox))
		{
			console.log("player 1 hit");
			hit = true;
			break;
		}
	}

	for (let i = 0; i < objectsp2.length; i++)
	{
		if (players[1].checkCollision(objectsp2[i].hitbox))
		{
			console.log("player 2 hit");
			hit2 = true;
			break;
		}
	}

	if (!hit)
	{
		players[0].updatePos();
	}
	if (!hit2)
	{
		players[1].updatePos();
	}
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
	if(isJumping)
	{
		isJumping = false;
		if (!jumpSet)
		{
			jumpSpeed = 30;
			jumpSet = true;
		}
	}
	if (isFalling)
	{
		if (!jumpSet)
		{
			jumpSpeed = -1.5;
			jumpSet = true;
		}
		players[0].nextPos.y += jumpSpeed * elapsedTime;
		
		if (jumpSpeed > -30)
			jumpSpeed -= 1;
		else
		{
			jumpSet = false;
			isFalling = false;
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
	requestAnimationFrame(updateUpGame);
	printPerSecond();
	if (stop)
		return ;
	
	
	
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
	// if (second == 50)
	// 	stop = true;

}