package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskPriority;
import com.example.taskmanager.entity.RepeatType;
import com.example.taskmanager.entity.Subtask;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class TemplateRequest {
    @NotBlank private String name;
    private String title;
    private String description;
    private TaskPriority priority;
    private List<String> tags;
    private List<Subtask> subtasks;
    private RepeatType repeatType;
    private String reminderTime;

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
    public String getReminderTime() { return reminderTime; }
    public void setReminderTime(String reminderTime) { this.reminderTime = reminderTime; }
}
