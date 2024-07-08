// const vars
const timeLimit = 30; // timelimit for the round

//html stuff
let upcanvas;

//time vars
let stop;
let lastTime;
let startTime;

//scene
let upscene;
let uprenderer;

// score/players
let playerLeft;
let playerRight;

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

// objects
let light1;
let light2;
let objects = [];
let objectsp2 = [];
let platformsGeo = [
	new THREE.BoxGeometry(5, 1, 5), // first 50 y
	new THREE.BoxGeometry(4, 1, 5), // next 50 y, etc.. to augment difficulty
	new THREE.BoxGeometry(3, 1, 5),
	new THREE.BoxGeometry(2, 1, 5),
	new THREE.BoxGeometry(1, 1, 5),
	new THREE.BoxGeometry(0.5, 1, 5),];
let hitboxes = [];
let keys = {};
let cycle = false;

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

	
	upscene = new THREE.Scene();
	uprenderer = new THREE.WebGLRenderer({canvas: upcanvas});
	uprenderer.setSize(upcanvas.width, upcanvas.height);
	
	//players
	let geometry = new THREE.BoxGeometry(1, 1, 1);
	let material = new THREE.MeshStandardMaterial({color: 0xF8B7EE});
	players[0] = new UpObject(geometry, material, 1, 1);
	players[0].position.set(0, 0, 0);
	distanceTravelled1
	upscene.add(players[0]);
	
	let material2 = new THREE.MeshStandardMaterial({color: 0xC1F7B0});
	players[1] = new UpObject(geometry, material2, 1, 1);
	players[1].position.set(30, 0, 0);
	upscene.add(players[1]);
	
	//light and its helper
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
	// time
	stop = false;
	lastTime = performance.now();
	startTime = lastTime;
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
	updateUpGame();
}

function countdown()
{
	
}

function generateLevel()
{
	// generate starting platforms
	let geometry = new THREE.BoxGeometry(15, 1, 5); // starting platforms
	let material = new THREE.MeshStandardMaterial( { color: 0x7377ff } );
	let startPlat = new UpObject(geometry, material);
	let startPlat2 = new UpObject(geometry, material);
	startPlat.position.set(0, -1, 0);
	startPlat2.position.set(30, -1, 0);
	startPlat.render(upscene);
	startPlat2.render(upscene);
	objects.push(startPlat);
	objects.push(startPlat2);

	let platform;
	let y = startPlat.position.y + 6;
	for (let i = 0; i < 100; i++) // TODO: make it so that x values are  not too far apart
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
		if (y > 199 && Math.max(platform.position.x, objects[i-1].position.x) - Math.min(platform.position.x, objects[i-1].position.x) > 6)
		{
			if (platform.position.x > objects[i-1].position.x)
				platform.position.x -= 6;
			else
				platform.position.x += 6;
		}
		platform.position.y = y;
		y += 6;
		objects.push(platform);
		platform.render(upscene);
	}
	
	for (let i = 0; i < objects.length; i++) // clone objects for player 2
	{
		objectsp2[i] = objects[i].clone();
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
	game_mode = 'up_dual';

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
	document.removeEventListener('keydown', onKeyDown);
	document.removeEventListener('keyup', onKeyUp);

	for (let i = 0; i < objects.length; i++)
	{
		upscene.remove(objects[i]);
		upscene.remove(objectsp2[i]);
	}
	objects.clear();
	objectsp2.clear();
	players.clear();
	upscene.remove(light1);
	upscene.remove(light2);
}