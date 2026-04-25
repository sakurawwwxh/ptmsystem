package com.example.taskmanager.controller;

import com.example.taskmanager.dto.TaskRequest;
import com.example.taskmanager.dto.TaskRequest.SubtaskRequest;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.dto.TaskResponse.SubtaskResponse;
import com.example.taskmanager.entity.TaskPriority;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) TaskPriority priority,
            Authentication auth) {
        String userId = auth.getName();
        List<TaskResponse> tasks = taskService.getTasks(userId, status, tag, priority);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable String id, Authentication auth) {
        String userId = auth.getName();
        TaskResponse task = taskService.getTask(id, userId);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request, Authentication auth) {
        String userId = auth.getName();
        TaskResponse task = taskService.createTask(userId, request);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable String id, @Valid @RequestBody TaskRequest request, Authentication auth) {
        String userId = auth.getName();
        TaskResponse task = taskService.updateTask(id, userId, request);
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable String id, @RequestBody Map<String, TaskStatus> body, Authentication auth) {
        String userId = auth.getName();
        TaskStatus status = body.get("status");
        TaskResponse task = taskService.updateStatus(id, userId, status);
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{id}/priority")
    public ResponseEntity<TaskResponse> updatePriority(@PathVariable String id, @RequestBody Map<String, TaskPriority> body, Authentication auth) {
        String userId = auth.getName();
        TaskPriority priority = body.get("priority");
        TaskResponse task = taskService.updatePriority(id, userId, priority);
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{id}/sort")
    public ResponseEntity<TaskResponse> updateSortOrder(@PathVariable String id, @RequestBody Map<String, Integer> body, Authentication auth) {
        String userId = auth.getName();
        Integer sortOrder = body.get("sortOrder");
        TaskResponse task = taskService.updateSortOrder(id, userId, sortOrder);
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{id}/subtasks")
    public ResponseEntity<TaskResponse> updateSubtasks(@PathVariable String id, @RequestBody Map<String, List<SubtaskRequest>> body, Authentication auth) {
        String userId = auth.getName();
        List<SubtaskRequest> subtasks = body.get("subtasks");
        TaskResponse task = taskService.updateSubtasks(id, userId, subtasks);
        return ResponseEntity.ok(task);
    }

    @PostMapping("/{id}/decompose")
    public ResponseEntity<TaskResponse> decomposeTask(@PathVariable String id, Authentication auth) {
        String userId = auth.getName();
        TaskResponse task = taskService.decomposeTask(id, userId);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/{id}/suggestions")
    public ResponseEntity<List<SubtaskResponse>> getDecomposeSuggestions(@PathVariable String id, Authentication auth) {
        String userId = auth.getName();
        List<SubtaskResponse> suggestions = taskService.getDecomposeSuggestions(id, userId);
        return ResponseEntity.ok(suggestions);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id, Authentication auth) {
        String userId = auth.getName();
        taskService.deleteTask(id, userId);
        return ResponseEntity.noContent().build();
    }
}