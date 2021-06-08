-- todo auto delete these after like 15 mins of no activity
CREATE TABLE games (
    id CHAR(8) NOT NULL PRIMARY KEY,
    map_size VARCHAR(6) DEFAULT 'SMALL' NOT NULL
);
