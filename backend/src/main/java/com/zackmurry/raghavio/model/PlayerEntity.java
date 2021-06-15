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
public class PlayerEntity {
    private UUID id;
    private String gameId;
    private String playerName;
    private int x;
    private int y;
    private short rotation;
}
