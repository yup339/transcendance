//html stuff
let upcanvas;
let requestId; // to stop loop

//time vars
let uponline;
let upcountdown;
let stop;
let startTime;
let count; // timer for the countdown at the start (starting at 3)
let second; // timer for current round (starting at 60)

//scene
let upscene;
let uprenderer;

// game stats for after
let jumpCount1;
let jumpCount2;
let winner;

// in-game on-screen info
let distanceTravelled1;
let distanceTravelled2;

// player and player variables
let players = [];
let playerSpeed = 10;

// online
let currentSide;

// objects
let light1;
let light2;
let objects = [];
let objectsp2 = [];
let platformsGeo;
let keys = {};

const views = [
	{
		left: 0,
		bottom: 0,
		width: 0.5,
		height: 1.0,
		position: [0, 0, 28],
		background: new THREE.Color(0xC1F7B0), // soft green
	},
	{
		left: 0.5,
		bottom: 0,
		width: 0.5,
		height: 1.0,
		position: [30, 0, 28],
		background: new THREE.Color(0xF8B7EE), // soft purple
	},
];

function onKeyDown(event)
{
	keys[event.keyCode] = true;
}

function onKeyUp(event)
{
	keys[event.keyCode] = false;
}

function onVisibilityChange()
{
	if (document.visibilityState == "visible") {
		alert("you left the page game has been stopped")
	} else {
		navigateTo('game_choice');
		if(uponline && socket)
			socket.disconnect();
	}
}

function setGlobals()
{
	platformsGeo = [
		new THREE.BoxGeometry(5, 1, 5), // first 50 y
		new THREE.BoxGeometry(4, 1, 5), // next 50 y, etc.. to augment difficulty
		new THREE.BoxGeometry(3, 1, 5),
		new THREE.BoxGeometry(2, 1, 5),
		new THREE.BoxGeometry(1, 1, 5),
		new THREE.BoxGeometry(0.5, 1, 5)];

	stop = false;
	players = []; // players
	objects = []; // platforms for p1
	objectsp2 = []; // platforms for p2
	second = 0; // timer
	upcountdown = 60;
	distanceTravelled1 = 0; //stat
	distanceTravelled2 = 0;
	jumpCount1 = 0; //stat
	jumpCount2 = 0;
	count = 3;
	let currentSide = undefined;
	document.addEventListener("visibilitychange", onVisibilityChange);
	
	//Setting names
	const name1 = document.getElementById("namePlayer1");
	name1.textContent = "Player 1";
	name1.style.color = 'lightgreen';
	const name2 = document.getElementById("namePlayer2");
	name2.textContent = "Player 2";
	name2.style.color = 'lightpink';
	
	updateOnScreen();
	const onscreenTimer = document.getElementById("gameTime");
	onscreenTimer.textContent = count;
}

function prepareUpGame()
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
	distanceTravelled1
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

	// generate starting platforms
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
	
	generateLevel();
	renderUp();
	startTime = performance.now();
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
	countdown();
}

function countdown()
{
	requestId = undefined;
	if (!requestId)
	{
		requestId = requestAnimationFrame(countdown);
	}
	if (count < 1)
	{
		console.log("countdown over");
		cancelAnimationFrame(requestId);
		second = 0;
		startTime = performance.now();
		updateUpGame();
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

function generateLevel()
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
	
	for (let i = 0; i < objects.length; i++) // clone objects for player 2
	{
		objectsp2[i] = objects[i].clone();
		objectsp2[i].height = objects[i].height;
		objectsp2[i].width = objects[i].width;
		objectsp2[i].position.x += 30;
		objects[i].setHitbox();
		objectsp2[i].setHitbox();
		upscene.add(objectsp2[i]);
	}
}

function GetRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function UpGame()
{
	stop = false;
	uponline = false;
	
	if(game_mode == 'up_dual')
	{
		prepareUpGame();
	}
	else if(game_mode == 'up_online')
	{
		uponline = true;
		prepareOnline();
	}
}

function findWinner()
{
	if(distanceTravelled1 == distanceTravelled2){
		winner = "Both Players";
	}
	else if(distanceTravelled1 > distanceTravelled2){
		if(game_mode == 'up_online'){
			winner = players[0];
		}
		else{
			winner = "Left Player";
		}
	
	}
	else{
		if(game_mode == 'up_online'){
			winner = players[1];
		}
		else{
			winner = "Right Player";
		}
	}
}

function upStop()
{
	stop = true;
	document.removeEventListener('keydown', onKeyDown);
	document.removeEventListener('keyup', onKeyUp);
	document.removeEventListener('visibilitychange', onVisibilityChange);
	cancelAnimationFrame(requestId);
	requestId = undefined;
	
	if (uponline)
	{
		// TODO: for online stats
		if	(currentSide == 'left')
		{
			console.log("Jump count: ", jumpCount1);
		}
		else
		{
			console.log("Jump count: ", jumpCount2);
		}
		uponline = false;
	}
	else
	{
		console.log("Jump count: ", jumpCount1);
		console.log("Jump count: ", jumpCount2);
	}

	for (let i = 0; i < objects.length; i++)
	{
		upscene.remove(objects[i]);
		upscene.remove(objectsp2[i]);
		objects[i].geometry.dispose();
		objects[i].material.dispose();
		objectsp2[i].geometry.dispose();
		objectsp2[i].material.dispose();
	}
	objects = [];
	objectsp2 = [];

	for (let i = 0; i < players.length; i++)
	{
		upscene.remove(players[i]);
		players[i].geometry.dispose();
		players[i].material.dispose();
	}
	players = [];
	platformsGeo = [];
	if (light1 && light2)
	{
		upscene.remove(light2);
		upscene.remove(light1);
	}

	if (uprenderer)
		uprenderer.dispose();

	const upWinner = document.getElementById('labelWinner');
	$("#endModal").modal('show');
	if(upWinner){
		findWinner();
		upWinner.textContent = winner + " won!";
	}
}