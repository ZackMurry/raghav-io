package com.zackmurry.raghavio.service;

import com.zackmurry.raghavio.dao.player.PlayerDao;
import com.zackmurry.raghavio.model.PlayerEntity;
import com.zackmurry.raghavio.model.Position;
import com.zackmurry.raghavio.model.message.PositionMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class PlayerService {

    private static final int MAX_ATOMIC_PLAYER_MOVE_DISTANCE = 50;
    private static final Logger logger = LoggerFactory.getLogger(PlayerService.class);

    @Autowired
    private PlayerDao playerDao;

    public void joinGame(String gameId, String playerName, UUID playerId) {
        playerDao.createPlayer(
                new PlayerEntity(
                        playerId,
                        gameId,
                        playerName,
                        0,
                        0,
                        (short) 90
                )
        );
    }

    public boolean isPositionUpdateValid(@NonNull UUID playerId, @NonNull Position position) {
        final PlayerEntity playerEntity = playerDao.getPlayerById(playerId).orElse(null);
        if (playerEntity == null) {
            return false;
        }
        // Using Manhattan distance for simplicity
        final int manhattanDistance = Math.abs(position.getX() - playerEntity.getX()) + Math.abs(position.getY() - playerEntity.getY());
        if (manhattanDistance <= MAX_ATOMIC_PLAYER_MOVE_DISTANCE) {
            return true;
        }
        logger.warn("Player position update invalid -- distance: {}", manhattanDistance);
        return false;
    }

    public void updatePlayerPosition(@NonNull UUID playerId, @NonNull Position position, short rotation) {
        playerDao.updatePositionOfPlayer(playerId, position, rotation);
    }

    public Optional<PositionMessage> getPositionOfPlayer(@NonNull UUID playerId) {
        final PlayerEntity playerEntity = playerDao.getPlayerById(playerId).orElse(null);
        if (playerEntity == null) {
            return Optional.empty();
        }
        return Optional.of(new PositionMessage(playerId, new Position(playerEntity.getX(), playerEntity.getY()), playerEntity.getRotation()));
    }

}
