
const pages = {
    'game_choice':`
    <div class="container extra-top-padding">
    <div class="row justify-content-center mt-md-4 mt-2 mb-5 mx-md-0 mx-5 gy-4 mt-md-5 mt-3">
        <h1 class="display-5 text-center fw-bold text-white ">Choose Your Game</h1>
        <div class="col-lg-5 col-md-6 ">
            <img src="https://via.placeholder.com/1000" class=" shadow img-fluid image-button w-100 rounded-5 hover-scale" alt="Image 1" onclick="displayPage('pong_choices')">
        </div>
        <div class="col-lg-5 col-md-6 ">
            <img src="https://via.placeholder.com/1000" class="shadow img-fluid image-button w-100 rounded-5 hover-scale" alt="Image 1" onclick="location.href='#';">
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
            <button  type="button" class="btn btn-color btn-lg w-75 p-3 text-white">Dual Player</button>
        </div>
        <div class="col-12  text-center px-5">
            <button type="button" class="btn btn-color btn-lg w-75 p-3 text-white">AI Duel</button>
        </div>
        <div class="col-12  text-center px-5 mb-3">
            <button type="button" class="btn btn-color btn-lg  w-75 p-3 text-white">Tournament</button>
        </div>
    </div>
</div>`
}

function displayPage(pageName) 
{
    const content = document.getElementById('content');
    if (pages.hasOwnProperty(pageName)) 
    {
        content.innerHTML = pages[pageName];
    } 
}

