// const vars
const fps = 60;

//html stuff
let upcanvas;

//time vars
let stop;
let lastTime;
let startTime;
let frameCount;
let timeLimit;
let fpsInterval;

//scene
let upscene;
let upcamera;
let uplight; 
let uprenderer;

// score/players
let playerLeft;
let playerRight;

// platforms
let objects = [];
let geometry, material, cube;

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

}

function prepareUpGame()
{
	upcanvas = document.getElementById('UpCanvas');
	upscene = new THREE.Scene();
	upcamera = new THREE.PerspectiveCamera(75, upcanvas.width/upcanvas.height, 0.1, 500);
	upcamera.position.z = 100;
	uprenderer = new THREE.WebGLRenderer({canvas: upcanvas});
	uprenderer.setSize(upcanvas.width, upcanvas.height);
	
	
	const geometry = new THREE.BoxGeometry(5, 1, 5);
	const material = new THREE.MeshBasicMaterial( { color: 0xff5a00 } );
	const cube = new THREE.Mesh( geometry, material );
	cube.position.x = -15;
	const light = new THREE.AmbientLight(0xffffff);
	upscene.add(light);
	upscene.add(cube);
	upscene.background = new THREE.Color(0x000000);
	upcamera.position.z = 20;
	upcamera.position.y = 5;
	
	//time
	fpsInterval = 1000 / fps;
	timeLimit = 40;
	stop = false;
	frameCount = 0;
	lastTime = performance.now();
	startTime = lastTime;
	updateUpGame();
}

function updateUpGame()
{
	requestAnimationFrame(updateUpGame);
	
	let elapsedTime = performance.now() - lastTime;
	lastTime = performance.now();
	uprenderer.render(upscene, upcamera);

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

UpGame(); //TODO: remove this