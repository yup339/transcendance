
const pages = {
    'game_choice':`
    <div class="container extra-top-padding">
    <div class="row justify-content-center mt-md-0 mt-2 mb-5 px-lg-5 gy-4 mt-md-5 mt-3">
        <h1 class="display-5 text-center fw-bold text-white ">Choose Your Game</h1>
        <div class="col-12 ">
            <img src="/static/transcendence/asset/pong_img_button.png" class=" clickable shadow img-fluid image-button img-button-width rounded-5 hover-scale d-block m-auto" alt="Image 1" onclick="navigateTo('pong_choices')">
        </div>
        <div class="col-12 ">
            <img src="/static/transcendence/asset/up-button.png" class=" clickable shadow img-fluid image-button img-button-width rounded-5 hover-scale d-block m-auto" alt="Image 1" onclick="navigateTo('up_choices')">
        </div>
        </div>
    </div>
    `,
    'pong_choices':`<div class="fullscreen ">
    <div class="row   w-75 m-auto gy-2  rounded-4 dark-color-bg shadow py-4">
        <div class="col-12 mb-3">
            <h5 class="text-center text-white h2 fw-bold ">Choose Your Game Mode</h5>
        </div>
        <div class="col-12  text-center px-5">
            <button  type="button" class="btn btn-color btn-lg w-75 p-3 text-white" onclick="navigateTo('pong_dual')">Dual Player</button>
        </div>
        <div class="col-12  text-center px-5">
            <button type="button" class="btn btn-color btn-lg w-75 p-3 text-white" onclick="navigateTo('pong_ai')">AI Duel</button>
        </div>
        <div class="col-12  text-center px-5 ">
            <button type="button" class="btn btn-color btn-lg  w-75 p-3 text-white" onclick="navigateTo('pong_online')"> Online</button>
        </div>
        <div class="col-12  text-center px-5 mb-3">
            <button type="button" class="btn btn-color btn-lg  w-75 p-3 text-white"  onclick="navigateTo('pong_tournament')">Tournament</button>
        </div>
    </div>
</div>`,
	'up_choices':`<div class="fullscreen ">
	<div class="row   w-75 m-auto gy-2  rounded-4 dark-color-bg shadow py-4">
		<div class="col-12 mb-3">
			<h5 class="text-center text-white h2 fw-bold ">Choose Your Game Mode</h5>
		</div>
		<div class="col-12  text-center px-5">
			<button  type="button" class="btn btn-color btn-lg w-75 p-3 text-white" onclick="navigateTo('up_dual')">Dual Player</button>
		</div>
		<div class="col-12  text-center px-5 ">
			<button type="button" class="btn btn-color btn-lg  w-75 p-3 text-white" onclick="navigateTo('up_online')">Online</button>
		</div>
	</div>`,
	'pong': `<div class="container extra-top-padding mt-5"  >
    <div id="pong-content">
		<div class="h1 text-white text-center p-3 mb-5" id="round"></div>
		<div id="scoreContainer" class="d-flex">
			<div class="me-auto text-white h2">
				<span id="leftPlayerScore"></span><br>
			</div>
			<div class="ms-auto text-white h2">
				<span id="rightPlayerScore"></span>
			</div>
		</div>
		<div id="canvasContainer" class="position-relative mb-5">
            <canvas id="pongCanvas" width="1280" height="720" class="d-block m-auto w-100"></canvas>
			<div id="play-link" class="position-absolute w-100 h-100 z-3 top-0 start-0 bg-dark opacity-50 ">
				<a class=" clickable hover-scale w-100 h-100 d-flex justify-content-center align-items-center link-body-emphasis link-underline-opacity-0" onclick="start_pong()">
				<div class=" mb-0 display-1 lead fw-bold text-white  border px-5 py-3 rounded-5 row" >
				<div class="col-12 text-center p-0" id="winner-text"></div>
				<div class="col-12 text-center p-0">Play</div>
				</div>
				</a>
			</div>
		</div>
		<div id="customs" class="my-5">
			<div class=" align-items-center row">
				<div class="col-4 "><label class="form-label my-0 text-white h5">Ball Color</label></div>
				<div class="col-8 "><input type="color" class="w-25" id="colorPicker"></div>
				<div class="color-box" id="colorBox"></div>
			</div>

			<div class="align-items-center mt-3 row">
				<div class="col-4 "> <label class="form-label my-0  text-white h5">Score to win: <span id="scoreSliderValue">1</span></label></div>
				<div class="col-8 "><input type="range" min="5" max="50" value="10" step="1" class="slider " id="scoreSlider"></div>
			</div>

			<div class="align-items-center mt-3 row">
				<div class="col-4 "><label class="form-label my-0  text-white h5">Ball Count: <span id="ballSliderValue">1</span></label></div>
				<div class="col-8 "><input type="range" min="1" max="10" value="1" class="slider " id="ballSlider"></div>
			</div>

			<div class="align-items-center mt-3 row">
				<div class="col-4 "> <label class="form-label my-0  text-white h5">Ball Speed: <span id="speedSliderValue">1</span></label></div>
				<div class="col-8 "><input type="range" min="1" max="4" value="2" step="0.01" class="slider " id="speedSlider"></div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="winModal" tabindex="-1" role="dialog" aria-labelledby="winModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
<div class="modal-dialog modal-dialog-centered " role="document">
	<div class="modal-content dark-color-bg text-white">
		<div class="modal-body p-5">
			<p class="tp-4 p-5 text-center text-white h1" id="winner"></p>
			<button type="button" class="btn btn-color text-white d-block m-auto w-75 py-3" onclick="window.location.reload()">Play again</button>
			<button type="button" data-dismiss="modal" aria-label="Close" class="close btn btn-color text-white d-block m-auto w-75 py-3 mt-3" onclick="navigateTo('game_choice')">Menu</button>
		</div>
	</div>
</div>
</div>`,
'up': `
<div class="w-100 extra-top-padding container mt-5">
<canvas id="UpCanvas" width="1920" height="1080" class="m-auto d-block w-100 h-100"></canvas>
 <div class="d-flex justify-content-between text-center w-200">
        <div class="text-white fixed-width player-container">
            <div id="namePlayer1" class="display-6"></div>
            <div id="scorePlayer1" class="display-6"></div>
        </div>
        <div class="fixed-width player-container">
            <div id="gameTime" class="display-6"></div>
        </div>
        <div class="text-white fixed-width player-container">
            <div id="namePlayer2" class="display-6"></div>
            <div id="scorePlayer2" class="display-6"></div>
        </div>
    </div>
<div class="modal fade" id="endModal" tabindex="-1" role="dialog" aria-labelledby="endModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
<div class="modal-dialog modal-dialog-centered " role="document">
	<div class="modal-content dark-color-bg text-white">
		<div class="modal-body p-5">
			<p class="tp-4 p-5 text-center text-white h1" id="labelWinner"></p>
			<button type="button" class="btn btn-color text-white d-block m-auto w-75 py-3" onclick="window.location.reload()">Play again</button>
			<button type="button" data-dismiss="modal" aria-label="Close" class="close btn btn-color text-white d-block m-auto w-75 py-3 mt-3" onclick="navigateTo('game_choice')">Menu</button>
		</div>
	</div>
</div>
</div>
 <style>
        .fixed-width {
            width: 100px;
        }
        .player-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            text-align: center;
        }
    </style>`
,
'signup':`
<div class="container extra-top-padding mt-5">
<form id="myForm">
	<div class="row w-50 m-auto gy-5 gx-5">
	   <div class="col-12 mb-3">
		<h1 class="text-white text-center">Sign Up</h1>
	  </div>
	  <div class="col-12 form-group">
		<input id="username" type="text" class="form-control mt-2" placeholder="Username" maxlength="15">
	  </div>
	  <div class="col-12 form-group">
		<input id="password" type="password" class="form-control mt-2" placeholder="Password" maxlength="100">
	  </div>
	  <div class="col-12">
		  <button type="button" class="btn btn-color text-white w-50 d-block m-auto mt-4 py-3" onclick="register_user()">Sign Up</button>
	  </div>
	</div>
</form>
</div>`,
'login':`
<div class="container extra-top-padding  mt-5">
<form id="myForm">
	<div class="row w-50 m-auto gy-5 gx-5">
	   <div class="col-12 mb-3">
		<h1 class="text-white text-center">Log in</h1>
	  </div>
	  <div class="col-12 form-group">
		<input id="username" type="text" class="form-control mt-2" placeholder="Username" maxlength="15">
	  </div>
	  <div class="col-12 form-group">
		<input id="password" type="password" class="form-control mt-2" placeholder="Password" maxlength="100">
	  </div>
	  <div class="col-12">
		  <button type="button" class="btn btn-color text-white w-50 d-block m-auto mt-4 py-3" onclick="login_user()">Login</button>
	  </div>
	</div>
</form>
</div>`,
'stats':`
<div class="container extra-top-padding mt-5">
        <div class="row m-auto gy-5 gx-5 gap-5 mb-5">
			<div class="row col-xl-6 col-12" >
				<div class="col-12 mb-3 py-3">
					<h1 class="text-white text-center ">Pong Game Stats</h1>
				</div>
				<div class="col-6 py-3">
					<label  class="text-white text-center d-block m-auto ">Total Games Played:</label>
					<p id="pong_total_games" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
					<label  class="text-white text-center d-block m-auto ">Wins:</label>
					<p id="pong_won" class="stats mt-2 m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
					<label  class="text-white text-center d-block m-auto ">Losses:</label>
					<p id="pong_lost" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
				<label  class="text-white text-center d-block m-auto ">Win Rate:</label>
				<p id="win_rate" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
				<label  class="text-white text-center d-block m-auto ">Online games played:</label>
				<p id="pong_online_game_played" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
				<label  class="text-white text-center d-block m-auto ">Offline games played:</label>
				<p id="pong_offline_game_played" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
				<label  class="text-white text-center d-block m-auto ">Traveled distance:</label>
				<p id="ball_travel_distance" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
					<label  class="text-white text-center d-block m-auto ">Paddle hits:</label>
					<p id="paddle_hits" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
			</div>
			<div class="row col-xl-6 col-12 " >
				<div class="col-12 mb-3 py-3">
					<h1 class="text-white text-center ">Up Game Stats</h1>
				</div>
				<div class="col-6 py-3">
					<label  class="text-white text-center d-block m-auto ">Total Games Played:</label>
					<p id="up_total_games" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
				<label  class="text-white text-center d-block m-auto ">Wins:</label>
				<p id="up_won" class=" stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
					<label  class="text-white text-center d-block m-auto ">Losses:</label>
					<p id="up_lost" class="stats mt-2 m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
					<label  class="text-white text-center d-block m-auto ">Draws:</label>
					<p id="up_drawn" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
					<label  class="text-white text-center d-block m-auto ">Online games played:</label>
					<p id="up_online_game_played" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
					<label  class="text-white text-center d-block m-auto ">Offline games played:</label>
					<p id="up_offline_game_played" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
				<label  class="text-white text-center d-block m-auto ">Total distance:</label>
				<p id="travelled_distance" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
				<div class="col-6 py-3">
					<label  class="text-white text-center d-block m-auto ">Jumps:</label>
					<p id="jump_count" class="stats mt-2  m-auto text-center py-5 dark-color-bg text-white overflow-hidden rounded-5">  </p>
				</div>
			</div>
		</div>
</div>`,
'loading_page':`<div class="loading-container d-flex flex-column justify-content-center align-items-center">
    <div class="spinner-border text-white mb-3" role="status">
    </div>
    <div class="loading-text text-white">Loading Game...</div>
</div>
<style>
    .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #343a40;
        }
    .spinner-border {
    width: 5rem;
    height: 5rem;
    border: 0.5rem solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite, changeColor 1.5s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes changeColor {
    0% {
        border-top-color: blue;
    }
    25% {
        border-top-color: green;
    }
    50% {
        border-top-color: red;
    }
    75% {
        border-top-color: yellow;
    }
    100% {
        border-top-color: purple;
    }
}
    .loading-text {
        font-size: 1.5rem;
    }
</style>`

}

