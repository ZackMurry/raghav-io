package com.zackmurry.raghavio.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FireMessage {

    // todo use player ids instead of names
    private UUID playerId;
    private Position origin;
    private short angle;
    private long time;
    private UUID id;

}
