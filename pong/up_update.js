function keysEvent(elapsedTime)
{
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	let nextPosP1 = players[0].clone();
	let nextPosP2 = players[1].clone();

	// player 1 movement
	if (keys[65]) // a 
	{
		if (players[0].position.x > -7)
			players[0].position.x -= playerSpeed * elapsedTime;
	}
	if (keys[68]) // d 
	{
		if (players[0].position.x < 7)
			players[0].position.x += playerSpeed * elapsedTime;
	}
	if (keys[87] && isJumping == false) // w
	{
		// isFalling = true;
		// isJumping = true;
		// jumpPos = players[0].position.y;
		players[0].position.y += playerSpeed * elapsedTime;
	}
	if (keys[83]) // s
	{
		players[0].position.y -= playerSpeed * elapsedTime;
	}

	// player 2 movement
	if (keys[37]) // left
	{
		if (players[1].position.x > 30 - 7)
			players[1].position.x -= playerSpeed * elapsedTime;
	}
	if (keys[39]) // right
	{
		if (players[1].position.x < 30 + 7)
			players[1].position.x += playerSpeed * elapsedTime;
	}
	if (keys[38] && isJumping == false) // up
	{
		// isJumping = true;
		players[1].position.y += playerSpeed * elapsedTime;
	}
	if (keys[40]) // down
	{
		players[1].position.y -= playerSpeed * elapsedTime;
	}

	jumpLogic();
	checkCollision(nextPosP1, nextPosP2);
}

function compareTopHitbox(hitbox1, hitbox2)
{
	if (hitbox1.max.y >= hitbox2.min.y && hitbox1.max.y <= hitbox2.max.y)
		return (true);

	return (false);
}

function checkCollision(nextPosP1, nextPosP2)
{
	let playerBox = new THREE.Box3().setFromObject(nextPosP1);
	playerBox.min.y += 0.1;// so that it doesn't get stuck right away, to change
	playerBox.max.y -= 0.1;
	let playerBox2 = new THREE.Box3().setFromObject(nextPosP2);
	let hit = false;
	let hit2 = false;
	
	for (let i = 0; i < hitboxes.length; i++)
	{
		if (compareTopHitbox(playerBox, hitboxes[i]))
		{
			console.log("player 1 hit");
			hit = true;
		}
		if (compareTopHitbox(playerBox2, hitboxes[i]))
		{
			console.log("player 2 hit");
			hit2 = true;
		}
	}

	if (!hit)
	{
		players[0].position = nextPosP1.position;
	}
	if (!hit2)
	{
		players[1].position = nextPosP2.position;
	}
}

function jumpLogic()
{
	// jump logic
	// if(isJumping)
	// {
	// 	let nextPos = players[0].position.y + jumpSpeed * elapsedTime;
	// 	if (nextPos > jumpPos)
	// 		players[0].position.y = nextPos
	// 	else
	// 	{
	// 		isJumping = false;
	// 		jumpSpeed = 30;
	// 		players[0].position.y = jumpPos;
	// 	}
	// 	if (jumpSpeed != -30)
	// 		jumpSpeed -= 1.5;
	// }
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
	if (stop)
		return ;
	
	
	
	// delta time
	let elapsedTime = (performance.now() - lastTime) / 1000;
	lastTime = performance.now();

	keysEvent(elapsedTime);
	renderUp();
}

function printPerSecond()
{
	// get time for current instance\

	let currentTime = performance.now();
	if (Math.floor((currentTime - startTime) / 1000) )
		console.log(Math.floor((currentTime - startTime) / 1000));

}