
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
    <div class="row   w-75 m-auto gy-2  rounded-4 dark-color-bg py-4">
        <div class="col-12 mb-3">
            <h5 class="text-center text-white h2 fw-bold ">Choose Your Game Mode</h5>
        </div>
        <div class="col-12  text-center px-5">
            <button  type="button" class="btn btn-color btn-lg w-75 p-3 text-white" onclick="navigateTo('pong')">Dual Player</button>
        </div>
        <div class="col-12  text-center px-5">
            <button type="button" class="btn btn-color btn-lg w-75 p-3 text-white" onclick="navigateTo('game_choice')">AI Duel</button>
        </div>
        <div class="col-12  text-center px-5 mb-3">
            <button type="button" class="btn btn-color btn-lg  w-75 p-3 text-white">Tournament</button>
        </div>
    </div>
</div>`,
	'pong': `<div class="container extra-top-padding mt-5" >

	<div id="canvasContainer">
		<canvas id="pongCanvas"></canvas>
	</div>

	<div id="scoreContainer">
		<span id="leftPlayerScore">Left Player: 0</span><br>
		<span id="rightPlayerScore">Right Player: 0</span>
	</div>

	<input type="color" id="colorPicker">
	<div class="color-box" id="colorBox"></div>

	<div>
		<input type="range" min="1" max="10" value="1" class="slider" id="ballSlider">
		<p>Value: <span id="ballSliderValue">1</span></p>
	</div>

	<div>
		<input type="range" min="1" max="5" value="1" step="0.01" class="slider" id="speedSlider">
		<p>Value: <span id="speedSliderValue">1</span></p>
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
    if (pages.hasOwnProperty(pageName)) 
    {
        content.innerHTML = pages[pageName];
		if(pageName == 'pong')
			executeGame();
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