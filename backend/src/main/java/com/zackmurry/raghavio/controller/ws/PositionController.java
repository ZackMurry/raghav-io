package com.zackmurry.raghavio.controller.ws;

import com.zackmurry.raghavio.model.message.PositionMessage;
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

    @MessageMapping("/games/{gameId}/position")
    public void updatePosition(@DestinationVariable String gameId, PositionMessage positionMessage) {
//        logger.info("Position of {}: ({}, {}); rotation: {}", positionMessage.getName(), positionMessage.getPosition().getX(), positionMessage.getPosition().getY(), positionMessage.getRotation());
        simpMessagingTemplate.convertAndSend("/topic/games/" + gameId + "/positions", positionMessage);
    }

}
