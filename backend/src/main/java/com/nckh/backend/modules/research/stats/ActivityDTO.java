package com.nckh.backend.modules.research.stats;

import java.util.Date;

public class ActivityDTO {
    private String type; // TOPIC, PAPER, PRODUCT, USER
    private String action; // CREATED, UPDATED, COMPLETED
    private String description;
    private Date timestamp;
    private String color; // blue, green, orange, red

    public ActivityDTO() {}

    public ActivityDTO(String type, String action, String description, Date timestamp, String color) {
        this.type = type;
        this.action = action;
        this.description = description;
        this.timestamp = timestamp;
        this.color = color;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
