
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
            <button  type="button" class="btn btn-color btn-lg w-75 p-3 text-white" onclick="navigateTo('pong')">Dual Player</button>
        </div>
        <div class="col-12  text-center px-5">
            <button type="button" class="btn btn-color btn-lg w-75 p-3 text-white" onclick="navigateTo('pong_ai')">AI Duel</button>
        </div>
        <div class="col-12  text-center px-5 ">
            <button type="button" class="btn btn-color btn-lg  w-75 p-3 text-white">Online</button>
        </div>
        <div class="col-12  text-center px-5 mb-3">
            <button type="button" class="btn btn-color btn-lg  w-75 p-3 text-white">Tournament</button>
        </div>
    </div>
</div>`,
	'pong': `<div class="container extra-top-padding mt-5" >
    
    <div id="scoreContainer" class="d-flex">
        <div class="me-auto text-white h2">
            <span id="leftPlayerScore">Left Player: 0</span><br>
        </div>
        <div class="ms-auto text-white h2">
            <span id="rightPlayerScore">Right Player: 0</span>
        </div>
    </div>
	<div id="canvasContainer" class="position-relative mb-5">
		<canvas id="pongCanvas" class="d-block m-auto w-100"></canvas>
        <div id="play-link" class="position-absolute w-100 h-100 z-3 top-0 start-0 bg-dark opacity-50 ">
            <a class=" clickable hover-scale w-100 h-100 d-flex justify-content-center align-items-center link-body-emphasis link-underline-opacity-0" onclick="startMatch()">
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
            <div class="col-4 "><label class="form-label my-0  text-white h5">Ball Count: <span id="ballSliderValue">1</span></label></div>
            <div class="col-8 "><input type="range" min="1" max="10" value="1" class="slider " id="ballSlider"></div>
        </div>

        <div class="align-items-center mt-3 row">
            <div class="col-4 "> <label class="form-label my-0  text-white h5">Ball Speed: <span id="speedSliderValue">1</span></label></div>
            <div class="col-8 "><input type="range" min="1" max="5" value="1" step="0.01" class="slider " id="speedSlider"></div>
        </div>
	</div>
</div>`

}
window.addEventListener('popstate', function (event) {
    const pageName = event.state;
    if(event.state)
        displayPage(pageName);
    else
        displayPage('game_choice');

});

function displayPage(pageName) 
{
    const content = document.getElementById('content');

    if(pageName == 'pong_ai')
    {
        pageName = 'pong';
        ai_on = true;
    }
    if (pages.hasOwnProperty(pageName)) 
    {
        content.innerHTML = pages[pageName];
		if(pageName == 'pong')
			prepareGame();
		else
			stopGame();
    } 
}


function navigateTo(pageName)
{
 
    if (history.state !== pageName) 
        history.pushState(pageName, null, pageName);
    
    displayPage(pageName);
}

function initializePage() 
{
    
    let currentUrl = window.location.href;
    let substring = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    if(substring)
        displayPage(substring);
    else
    {
        history.pushState(null, null, null);
        displayPage('game_choice');
    }

}