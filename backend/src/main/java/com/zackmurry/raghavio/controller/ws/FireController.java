package com.zackmurry.raghavio.controller.ws;


import com.zackmurry.raghavio.model.message.FireMessage;
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
        simpMessagingTemplate.convertAndSend("/topic/games/" + gameId + "/bullets", fireMessage);
    }

}