//page format for error 404
const page404 = ` <div class="fullscreen"><h1 class="big-text text-white text-center m-0 p-0">404</h1></div>`

window.addEventListener('popstate', function (event) {
    const pageName = event.state;
    
    if (socket)
        socket.disconnect();

	if ($('#winModal').hasClass('show')) 
	{ 
		$('#winModal').modal('hide');
	}

    if(event.state)
        displayPage(pageName);
    else
	{
        displayPage('game_choice');
	}

});

function register_user()
{
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const data = {type: 'register', username: username, password: password};
    
    if (username.length < 3 || password.length < 8)
    {
        alert("Username must be at least 3 characters long and password must be at least 8 characters long.");
        return
    }
    if (!user)
    {
        user = new UserSocket();
    }    
    user.sendInfo(JSON.stringify(data));
}

function login_user()
{
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const data = {type:'login', username: username, password: password};

    if (!user)
    {
        user = new UserSocket();
    }
    user.sendInfo(JSON.stringify(data));
}

function logout_user()
{
	const navid = document.getElementById('navid');
    localStorage.removeItem('token');
    user.sendInfo(JSON.stringify({type: 'logout'}));
	user.loggedIn = false;
    navigateTo('game_choice');
	navid.innerHTML = `  <a class="nav-item nav-link active clickable" onclick="navigateTo('signup')">Sign Up</a>
                    <a class="nav-item nav-link active clickable" onclick="navigateTo('login')">Log in</a>`;
}

