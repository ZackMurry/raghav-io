package com.zackmurry.raghavio.model.message;

import com.zackmurry.raghavio.model.Position;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PositionMessage {

    private UUID playerId;
    private Position position;
    private short rotation;

}
