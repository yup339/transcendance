function update(){
	if(game_stop)
		return ;

	let elapsedTime = (performance.now() - previousTimePong);
	previousTimePong = performance.now();
	let magnitude = elapsedTime / (1000 / 60) // have game logic be 60 fps

	for (let i = 0; i < balls.length; i++) {
		balls[i].update(magnitude);
	}
	leftPaddle.update(magnitude);
	rightPaddle.update(magnitude);
	renderer.render(scene, camera)
	requestAnimationFrame(update);
}

function score(side){
	if (side === "left"){
		leftPlayerScore++;
	}
	else if (side === "right")
	{
		rightPlayerScore++;
	}

	document.getElementById('leftPlayerScore').textContent = leftPlayer + ': ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = rightPlayer + ': ' + rightPlayerScore;	

	if(leftPlayerScore == scoreToWin || rightPlayerScore == scoreToWin)
	{
		gameIsOver = true;
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
		
		if (game_mode == "pong_ai" ){
			gameStats.stats.pong_offline_game_played++;
			if (winner == leftPlayer)
				gameStats.stats.pong_won++;
			else
				gameStats.stats.pong_lost++;
		}
		else if (game_mode == "pong_online"){
			gameStats.stats.pong_online_game_played++;
			if (socket.side == 'left'){
				if (winner == leftPlayer)
				gameStats.stats.pong_won++;
				else
					gameStats.stats.pong_lost++;
			}
			else {
				if (winner == leftPlayer)
					gameStats.stats.pong_lost++;
				else
					gameStats.stats.pong_won++;
			}
		}

		if(game_mode == "pong_tournament")
		{
			endRound(winner, loser);
		}
		else if(game_mode == "pong_online")
		{
			$("#winModalOnline").modal('show');
			document.getElementById('winnerOnline').textContent = winner + " won!";
		}
		else
		{
			$("#winModal").modal('show');
			document.getElementById('winner').textContent = winner + " won!";
		}
		if (game_mode == "pong_ai" || game_mode == "pong_online")
		{
			if (user.loggedIn)
				user.send_stats(gameStats);
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

function onVisibilityChange()
{
	if (document.visibilityState == "visible") {
		alert("you left the page game has been stopped")
		navigateTo('game_choice');
		if(socket)
			socket.disconnect();
	}
}

function PongGame()
{
	game_stop = false;
	gameStats = new StatsContainer();
	document.addEventListener("visibilitychange", onVisibilityChange);

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
	else if(game_mode == 'pong_online'){
		if (!user.loggedIn)
			{
				alert("You need to be logged in to play online");
				navigateTo('login');
				return;
			}
		leftPlayer = "Please";
		rightPlayer = "Wait";
		const customs = document.getElementById('customs');
		const uglyplaybutton = document.getElementById('play-link');
		customs.style.display = 'none';
		uglyplaybutton.style.display = 'none';
		socket = new GameSocket();
		prepare_online_Game();
	}
}

function prepare_online_Game()
{
	document.getElementById('leftPlayerScore').textContent = leftPlayer + ': ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = rightPlayer + ': ' + rightPlayerScore;	

	colorPicker = document.getElementById('colorPicker'); // assuming you have an input element with id 'colorPicker'
    colorBox = document.getElementById('colorBox'); // assuming you have a div element with id 'colorBox'
    canvas = document.getElementById("pongCanvas");
    ballSlider = document.getElementById("ballSlider");
	scoreSlider = document.getElementById("scoreSlider");
    ballSliderOutput = document.getElementById("ballSliderValue");
    speedSlider = document.getElementById("speedSlider");
    speedOutput = document.getElementById("speedSliderValue");
	scoreOutput = document.getElementById("scoreSliderValue");
	scene = new THREE.Scene();
	
	backgroundGeometry = new THREE.BoxGeometry(GAME_WIDTH * 8, GAME_HEIGHT * 8 ,1)
	backgroud_materail = new THREE.MeshStandardMaterial({color: 0x444444});
	background = new THREE.Mesh( backgroundGeometry, backgroud_materail);
	background.position.z = -BOUND_DEPTH / 2;
	renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true, pixelRatio: window.devicePixelRatio });
	camera = new THREE.PerspectiveCamera( 90, canvas.width / canvas.height, 0.1, 1000 );
	light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add(light);
	scene.background = new THREE.Color(0x000000);
	scene.add(light);
	scene.background = new THREE.Color(0x000000);
	scene.add(background);
	floor = new HitBox(0, -GAME_HEIGHT + 5, GAME_WIDTH * 2, 10, BOUND_DEPTH + 50);
	roof = new HitBox(0, GAME_HEIGHT + 5, GAME_WIDTH * 2, 10, BOUND_DEPTH + 50);
	leftGoal = new HitBox(-GAME_WIDTH - 50, 0, 100, GAME_HEIGHT * 2, BOUND_DEPTH + 50);
    rightGoal = new HitBox(GAME_WIDTH + 50, 0, 100, GAME_HEIGHT * 2, BOUND_DEPTH + 50); 
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
	previousTimePong = performance.now()
	setUpScene();
	ballSliderOutput.innerHTML = ballSlider.value;
	scoreOutput.innerHTML = scoreSlider.value;
	update();
	
	//ball for presentation
	balls.push(new Ball(0,0,0, 0, ball_color));
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
	
	backgroundGeometry = new THREE.BoxGeometry(GAME_WIDTH * 8, GAME_HEIGHT * 8 ,1)
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
 	floor = new HitBox(0, -GAME_HEIGHT + 5, GAME_WIDTH * 2, 10, BOUND_DEPTH + 50);
 	roof = new HitBox(0, GAME_HEIGHT + 5, GAME_WIDTH * 2, 10, BOUND_DEPTH + 50);
 	leftGoal = new HitBox(-GAME_WIDTH - 50, 0, 100, GAME_HEIGHT * 2, BOUND_DEPTH + 50);
	rightGoal = new HitBox(GAME_WIDTH + 50, 0, 100, GAME_HEIGHT * 2, BOUND_DEPTH + 50); 
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

function pongLeaver(){
	if (gameIsOver == true)
		return ;
	gameIsOver = true;
	alert("your stupid opponent left he is such a loser, you win !");
	navigateTo('game_choice');
	stopGame()
}

function stopGame() 
{
	gameIsOver = true;
	if(colorPicker)
		colorPicker.removeEventListener('input', handleColorPicked);

	if(game_mode == 'pong_online'){
		document.removeEventListener('keydown', rightKeyDownHandler);
		document.removeEventListener('keyup', rightKeyUpHandler);
	}
	
	document.removeEventListener('keydown', keyDownHandler);

	game_mode = "";
	document.removeEventListener("visibilitychange", onVisibilityChange);
	document.removeEventListener('keyup', keyUpHandler);
	leftPlayerScore = 0;
    rightPlayerScore = 0;
	balls = [];
	game_stop = true;
	if(rightPaddle)
		rightPaddle.deactivateAI();
	if(socket)
		delete socket;
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

	update();
	setBall(extra_ball_number);
	balls.push(new Ball(0,0,BALL_SPEED, randomValue(), ball_color))
}



function startOnlineMatch(data){
	console.log("starting online match");
	document.getElementById("play-link").style.visibility = 'hidden';
	
	leftPlayer = data.left;
	rightPlayer = data.right;

	document.getElementById('leftPlayerScore').textContent = leftPlayer + ': ' + leftPlayerScore;
	document.getElementById('rightPlayerScore').textContent = rightPlayer + ': ' + rightPlayerScore;	

	//delete the presentation ball
	balls[0].cleanup();
	balls = [];

	//first ball
	balls.push(new Ball(0,0,BALL_SPEED, randomValue(), ball_color))
	balls[0].setOnline(true);

	document.getElementById("customs").remove();
	
	if (data.side === 'left'){
		document.addEventListener('keydown', keyDownHandler);
		document.addEventListener('keyup', keyUpHandler);
		leftPaddle.setOnline(true);
		socket.sendInfo(balls[0].serialize());
	}
	else {
		document.addEventListener('keydown', rightKeyDownHandler);
		document.addEventListener('keyup', rightKeyUpHandler);
		rightPaddle.setOnline(true);
	}
}
