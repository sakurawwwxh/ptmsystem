package com.example.taskmanager.controller;

import com.example.taskmanager.dto.RelationRequest;
import com.example.taskmanager.entity.TaskRelation;
import com.example.taskmanager.entity.RelationType;
import com.example.taskmanager.service.TaskRelationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskRelationController {

    @Autowired
    private TaskRelationService relationService;

    @GetMapping("/tasks/{taskId}/relations")
    public ResponseEntity<List<TaskRelationResponse>> getTaskRelations(
            @PathVariable String taskId,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        List<TaskRelation> relations = relationService.getTaskRelations(taskId, userId);
        List<TaskRelationResponse> response = relations.stream()
            .map(TaskRelationResponse::new)
            .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/tasks/{taskId}/relations")
    public ResponseEntity<TaskRelationResponse> createRelation(
            @PathVariable String taskId,
            @Valid @RequestBody RelationRequest request,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        RelationType type = request.getRelationType() != null ? request.getRelationType() : RelationType.RELATED_TO;
        TaskRelation relation = relationService.createRelation(taskId, request.getTargetTaskId(), type, userId);
        return ResponseEntity.ok(new TaskRelationResponse(relation));
    }

    @DeleteMapping("/relations/{id}")
    public ResponseEntity<Void> deleteRelation(@PathVariable String id, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        relationService.deleteRelation(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/tasks/{taskId}/blocking")
    public ResponseEntity<List<TaskRelationResponse>> getBlockingTasks(
            @PathVariable String taskId,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        List<TaskRelation> relations = relationService.getBlockingTasks(taskId, userId);
        List<TaskRelationResponse> response = relations.stream()
            .map(TaskRelationResponse::new)
            .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tasks/{taskId}/blocked")
    public ResponseEntity<List<TaskRelationResponse>> getBlockedTasks(
            @PathVariable String taskId,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        List<TaskRelation> relations = relationService.getBlockedTasks(taskId, userId);
        List<TaskRelationResponse> response = relations.stream()
            .map(TaskRelationResponse::new)
            .toList();
        return ResponseEntity.ok(response);
    }

    public static class TaskRelationResponse {
        private String id;
        private String sourceTaskId;
        private String targetTaskId;
        private String relationType;
        private String createdAt;

        public TaskRelationResponse(TaskRelation relation) {
            this.id = relation.getId();
            this.sourceTaskId = relation.getSourceTaskId();
            this.targetTaskId = relation.getTargetTaskId();
            this.relationType = relation.getRelationType().name();
            this.createdAt = relation.getCreatedAt() != null ? relation.getCreatedAt().toString() : null;
        }

        public String getId() { return id; }
        public String getSourceTaskId() { return sourceTaskId; }
        public String getTargetTaskId() { return targetTaskId; }
        public String getRelationType() { return relationType; }
        public String getCreatedAt() { return createdAt; }
    }
}