function displayPage(pageName) 
{
    const content = document.getElementById('content');
	
	//all pong modes
    if(pageName == 'pong_ai' || pageName == 'pong_dual' || pageName == 'pong_tournament' || pageName == 'pong_online' )
    {
		game_mode = pageName;
        pageName = 'pong';
    }
	else if(pageName == 'up_ai' || pageName == 'up_dual' || pageName == 'up_online' || pageName == 'up_tournament')
    {
		game_mode = pageName;
        pageName = 'up';
	}
	else if(pageName == 'stats' && !user.loggedIn){
		navigateTo('game_choice');
		return ;
	}
	else if (pageName == 'login' || pageName == 'signup')
	{
		if(user.loggedIn)
		{
			console.log("How the hell did you even get here?");
			navigateTo('game_choice');
			return;
		}
	}
	

    if (pages.hasOwnProperty(pageName)) 
    {
		
        content.innerHTML = pages[pageName];
		if(pageName == 'pong')
			PongGame();
		else if(pageName == 'up')
			UpGame();
		else if(pageName == 'stats'){
			setStats();
		}
		else
		{
			stopGame();
			upStop();
		}
    } 
	else
	{
		stopGame();
		upStop();
		content.innerHTML = page404;
	}
}


function navigateTo(pageName)
{
    if (socket)
        socket.disconnect();
    if (history.state !== pageName) 
        history.pushState(pageName, null, pageName);
    
    displayPage(pageName);
}

var user;

//called at first and when you refresh page
function initializePage() 
{
	const pathname = window.location.pathname;
	const route = pathname.substring(1);
    user = new UserSocket();
	$(document).keypress(function(e) {
		if(e.which == 13) {
			page = window.location.pathname.substring(1);
			if(page == 'signup')
				register_user();
			else if (page== 'login')
				login_user();
		}
	});
    if(route)
		navigateTo(route);
    else
    {
        displayPage('game_choice');
    }
}

//force reload the page when typping new url and pressing back
window.addEventListener('pageshow', function(event) {
    
    if (event.persisted) {
        window.location.reload();
    }
});


