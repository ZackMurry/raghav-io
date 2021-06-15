package com.zackmurry.raghavio.dao.player;

import com.zackmurry.raghavio.model.PlayerEntity;
import com.zackmurry.raghavio.model.Position;

import java.util.Optional;
import java.util.UUID;

public interface PlayerDao {

    void createPlayer(PlayerEntity playerEntity);

    void updatePositionOfPlayer(UUID playerId, Position position, short rotation);

    Optional<PlayerEntity> getPlayerById(UUID id);

}