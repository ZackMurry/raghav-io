package com.zackmurry.raghavio.controller.ws;

import com.zackmurry.raghavio.model.message.GameJoinMessage;
import com.zackmurry.raghavio.model.message.IAmMessage;
import com.zackmurry.raghavio.service.PlayerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * Controls joining and leaving games
 */
@Controller
public class GameController {

    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private PlayerService playerService;

    @MessageMapping("/games/{gameId}/join")
    public void joinGame(@DestinationVariable String gameId, @NonNull GameJoinMessage joinMessage) {
        if (joinMessage.getId() == null || joinMessage.getName() == null) {
            return;
        }
        logger.info("{} joined the game {}", joinMessage.getId(), gameId);
        playerService.joinGame(gameId, joinMessage.getName(), joinMessage.getId());
        simpMessagingTemplate.convertAndSend("/topic/games/" + gameId + "/joins", joinMessage);
    }

    @MessageMapping("/games/{gameId}/iam")
    public void sendPlayerInformation(@DestinationVariable String gameId, IAmMessage iAmMessage) {
        logger.info("{} sent an IAM message in {}", iAmMessage.getName(), gameId);
        simpMessagingTemplate.convertAndSend("/topic/games/" + gameId + "/iams", iAmMessage);
    }

}
