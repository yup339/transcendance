// game res
const UPGAME_WIDTH = document.getElementById('upCanvas').width;
const UPGAME_HEIGHT = document.getElementById('upCanvas').height;

//html stuff
let upcanvas;

//scene
let upscene;
let upcamera;
let uplight; 
let uprenderer;
let startTime;

// score/players
let playerLeft;
let playerRight;
// let leftPlayerScore = 0;
// let rightPlayerScore = 0;
// let scoreToWin;
let timeLimit = 40;

// platforms
let platforms = [];

//--------------------------------- classes

class Platform 
{
	constructor(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.z = 0;
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
	upcanvas.width = UPGAME_WIDTH;
	upcanvas.height = UPGAME_HEIGHT;
	upscene = new THREE.Scene();
	upcamera = new THREE.PerspectiveCamera(90, UPGAME_WIDTH/UPGAME_HEIGHT, 0.1, 500);
	upcamera.position.z = 100;
	uprenderer = new THREE.WebGLRenderer({canvas: upcanvas});
	uprenderer.setSize(UPGAME_WIDTH, UPGAME_HEIGHT);
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