
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(25) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL  /*hash it on django*/
);

CREATE TABLE pong_stats (
    user_id INTEGER PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
	games_won INTEGER DEFAULT 0,
    games_lost INTEGER DEFAULT 0,
	paddle_hits INTEGER DEFAULT 0,
	ball_travel_distance INTEGER DEFAULT 0,
	online_game_played INTEGER DEFAULT 0,
	offline_game_played INTEGER DEFAULT 0

);

CREATE TABLE up_stats (
    user_id INTEGER PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    games_won INTEGER DEFAULT 0,
    games_lost INTEGER DEFAULT 0,
    games_drawn INTEGER DEFAULT 0,
	jump_count INTEGER DEFAULT 0,
    travelled_distance INTEGER DEFAULT 0,
	online_game_played INTEGER DEFAULT 0,
	offline_game_played INTEGER DEFAULT 0
);