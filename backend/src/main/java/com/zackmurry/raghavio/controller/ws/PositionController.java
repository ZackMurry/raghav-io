package com.zackmurry.raghavio.controller.ws;

import com.zackmurry.raghavio.model.message.PositionMessage;
import com.zackmurry.raghavio.service.PlayerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class PositionController {

    private static final Logger logger = LoggerFactory.getLogger(PositionController.class);

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private PlayerService playerService;

    @MessageMapping("/games/{gameId}/position")
    public void updatePosition(@DestinationVariable String gameId, PositionMessage positionMessage) {
        // Ensure that the player isn't teleporting
        if (playerService.isPositionUpdateValid(positionMessage.getPlayerId(), positionMessage.getPosition())) {
            playerService.updatePlayerPosition(positionMessage.getPlayerId(), positionMessage.getPosition(), positionMessage.getRotation());
            simpMessagingTemplate.convertAndSend("/topic/games/" + gameId + "/positions", positionMessage);
        } else {
            final PositionMessage currentPosition = playerService.getPositionOfPlayer(positionMessage.getPlayerId()).orElse(null);
            if (currentPosition == null) {
                return;
            }
            simpMessagingTemplate.convertAndSend("/topic/games/" + gameId + "/positions", currentPosition);
        }
    }

}
