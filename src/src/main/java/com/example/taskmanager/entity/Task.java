package com.example.taskmanager.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    @Field("userId")
    private String userId;

    @Field("title")
    private String title;

    @Field("description")
    private String description;

    @Field("status")
    private TaskStatus status = TaskStatus.TODO;

    @Field("priority")
    private TaskPriority priority = TaskPriority.P2;

    @Field("tags")
    private List<String> tags = new ArrayList<>();

    @Field("dueDate")
    private LocalDateTime dueDate;

    @Field("sortOrder")
    private Integer sortOrder = 0;

    @Field("subtasks")
    private List<Subtask> subtasks = new ArrayList<>();

    @Field("repeatType")
    private RepeatType repeatType;

    @Field("repeatStartDate")
    private LocalDateTime repeatStartDate;

    @Field("nextRepeatDate")
    private LocalDateTime nextRepeatDate;

    @Field("templateId")
    private String templateId;

    @Field("reminderTime")
    private LocalDateTime reminderTime;

    @Field("createdAt")
    private LocalDateTime createdAt;

    @Field("updatedAt")
    private LocalDateTime updatedAt;

    public Task() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
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
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public List<Subtask> getSubtasks() { return subtasks; }
    public void setSubtasks(List<Subtask> subtasks) { this.subtasks = subtasks; }
    public RepeatType getRepeatType() { return repeatType; }
    public void setRepeatType(RepeatType repeatType) { this.repeatType = repeatType; }
    public LocalDateTime getRepeatStartDate() { return repeatStartDate; }
    public void setRepeatStartDate(LocalDateTime repeatStartDate) { this.repeatStartDate = repeatStartDate; }
    public LocalDateTime getNextRepeatDate() { return nextRepeatDate; }
    public void setNextRepeatDate(LocalDateTime nextRepeatDate) { this.nextRepeatDate = nextRepeatDate; }
    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }
    public LocalDateTime getReminderTime() { return reminderTime; }
    public void setReminderTime(LocalDateTime reminderTime) { this.reminderTime = reminderTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
