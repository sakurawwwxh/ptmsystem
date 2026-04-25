package com.example.taskmanager.dto;

import com.example.taskmanager.entity.RelationType;
import jakarta.validation.constraints.NotBlank;

public class RelationRequest {
    @NotBlank private String targetTaskId;
    private RelationType relationType;

    public String getTargetTaskId() { return targetTaskId; }
    public void setTargetTaskId(String targetTaskId) { this.targetTaskId = targetTaskId; }
    public RelationType getRelationType() { return relationType; }
    public void setRelationType(RelationType relationType) { this.relationType = relationType; }
}
