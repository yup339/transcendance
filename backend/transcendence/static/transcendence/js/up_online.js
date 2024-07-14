function gameReady()
{
    document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
    console.log("GAME READY");
    // updateUpGame();
}