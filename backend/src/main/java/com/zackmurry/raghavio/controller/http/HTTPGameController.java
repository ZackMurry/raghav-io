package com.zackmurry.raghavio.controller.http;

import com.zackmurry.raghavio.model.GameCreateRequest;
import com.zackmurry.raghavio.model.GameEntity;
import com.zackmurry.raghavio.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/games")
@RestController
public class HTTPGameController {

    @Autowired
    private GameService gameService;

    @PostMapping("")
    public GameEntity createGame(@RequestBody GameCreateRequest request) {
        return gameService.createGame(request);
    }

    @GetMapping("/id/{id}")
    public GameEntity getGameById(@PathVariable String id) {
        return gameService.getGameById(id);
    }

}
