// gmae res
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

//html stuff
let upcanvas;

//scene
let upscene;
let upcamera;
let uplight; 
// let backgroundGeometry;
// let backgroud_materail;
// let background;
let uprenderer;
let floor;
// let leftPlayer;
// let rightPlayer;
// let startTime;

// score/players
// let leftPlayerScore = 0;
// let rightPlayerScore = 0;
// let scoreToWin;
let timeLimit = 40;

// platforms
let platforms = [];

//--------------------------------- classes

class Platform 
{
	constructor(x, y, width, height, color)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}
}

function getTimeFromStart()
{
	let date = new Date();
	return (date.getTime() * 1000) - startTime;

}

function prepareUpGame()
{
	upcanvas = document.getElementById('upCanvas');
	upcanvas.width = GAME_WIDTH;
	upcanvas.height = GAME_HEIGHT;
	upscene = new THREE.Scene();
	upcamera = new THREE.PerspectiveCamera(75, GAME_WIDTH/GAME_HEIGHT, 0.1, 1000);
	upcamera.position.z = 100;
	uprenderer = new THREE.WebGLRenderer({canvas: upcanvas});
	uprenderer.setSize(GAME_WIDTH, GAME_HEIGHT);
	uprenderer.setClearColor(0x000000, 1);

	//time
	let date = new Date();
	startTime = date.getTime() * 1000;

}

function GetRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);

}

function UpGame()
{
	game_stop = false;

	if(game_mode == 'up_dual')
	{
		leftPlayer = 'Left player';
		rightPlayer = 'Right player';
		prepareUpGame();

	}
	else if(game_mode == 'up_ai')
	{
		leftPlayer = 'You';
		rightPlayer = 'Ai';
		prepareUpGame();
	}
	else if(game_mode == 'up_online')
	{
		leftPlayer = 'You';
		rightPlayer = 'Player 2';
		prepareOnline();
	}
	else if(game_mode == 'up_tournament')
	{
		prepare_tournament();
	}
}

function mainUp()
{
	
}

function timer()
{
    var timer = setInterval(function(){
        document.getElementById('safeTimerDisplay').innerHTML='00:'+sec;
        timeLimit--;
        if (timeLimit < 0) {
            clearInterval(timer);
        }
    }, 1000);
}