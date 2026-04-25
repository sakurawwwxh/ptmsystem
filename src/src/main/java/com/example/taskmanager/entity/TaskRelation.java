package com.example.taskmanager.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "task_relations")
public class TaskRelation {

    @Id
    private String id;

    @Field("userId")
    private String userId;

    @Field("sourceTaskId")
    private String sourceTaskId;

    @Field("targetTaskId")
    private String targetTaskId;

    @Field("relationType")
    private RelationType relationType;

    @Field("createdAt")
    private LocalDateTime createdAt;

    public TaskRelation() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getSourceTaskId() { return sourceTaskId; }
    public void setSourceTaskId(String sourceTaskId) { this.sourceTaskId = sourceTaskId; }
    public String getTargetTaskId() { return targetTaskId; }
    public void setTargetTaskId(String targetTaskId) { this.targetTaskId = targetTaskId; }
    public RelationType getRelationType() { return relationType; }
    public void setRelationType(RelationType relationType) { this.relationType = relationType; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
