package com.example.taskmanager.entity;

import java.util.UUID;

public class Subtask {

    private String id;
    private String title;
    private boolean completed;

    public Subtask() {
    }

    public Subtask(String title) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.completed = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
