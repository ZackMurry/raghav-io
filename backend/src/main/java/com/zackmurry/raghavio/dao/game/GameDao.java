package com.zackmurry.raghavio.dao.game;

import com.zackmurry.raghavio.model.GameEntity;

import java.util.Optional;

public interface GameDao {

    void createGame(GameEntity gameEntity);

    Optional<GameEntity> getGameById(String id);

}
