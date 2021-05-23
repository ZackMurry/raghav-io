package com.zackmurry.onevoneio.controller;

import com.zackmurry.onevoneio.model.PositionMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class PositionController {

    private static final Logger logger = LoggerFactory.getLogger(PositionController.class);

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/position")
    public void updatePosition(PositionMessage positionMessage) {
//        logger.info("Position of {}: ({}, {}); rotation: {}", positionMessage.getName(), positionMessage.getPosition().getX(), positionMessage.getPosition().getY(), positionMessage.getRotation());
        simpMessagingTemplate.convertAndSend("/topic/positions", positionMessage);
    }

}
