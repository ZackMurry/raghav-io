package com.zackmurry.onevoneio.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FireMessage {

    // todo use player ids instead of names
    private String name;
    private Position origin;
    private short angle;
    private long time;
    private String id;

}
