package com.zackmurry.onevoneio.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PositionMessage {

    private String name;
    private Position position;
    private Direction direction;

}
