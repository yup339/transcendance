// const vars
const timeLimit = 30; // timelimit for the round

//html stuff
let canvas;

//time vars
let stop;
let lastTime;
let startTime;
let frameCount;

//scene
let scene;
let renderer;

// score/players
let playerLeft;
let playerRight;

// stats
let jumpCount1 = 0;
let jumpCount2 = 0;
let distanceTravelled1 = 0;
let distanceTravelled2 = 0;

// player and player variables
let players = [];
let playerSpeed = 10;
let jumpSpeed = 30;
let isJumping = false;
let isFalling = false;
let jumpPos = 0;

// objects
let light;
let light2;
let lightSphere;
let lightSphere2;
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

UpGame

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
	canvas = document.getElementById('UpCanvas');

	// set up cameras
	for (let i = 0; i < views.length; ++i)
	{
		const view = views[i];
		const camera = new THREE.PerspectiveCamera(50, canvas.width/canvas.height, 0.1, 500);
		camera.position.fromArray(view.position);
		view.camera = camera;
	}

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize(canvas.width, canvas.height);
	
	//players
	let geometry = new THREE.BoxGeometry(1, 1, 1);
	let material = new THREE.MeshStandardMaterial({color: 0xF8B7EE});
	players[0] = new THREE.Mesh(geometry, material);
	players[0].position.set(0, -9, 0);
	scene.add(players[0]);

	let material2 = new THREE.MeshStandardMaterial({color: 0xC1F7B0});
	players[1] = new THREE.Mesh(geometry, material2);
	players[1].position.set(30, -9, 0);
	scene.add(players[1]);
	
	//light and its helper
	let geo = new THREE.SphereGeometry(1, 32, 16);
	let mat = new THREE.MeshBasicMaterial({color: 0x404040});
	lightSphere = new THREE.Mesh(geo, mat);
	lightSphere.position.set(0, 4, 5);
	light = new THREE.PointLight(0x404040, 5, 50);
	light.position.set( 0, 4, 5 );
	scene.add(light);
	scene.add(lightSphere);

	//light for player 2
	lightSphere2 = new THREE.Mesh(geo, mat);
	lightSphere2.position.set(30, 4, 5);
	light2 = new THREE.PointLight(0x404040, 5, 50);
	light2.position.set( 30, 4, 5 );
	scene.add(light2);
	scene.add(lightSphere2);
	
	generateLevel();
	
	// time
	stop = false;
	frameCount = 0;
	lastTime = performance.now();
	startTime = lastTime;
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
	let cube = new THREE.Mesh( geometry, material );
	let cube2 = new THREE.Mesh( geometry, material );
	cube.position.set(0, -10, 0);
	cube2.position.set(30, -10, 0);
	scene.add(cube);
	scene.add(cube2);
	

	let platform;
	let hitbox;
	let y = cube.position.y + 6;
	for (let i = 0; i < 100; i++) // TODO: make it so that x values are  not too far apart
	{
		if (y < 50)
			platform = new THREE.Mesh(platformsGeo[0], material);
		else if (y < 100)
			platform = new THREE.Mesh(platformsGeo[1], material);
		else if (y < 150)
			platform = new THREE.Mesh(platformsGeo[2], material);
		else if (y < 200)
			platform = new THREE.Mesh(platformsGeo[3], material);
		else if (y < 250)
			platform = new THREE.Mesh(platformsGeo[4], material);
		else
			platform = new THREE.Mesh(platformsGeo[5], material);
		platform.position.x = GetRandomInt(-5, 5);
		platform.position.y = y;
		hitbox = new THREE.Box3().setFromObject(platform);
		y += 6;
		hitboxes.push(hitbox);
		objects.push(platform);
		scene.add(platform);
	}
	
	for (let i = 0; i < objects.length; i++) // clone objects for player 2
	{
		objectsp2[i] = objects[i].clone();
		objectsp2[i].position.x += 30;
		scene.add(objectsp2[i]);
	}
	
}

function keysEvent(elapsedTime)
{
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	let nextPosP1;
	let nextPosP2;

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

}

function renderUp()
{
	// camera renders
	for (let i = 0; i < views.length; ++i)
	{
		const view = views[i];
		const camera = view.camera;
		const left = Math.floor(canvas.width * view.left);
		const bottom = Math.floor(canvas.height * view.bottom);
		const width = Math.floor(canvas.width * view.width);
		const height = Math.floor(canvas.height * view.height);
		renderer.setViewport(left, bottom, width, height);
		renderer.setScissor(left, bottom, width, height);
		renderer.setScissorTest(true);
		renderer.setClearColor(view.background);
		if (i == 0)
		{
			lightSphere.position.y = players[0].position.y + 14;
			light.position.y = players[0].position.y + 14;
			camera.position.y = players[0].position.y + 10; // update camera position depending on player position
		}
		else
		{
			lightSphere2.position.y = players[1].position.y + 14;
			light2.position.y = players[1].position.y + 14;
			camera.position.y = players[1].position.y + 10;
		}
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.render(scene, camera);
	
	}
}

function checkCollision()
{
	let playerBox = new THREE.Box3().setFromObject(players[0]);
	let playerBox2 = new THREE.Box3().setFromObject(players[1]);
	for (let i = 0; i < hitboxes.length; i++)
	{
		if (playerBox.intersectsBox(hitboxes[i]))
		{
			
		}
		if (playerBox2.intersectsBox(hitboxes[i]))
		{
			
		}
	}

}

function updateUpGame()
{
	requestAnimationFrame(updateUpGame);

	// get time for current instance
	let currentTime = performance.now();
	if (Math.floor((currentTime - startTime) / 1000))
		console.log(Math.floor((currentTime - startTime) / 1000));
	
	// delta time
	let elapsedTime = (performance.now() - lastTime) / 1000;
	lastTime = performance.now();

	keysEvent(elapsedTime);
	renderUp();

	// player logic
	if(isJumping)
	{
		let nextPos = players[0].position.y + jumpSpeed * elapsedTime;
		if (nextPos > jumpPos)
			players[0].position.y = nextPos
		else
		{
			isJumping = false;
			jumpSpeed = 30;
			players[0].position.y = jumpPos;
		}
		if (jumpSpeed != -30)
			jumpSpeed -= 1.5;
	}
}

function GetRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);

}

function UpGame()
{
	stop = true;
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

function prepare_up_tournament()
{

}

function mainUp()
{
	
}

//TODO: remove everything below

UpGame();