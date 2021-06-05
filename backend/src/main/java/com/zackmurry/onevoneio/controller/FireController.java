package com.zackmurry.onevoneio.controller;


import com.zackmurry.onevoneio.model.FireMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class FireController {

    private static final Logger logger = LoggerFactory.getLogger(FireController.class);

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/games/{gameId}/fire")
    public void updatePosition(@DestinationVariable String gameId, FireMessage fireMessage) {
        logger.info("{} shot a bullet from ({}, {}) with a rotation of {} degrees", fireMessage.getPlayerId(), fireMessage.getOrigin().getX(), fireMessage.getOrigin().getY(), fireMessage.getAngle());
        simpMessagingTemplate.convertAndSend("/topic/games/" + gameId + "/bullets", fireMessage);
    }

}
