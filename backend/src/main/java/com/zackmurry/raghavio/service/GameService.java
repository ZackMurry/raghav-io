package com.zackmurry.raghavio.service;

import com.zackmurry.raghavio.dao.game.GameDao;
import com.zackmurry.raghavio.exception.BadRequestException;
import com.zackmurry.raghavio.exception.NotFoundException;
import com.zackmurry.raghavio.model.GameCreateRequest;
import com.zackmurry.raghavio.model.GameEntity;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class GameService {

    @Autowired
    private GameDao gameDao;

    public GameEntity createGame(@NonNull GameCreateRequest request) {
        if (request.getMapSize() == null) {
            throw new BadRequestException();
        }
        final String id = RandomStringUtils.randomAlphabetic(8).toLowerCase(Locale.ROOT);
        final GameEntity gameEntity = new GameEntity(id, request.getMapSize());
        gameDao.createGame(gameEntity);
        return gameEntity;
    }

    public GameEntity getGameById(@NonNull String id) {
        return gameDao.getGameById(id).orElseThrow(NotFoundException::new);
    }

}
