package com.zackmurry.onevoneio.controller;

import com.zackmurry.onevoneio.model.GameJoinMessage;
import com.zackmurry.onevoneio.model.IAmMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

    @MessageMapping("/games/join")
    public void updatePosition(GameJoinMessage joinMessage) {
        logger.info("{} joined the game", joinMessage.getId());
        simpMessagingTemplate.convertAndSend("/topic/game/join", joinMessage);
    }

    @MessageMapping("/games/iam")
    public void sendPlayerInformation(IAmMessage iAmMessage) {
        logger.info("{} sent an IAM message", iAmMessage.getName());
        simpMessagingTemplate.convertAndSend("/topic/game/iam", iAmMessage);
    }

}
