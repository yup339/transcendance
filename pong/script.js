
const pages = {
    'game_choice':`
    <div class="container extra-top-padding">
    <div class="row justify-content-center mt-md-0 mt-2 mb-5 px-lg-5 gy-4 mt-md-5 mt-3">
        <h1 class="display-5 text-center fw-bold text-white ">Choose Your Game</h1>
        <div class="col-12 ">
            <img src="pong_img_button.png" class=" clickable shadow img-fluid image-button img-button-width rounded-5 hover-scale d-block m-auto" alt="Image 1" onclick="navigateTo('pong_choices')">
        </div>
        <div class="col-12 ">
            <img src="pong_img_button.png" class="clickable shadow img-fluid image-button img-button-width rounded-5 hover-scale d-block m-auto" alt="Image 1" onclick="location.href='#';">
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
            <button type="button" class="btn btn-color btn-lg  w-75 p-3 text-white">Online</button>
        </div>
        <div class="col-12  text-center px-5 mb-3">
            <button type="button" class="btn btn-color btn-lg  w-75 p-3 text-white"  onclick="navigateTo('pong_tournament')">Tournament</button>
        </div>
    </div>
</div>`,
	'pong': `<div class="container extra-top-padding mt-5"  >
    <div id="pong-content">
		<div class="h1 text-white text-center p-3 mb-5" id="round"> Round: 1</div>
		<div id="scoreContainer" class="d-flex">
			<div class="me-auto text-white h2">
				<span id="leftPlayerScore"></span><br>
			</div>
			<div class="ms-auto text-white h2">
				<span id="rightPlayerScore"></span>
			</div>
		</div>
		<div id="canvasContainer" class="position-relative mb-5">
			<canvas id="pongCanvas" class="d-block m-auto w-100"></canvas>
			<div id="play-link" class="position-absolute w-100 h-100 z-3 top-0 start-0 bg-dark opacity-50 ">
				<a class=" clickable hover-scale w-100 h-100 d-flex justify-content-center align-items-center link-body-emphasis link-underline-opacity-0" onclick="start_pong()">
				<p class=" mb-0 display-1 lead fw-bold text-white border px-5 py-3 rounded-5 ">Play</p>
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
				<div class="col-8 "><input type="range" min="1" max="5" value="2" step="0.01" class="slider " id="speedSlider"></div>
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
</div>`

}

//page format for error 404
const page404 = ` <div class="fullscreen"><h1 class="big-text text-white text-center m-0 p-0">404</h1></div>`

window.addEventListener('popstate', function (event) {
    const pageName = event.state;
	
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

function displayPage(pageName) 
{
    const content = document.getElementById('content');
	
	//all pong modes
    if(pageName == 'pong_ai' || pageName == 'pong_dual' || pageName == 'pong_tournament')
    {
		game_mode = pageName;
        pageName = 'pong';
    }
	
    if (pages.hasOwnProperty(pageName)) 
    {
		
        content.innerHTML = pages[pageName];
		if(pageName == 'pong')
			PongGame();
		else
			stopGame();
    } 
	else
	{
		stopGame();
		content.innerHTML = page404;
	}
}


function navigateTo(pageName)
{

    if (history.state !== pageName) 
        history.pushState(pageName, null, pageName);
    
    displayPage(pageName);
}

//called at first and when you refresh page
function initializePage() 
{
	const pathname = window.location.pathname;
	const route = pathname.substring(1);
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