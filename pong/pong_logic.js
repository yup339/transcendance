function update(){
	if(game_stop)
		return ;
	for (let i = 0; i < balls.length; i++) {
		balls[i].update();
	}
	leftPaddle.update();
	rightPaddle.update();
	renderer.render(scene, camera)
	requestAnimationFrame(update);
}

function score(side){
	if (side === "left")
		leftPlayerScore++;
	else if (side === "right")
		rightPlayerScore++;

	document.getElementById('leftPlayerScore').textContent = leftPlayer + ': ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = rightPlayer + ': ' + rightPlayerScore;	

	if(leftPlayerScore == scoreToWin || rightPlayerScore == scoreToWin)
	{
		let winner;
		let loser;
		
		game_stop = true;
		
		if(leftPlayerScore > rightPlayerScore)
		{
			winner = leftPlayer;
			loser = rightPlayer;
		}
		else
		{
			winner = rightPlayer;
			loser = leftPlayer;
		}
		
		if(game_mode == "pong_tournament")
		{
			endRound(winner, loser);
		}
		else
		{
			$("#winModal").modal('show');
			document.getElementById('winner').textContent = winner + " won!";
		}
		
	}
}

function start_pong()
{
	
	if(game_mode == "pong_tournament" && round > 1)
	{
		restartGame();
	}
	else
		startMatch();
}

function PongGame()
{
	game_stop = false;

	if(game_mode == 'pong_dual')
	{
		leftPlayer = 'Left player';
		rightPlayer = 'Right player';
		prepareGame();
		document.getElementById("round").innerHTML = "Dual Player";

	}
	else if(game_mode == 'pong_ai')
	{
		leftPlayer = 'You';
		rightPlayer = 'Ai';
		prepareGame();
		document.getElementById("round").innerHTML = "Ai Duel";
	}
	else if(game_mode == 'pong_tournament')
	{
		prepare_tournament();
	}
}

function prepareGame()
{
	document.getElementById('leftPlayerScore').textContent = leftPlayer + ': ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = rightPlayer + ': ' + rightPlayerScore;	

	colorPicker = document.getElementById('colorPicker'); // assuming you have an input element with id 'colorPicker'
    colorBox = document.getElementById('colorBox'); // assuming you have a div element with id 'colorBox'
    upcanvas = document.getElementById("pongCanvas");
    ballSlider = document.getElementById("ballSlider");
	scoreSlider = document.getElementById("scoreSlider");
    ballSliderOutput = document.getElementById("ballSliderValue");
    speedSlider = document.getElementById("speedSlider");
    speedOutput = document.getElementById("speedSliderValue");
	scoreOutput = document.getElementById("scoreSliderValue");
	scene = new THREE.Scene();
	
	backgroundGeometry = new THREE.BoxGeometry(GAME_WIDTH * 2, GAME_HEIGHT * 2 ,1)
	backgroud_materail = new THREE.MeshStandardMaterial({color: 0x444444});
	background = new THREE.Mesh( backgroundGeometry, backgroud_materail);
	background.position.z = -BOUND_DEPTH / 2;
	renderer = new THREE.WebGLRenderer({canvas: upcanvas, antialias: true, alpha: true, pixelRatio: window.devicePixelRatio });
	camera = new THREE.PerspectiveCamera( 90, upcanvas.width / upcanvas.height, 0.1, 1000 );
	light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add(light);
	scene.background = new THREE.Color(0x000000);
	scene.add(light);
	scene.background = new THREE.Color(0x000000);
	scene.add(background);
 	floor = new HitBox(0, -GAME_HEIGHT , GAME_WIDTH * 2, 1, BOUND_DEPTH);
 	roof = new HitBox(0, GAME_HEIGHT, GAME_WIDTH * 2, 1, BOUND_DEPTH);
 	leftGoal = new HitBox(-GAME_WIDTH , 0, 1, GAME_HEIGHT * 2, BOUND_DEPTH);
	rightGoal = new HitBox(GAME_WIDTH, 0, 1, GAME_HEIGHT * 2, BOUND_DEPTH); 
	leftPaddle = new Paddle(-GAME_WIDTH + PADDLE_DISTANCE_FROM_GOAL , 0, randomColor());
	rightPaddle = new Paddle(GAME_WIDTH - PADDLE_DISTANCE_FROM_GOAL, 0, randomColor());
	speedOutput.innerHTML = speedSlider.value;
	BALL_SPEED = speedSlider.value;
	ball_color = randomColor();
	extra_ball_number = 0;
	scoreToWin = scoreSlider.value;
	leftGoal.draw();
	rightGoal.draw();
	roof.draw();
	floor.draw();
	
	setUpScene();
	ballSliderOutput.innerHTML = ballSlider.value;
	scoreOutput.innerHTML = scoreSlider.value;
	update();
	
	colorPicker.addEventListener('input', handleColorPicked);
	
	ballSlider.oninput = function() {
		
		ballSliderOutput.innerHTML = this.value;
		extra_ball_number = this.value;
		//setBall(this.value);
	}
	
	speedSlider.oninput = function() {
		speedOutput.innerHTML = this.value;
		BALL_SPEED = this.value;
		/*for (let i = 0; i < balls.length; i++) {
			balls[i].updateSpeed();
		}*/
	}

		
	scoreSlider.oninput = function() {
		scoreOutput.innerHTML = this.value;
		scoreToWin  = this.value;
	}
	//ball for presentation
	balls.push(new Ball(0,0,0, 0, ball_color));
}

function startMatch()
{
	document.getElementById("play-link").style.visibility = 'hidden';
	
	//delete the presentation ball
	balls[0].cleanup();
	balls = [];

	//first ball
	balls.push(new Ball(0,0,BALL_SPEED, randomValue(), ball_color))

	//extra balls
	setBall(extra_ball_number);

	if(game_mode === 'pong_ai')
		rightPaddle.activateAI(leftGoal,balls);

	document.getElementById("customs").remove();
    
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
}

function stopGame() 
{
	if(colorPicker)
		colorPicker.removeEventListener('input', handleColorPicked);

	
	document.removeEventListener('keydown', keyDownHandler);

	game_mode = "";

	document.removeEventListener('keyup', keyUpHandler);
	leftPlayerScore = 0;
    rightPlayerScore = 0;
	balls = [];
	game_stop = true;
	if(rightPaddle)
		rightPaddle.deactivateAI();
}

function restartGame()
{

	document.getElementById("play-link").style.visibility = 'hidden';
	set_round();
	game_stop = false;
	leftPlayerScore = 0;
    rightPlayerScore = 0;
	
	while(balls.length > 0)
	{
		balls.pop().cleanup();
	}

	document.getElementById('leftPlayerScore').textContent = leftPlayer + ': ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = rightPlayer + ': ' + rightPlayerScore;


	leftPaddle.remove();
	rightPaddle.remove();
	leftPaddle = new Paddle(-GAME_WIDTH + PADDLE_DISTANCE_FROM_GOAL , 0, randomColor());
	rightPaddle = new Paddle(GAME_WIDTH - PADDLE_DISTANCE_FROM_GOAL, 0, randomColor());

	balls.push(new Ball(0,0,BALL_SPEED, randomValue(), ball_color))
	setBall(extra_ball_number);
	update();
}
