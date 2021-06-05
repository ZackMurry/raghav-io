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
public class IAmMessage {

    private UUID id;
    private String name;
    private Position position;
    private short rotation;

}
