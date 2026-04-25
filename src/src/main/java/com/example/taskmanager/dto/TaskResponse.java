package com.example.taskmanager.dto;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.Subtask;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.entity.TaskPriority;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class TaskResponse {
    private String id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private List<String> tags;
    private LocalDateTime dueDate;
    private List<SubtaskResponse> subtasks;
    private int completedSubtasks;
    private int totalSubtasks;
    private String repeatType;
    private String templateId;
    private String nextRepeatDate;
    private String repeatStartDate;
    private String reminderTime;
    private String createdAt;
    private LocalDateTime updatedAt;

    public TaskResponse() {}

    public TaskResponse(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.status = task.getStatus();
        this.priority = task.getPriority();
        this.tags = task.getTags();
        this.dueDate = task.getDueDate();
        this.repeatType = task.getRepeatType() != null ? task.getRepeatType().name() : null;
        this.reminderTime = task.getReminderTime() != null ? task.getReminderTime().toString() : null;
        this.createdAt = task.getCreatedAt() != null ? task.getCreatedAt().toString() : null;
        this.updatedAt = task.getUpdatedAt();
        if (task.getSubtasks() != null) {
            this.subtasks = task.getSubtasks().stream()
                .map(SubtaskResponse::new)
                .collect(Collectors.toList());
            this.totalSubtasks = task.getSubtasks().size();
            this.completedSubtasks = (int) task.getSubtasks().stream().filter(Subtask::isCompleted).count();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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
    public List<SubtaskResponse> getSubtasks() { return subtasks; }
    public void setSubtasks(List<SubtaskResponse> subtasks) { this.subtasks = subtasks; }
    public int getCompletedSubtasks() { return completedSubtasks; }
    public void setCompletedSubtasks(int completedSubtasks) { this.completedSubtasks = completedSubtasks; }
    public int getTotalSubtasks() { return totalSubtasks; }
    public void setTotalSubtasks(int totalSubtasks) { this.totalSubtasks = totalSubtasks; }
    public String getRepeatType() { return repeatType; }
    public void setRepeatType(String repeatType) { this.repeatType = repeatType; }
    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }
    public String getNextRepeatDate() { return nextRepeatDate; }
    public void setNextRepeatDate(String nextRepeatDate) { this.nextRepeatDate = nextRepeatDate; }
    public String getRepeatStartDate() { return repeatStartDate; }
    public void setRepeatStartDate(String repeatStartDate) { this.repeatStartDate = repeatStartDate; }
    public String getReminderTime() { return reminderTime; }
    public void setReminderTime(String reminderTime) { this.reminderTime = reminderTime; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class SubtaskResponse {
        private String id;
        private String title;
        private boolean completed;

        public SubtaskResponse() {}

        public SubtaskResponse(com.example.taskmanager.entity.Subtask s) {
            this.id = s.getId();
            this.title = s.getTitle();
            this.completed = s.isCompleted();
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
    }
}