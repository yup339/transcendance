const COTOYE = 50;

//html stuff
let upcanvas;
let requestId; // to stop loop

//time vars
let uponline = false;
let stop;
let lastTime;
let startTime;

//scene
let upscene;
let uprenderer;

// game stats for after
let jumpCount1 = 0;
let jumpCount2 = 0;

// in-game on-screen info
let distanceTravelled1 = 0;
let distanceTravelled2 = 0;
let second; // timer for current round

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

function setGlobals()
{
	platformsGeo = [
		new THREE.BoxGeometry(5, 1, 5), // first 50 y
		new THREE.BoxGeometry(4, 1, 5), // next 50 y, etc.. to augment difficulty
		new THREE.BoxGeometry(3, 1, 5),
		new THREE.BoxGeometry(2, 1, 5),
		new THREE.BoxGeometry(1, 1, 5),
		new THREE.BoxGeometry(0.5, 1, 5)];

	players = []; // players
	objects = []; // platforms for p1
	objectsp2 = []; // platforms for p2
	second = 0; // timer
	distanceTravelled1 = 0; //stat
	distanceTravelled2 = 0;
	jumpCount1 = 0; //stat
	jumpCount2 = 0;
	let currentSide = undefined;

}

function prepareUpGame()
{
	upcanvas = document.getElementById('UpCanvas');
	uponline = false;
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
	
	generateLevel();

	stop = false;
	// requestId = undefined;
	lastTime = performance.now();
	startTime = lastTime;
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
	updateUpGame();
}

function generateLevel()
{
	// generate starting platforms
	let geometry = new THREE.BoxGeometry(15, 1, 5);
	let material = new THREE.MeshStandardMaterial( { color: 0x7377ff } );
	let startPlat = new UpObject(geometry, material);
	let startPlat2 = new UpObject(geometry, material);
	startPlat.position.set(0, -1, 0);
	startPlat2.position.set(30, -1, 0);
	startPlat.render(upscene);
	startPlat2.render(upscene);
	objects.push(startPlat);
	objectsp2.push(startPlat2);

	let platform;
	let y = startPlat.position.y + 6;
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
		playerLeft = 'Left player';
		playerRight = 'Right player';
		prepareUpGame();

	}
	else if(game_mode == 'up_online')
	{
		playerLeft = 'You';
		playerRight = 'Player 2';
		prepareOnline();
	}
}

function upStop()
{
	stop = true;
	uponline = false;
	document.removeEventListener('keydown', onKeyDown);
	document.removeEventListener('keyup', onKeyUp);
	cancelAnimationFrame(requestId);
	requestId = undefined;


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
}