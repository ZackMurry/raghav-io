package com.zackmurry.onevoneio.controller;

import com.zackmurry.onevoneio.model.DeathMessage;
import com.zackmurry.onevoneio.model.FireMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class DeathController {

    private static final Logger logger = LoggerFactory.getLogger(DeathController.class);

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/death")
    public void updatePosition(DeathMessage deathMessage) {
        logger.info("{} died", deathMessage.getName());
        simpMessagingTemplate.convertAndSend("/topic/deaths", deathMessage);
    }

}