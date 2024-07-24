
function setStats(){
    const stat_collection = document.getElementsByClassName('stats');
    const stats = user.stats.stats;

    if(stat_collection){

    const stats_elements = Array.from(stat_collection);
    
    stats_elements.forEach((element) => {

        if(element.id === 'pong_total_games'){
            element.textContent = stats.pong_online_game_played  
                + stats.pong_offline_game_played
        }
        else if(element.id === 'up_total_games'){
            element.textContent = stats.up_online_game_played  
            + stats.up_offline_game_played
        }
        else if(element.id === 'win_rate'){
            element.textContent = (stats.pong_lost > 0 ? stats.pong_won / stats.pong_lost : stats.pong_won).toFixed(2);
        }
        else{
            Object.keys(stats).forEach((key) => {
                
                if(key === element.id){
                    element.textContent = stats[key];
                }
            })
        }
    });
    }
}