package com.example.taskmanager.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "templates")
public class Template {

    @Id
    private String id;

    @Field("userId")
    private String userId;

    @Field("name")
    private String name;

    @Field("title")
    private String title;

    @Field("description")
    private String description;

    @Field("priority")
    private TaskPriority priority = TaskPriority.P2;

    @Field("tags")
    private List<String> tags = new ArrayList<>();

    @Field("subtasks")
    private List<Subtask> subtasks = new ArrayList<>();

    @Field("repeatType")
    private RepeatType repeatType;

    @Field("reminderTime")
    private LocalDateTime reminderTime;

    @Field("createdAt")
    private LocalDateTime createdAt;

    public Template() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public List<Subtask> getSubtasks() { return subtasks; }
    public void setSubtasks(List<Subtask> subtasks) { this.subtasks = subtasks; }
    public RepeatType getRepeatType() { return repeatType; }
    public void setRepeatType(RepeatType repeatType) { this.repeatType = repeatType; }
    public LocalDateTime getReminderTime() { return reminderTime; }
    public void setReminderTime(LocalDateTime reminderTime) { this.reminderTime = reminderTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
