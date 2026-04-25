package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.entity.TaskPriority;
import com.example.taskmanager.entity.RepeatType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class TaskRequest {
    @NotBlank @Size(max = 200) private String title;
    @Size(max = 2000) private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private List<String> tags;
    private LocalDateTime dueDate;
    private List<SubtaskRequest> subtasks;
    private RepeatType repeatType;
    private LocalDateTime repeatStartDate;
    private String reminderTime;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    public List<SubtaskRequest> getSubtasks() { return subtasks; }
    public void setSubtasks(List<SubtaskRequest> subtasks) { this.subtasks = subtasks; }
    public RepeatType getRepeatType() { return repeatType; }
    public void setRepeatType(RepeatType repeatType) { this.repeatType = repeatType; }
    public LocalDateTime getRepeatStartDate() { return repeatStartDate; }
    public void setRepeatStartDate(LocalDateTime repeatStartDate) { this.repeatStartDate = repeatStartDate; }
    public String getReminderTime() { return reminderTime; }
    public void setReminderTime(String reminderTime) { this.reminderTime = reminderTime; }

    public static class SubtaskRequest {
        private String title;
        private boolean completed;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
    }
}