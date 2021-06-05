package com.zackmurry.raghavio.controller;

import com.zackmurry.raghavio.model.GameJoinMessage;
import com.zackmurry.raghavio.model.IAmMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

    @MessageMapping("/games/{gameId}/join")
    public void updatePosition(@DestinationVariable String gameId, GameJoinMessage joinMessage) {
        logger.info("{} joined the game {}", joinMessage.getId(), gameId);
        simpMessagingTemplate.convertAndSend("/topic/games/" + gameId + "/joins", joinMessage);
    }

    @MessageMapping("/games/{gameId}/iam")
    public void sendPlayerInformation(@DestinationVariable String gameId, IAmMessage iAmMessage) {
        logger.info("{} sent an IAM message in {}", iAmMessage.getName(), gameId);
        simpMessagingTemplate.convertAndSend("/topic/games/" + gameId + "/iams", iAmMessage);
    }

}
