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
let light;

// score/players
let playerLeft;
let playerRight;
let playerSpeed = 10;
let jumpSpeed = 30;
let isJumping = false;
let jumpPos;

// platforms
let objects = [];
let platforms = [];
let keys = {};
let cube, material, geometry;
let cycle = false;

const views = [
	{
		left: 0,
		bottom: 0,
		width: 0.5,
		height: 1.0,
		position: [0, 0, 30],
		background: new THREE.Color(0xC1F7B0), // soft green
	},
	{
		left: 0.5,
		bottom: 0,
		width: 0.5,
		height: 1.0,
		position: [30, 0, 30],
		background: new THREE.Color(0xF8B7EE), // purple
	},
];

const players = [

]


//--------------------------------- classes

class Platform 
{
	constructor(geometry, material, mesh)
	{
		this.geometry = geometry;
		this.material = material;
		this.mesh = mesh;
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
}

class Player
{
	constructor(geometry, material, mesh)
	{
		this.geometry = geometry;
		this.material = material;
		this.mesh = mesh;
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}

	isLanded()
	{

	}
}

class HitBox
{
	constructor(x, y, width, height, depth)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.depth = depth;
	
	}
}

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
		const camera = new THREE.PerspectiveCamera(40, canvas.width/canvas.height, 0.1, 500);
		camera.position.fromArray(view.position);
		view.camera = camera;
	}

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize(canvas.width, canvas.height);
	
	
	geometry = new THREE.BoxGeometry(5, 1, 5);
	material = new THREE.MeshBasicMaterial( { color: 0x7377ff } );
	cube = new THREE.Mesh( geometry, material );
	let cube2 = new THREE.Mesh( geometry, material ); // to remove
	cube.position.x = 30;
	cube.position.y = -5;

	light = new THREE.PointLight( 0xffffff, 100 ); // red light
	const helper = new THREE.PointLightHelper( light, 1 );
	scene.add(light);
	scene.add(helper);

	scene.add(cube);
	cube2.position.y = 5;
	scene.add(cube2); // to remove
	
	// time
	stop = false;
	frameCount = 0;
	lastTime = performance.now();
	startTime = lastTime;
	updateUpGame();
}

function keysEvent(elapsedTime)
{
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	//key inputs
	if (keys[37]) // left 
	{
		if (cube.position.x > -30)
			cube.position.x -= playerSpeed * elapsedTime;
	}
	if (keys[39]) // right 
	{
		// if (cube.position.x < 30)
			cube.position.x += playerSpeed * elapsedTime;
	}
	if (keys[38] && isJumping == false) //up or jump
	{
		isJumping = true;
		jumpPos = cube.position.y;
	}
	if (keys[40]) // down
	{
		cube.position.y -= playerSpeed * elapsedTime;
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
		// if (i == 0)
		// 	camera.position.y = cube.position.y; // update camera position depending on player position
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.render(scene, camera);
	
	}
}

function updateUpGame()
{
	requestAnimationFrame(updateUpGame);

	// get time for current instance
	let currentTime = performance.now();
	console.log(Math.floor((currentTime - startTime) / 1000));
	
	// delta time
	let elapsedTime = (performance.now() - lastTime) / 1000;
	lastTime = performance.now();

	keysEvent(elapsedTime);
	renderUp();

	// player logic
	if(isJumping)
	{
		let nextPos = cube.position.y + jumpSpeed * elapsedTime;
		if (nextPos > jumpPos)
			cube.position.y = nextPos
		else
		{
			isJumping = false;
			jumpSpeed = 30;
			cube.position.y = jumpPos;
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
	game_stop = false;
	game_mode = 'up_dual';

	if(game_mode == 'up_dual')
	{
		playerLeft = 'Left player';
		playerRight = 'Right player';
		prepareUpGame();

	}
	else if(game_mode == 'up_ai')
	{
		playerLeft = 'You';
		playerRight = 'Ai';
		prepareUpGame();
	}
	else if(game_mode == 'up_online')
	{
		playerLeft = 'You';
		playerRight = 'Player 2';
		prepareOnline();
	}
	else if(game_mode == 'up_tournament')
	{
		prepare_up_tournament();
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