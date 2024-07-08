function prepare_tournament()
{
	
	let pong_content = document.getElementById("pong-content");
	old_content = pong_content.innerHTML;
	pong_content.innerHTML = `<form>
	<div class="row gy-5 gx-5">
	   <div class="col-12 mb-3">
		<h1 class="text-white text-center"> Enter players name</h1>
	  </div>
	  <div class="col-6 form-group" >
		<label for="player1" class="text-white">First player</label>
		<input id="player1" type="text" class="form-control mt-2" placeholder="Player name" maxlength="15">
	  </div>
	  <div class="col-6 form-group">
		<label for="player2" class="text-white">Second player</label>
		<input id="player2" type="text" class="form-control mt-2" placeholder="Player name" maxlength="15">
	  </div>
	  <div class="col-6 form-group">
		<label for="player3" class="text-white">Third player</label>
		<input id="player3" type="text" class="form-control mt-2" placeholder="Player name" maxlength="15">
	  </div>
	  <div class="col-6 form-group">
		<label for="player4" class="text-white">Fourth player</label>
		<input id="player4" type="text" class="form-control mt-2" placeholder="Player name" maxlength="15">
	  </div>
	  <div class="col-12">
		  <button type="button" class="btn btn-color text-white w-50 d-block m-auto mt-4 py-3" onclick="validate_tournament_users()">Start</button>
	  </div>
	</div>
</form>`;


}

function validate_tournament_users()
{
	player1 = document.getElementById('player1').value.trim();
	player2 = document.getElementById('player2').value.trim();
	player3 = document.getElementById('player3').value.trim();
	player4 = document.getElementById('player4').value.trim();
	
	if (player1 !== '' && player2 !== '' && player3 !== '' && player4 !== '') 
	{
		document.getElementById("pong-content").innerHTML = old_content;
		
		round = 1;
		set_round();
		prepareGame();
	} 
}


function endRound(winner, loser)
{
	if(round == 1)
	{
		r1_winner = winner;
		r1_loser = loser;
	}
	else if(round == 2)
	{
		r2_winner = winner;
		r2_loser = loser
	}
	else if(round == 3)
	{
		first_pos = winner;
		second_pos = loser;
	}
	else if(round == 4)
	{
		third_pos = winner;
	}
	
	if(round < 4)
	{
		round++;
		document.getElementById("play-link").style.visibility = 'visible';
		document.getElementById("winner-text").innerHTML = winner + " won!";
		//restartGame();
	}
	else
	{
		document.getElementById("winner-text").innerHTML = "";
		$("#winModal").modal('show');
		document.getElementById('winner').innerHTML = `<p id="pos1"></p><p id="pos2"></p><p id="pos3"></p> `;
		document.getElementById("pos1").textContent = "First: " + first_pos;
		document.getElementById("pos2").textContent = "Second: " + second_pos;
		document.getElementById("pos3").textContent = "Third: " + third_pos;
	}
}

function set_round()
{
	let labelText;
	if(round == 1)
	{
		leftPlayer = player1;
		rightPlayer = player2;
		labelText = "First Match";
	}
	else if(round == 2)
	{
		leftPlayer = player3;
		rightPlayer = player4;
		labelText = "Second Match";
	}
	else if(round == 3)
	{
		
		leftPlayer = r1_winner;
		rightPlayer = r2_winner;
		labelText = "Final";
	}
	else if(round == 4)
	{
		leftPlayer = r1_loser;
		rightPlayer = r2_loser;
		labelText = "Third Place Playoff";
	}
	document.getElementById("round").innerHTML = labelText;
}