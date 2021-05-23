package com.zackmurry.onevoneio.controller;


import com.zackmurry.onevoneio.model.FireMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class FireController {

    private static final Logger logger = LoggerFactory.getLogger(FireController.class);

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/fire")
    public void updatePosition(FireMessage fireMessage) {
        logger.info("{} shot a bullet from ({}, {}) with a rotation of {} degrees", fireMessage.getName(), fireMessage.getOrigin().getX(), fireMessage.getOrigin().getY(), fireMessage.getAngle());
        simpMessagingTemplate.convertAndSend("/topic/bullets", fireMessage);
    }

}
