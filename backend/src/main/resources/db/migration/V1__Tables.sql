CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- todo auto delete these after like 15 mins of no activity
CREATE TABLE IF NOT EXISTS games (
    id CHAR(8) NOT NULL PRIMARY KEY,
    map_size VARCHAR(6) DEFAULT 'SMALL' NOT NULL
);

-- todo keep track of the last time that the player sent their position to the server. after 30 secs inactivity, remove from game
CREATE TABLE IF NOT EXISTS players (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id CHAR(8) NOT NULL REFERENCES games ON DELETE CASCADE,
    player_name VARCHAR(32) NOT NULL DEFAULT 'unknown',
    x INT NOT NULL DEFAULT 0,
    y INT NOT NULL DEFAULT 0,
    rotation SMALLINT NOT NULL DEFAULT 90
);
