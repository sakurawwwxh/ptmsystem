package com.example.taskmanager.controller;

import com.example.taskmanager.dto.TemplateRequest;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.entity.Template;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.service.TemplateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    @Autowired
    private TemplateService templateService;

    @GetMapping
    public ResponseEntity<List<TemplateResponse>> getTemplates(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        List<Template> templates = templateService.getTemplates(userId);
        List<TemplateResponse> response = templates.stream()
            .map(TemplateResponse::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemplateResponse> getTemplate(@PathVariable String id, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        Template template = templateService.getTemplate(id, userId);
        return ResponseEntity.ok(new TemplateResponse(template));
    }

    @PostMapping
    public ResponseEntity<TemplateResponse> createTemplate(
            @Valid @RequestBody TemplateRequest request,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        Template template = new Template();
        template.setName(request.getName());
        template.setTitle(request.getTitle());
        template.setDescription(request.getDescription());
        template.setPriority(request.getPriority());
        template.setTags(request.getTags());
        template.setSubtasks(request.getSubtasks());
        template.setRepeatType(request.getRepeatType());
        if (request.getReminderTime() != null && !request.getReminderTime().isEmpty()) {
            template.setReminderTime(java.time.LocalDateTime.parse(request.getReminderTime()));
        }
        Template created = templateService.createTemplate(template, userId);
        return ResponseEntity.ok(new TemplateResponse(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TemplateResponse> updateTemplate(
            @PathVariable String id,
            @Valid @RequestBody TemplateRequest request,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        Template updated = new Template();
        updated.setName(request.getName());
        updated.setTitle(request.getTitle());
        updated.setDescription(request.getDescription());
        updated.setPriority(request.getPriority());
        updated.setTags(request.getTags());
        updated.setSubtasks(request.getSubtasks());
        updated.setRepeatType(request.getRepeatType());
        if (request.getReminderTime() != null && !request.getReminderTime().isEmpty()) {
            updated.setReminderTime(java.time.LocalDateTime.parse(request.getReminderTime()));
        }
        Template result = templateService.updateTemplate(id, updated, userId);
        return ResponseEntity.ok(new TemplateResponse(result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        templateService.deleteTemplate(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<TaskResponse> applyTemplate(@PathVariable String id, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        Task task = templateService.applyTemplate(id, userId);
        return ResponseEntity.ok(new TaskResponse(task));
    }

    public static class TemplateResponse {
        private String id;
        private String name;
        private String title;
        private String description;
        private String priority;
        private List<String> tags;
        private List<SubtaskResponse> subtasks;
        private String repeatType;
        private String reminderTime;
        private String createdAt;

        public TemplateResponse(Template template) {
            this.id = template.getId();
            this.name = template.getName();
            this.title = template.getTitle();
            this.description = template.getDescription();
            this.priority = template.getPriority() != null ? template.getPriority().name() : null;
            this.tags = template.getTags();
            this.repeatType = template.getRepeatType() != null ? template.getRepeatType().name() : null;
            this.reminderTime = template.getReminderTime() != null ? template.getReminderTime().toString() : null;
            this.createdAt = template.getCreatedAt() != null ? template.getCreatedAt().toString() : null;
            if (template.getSubtasks() != null) {
                this.subtasks = template.getSubtasks().stream()
                    .map(SubtaskResponse::new)
                    .collect(Collectors.toList());
            }
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getPriority() { return priority; }
        public List<String> getTags() { return tags; }
        public List<SubtaskResponse> getSubtasks() { return subtasks; }
        public String getRepeatType() { return repeatType; }
        public String getReminderTime() { return reminderTime; }
        public String getCreatedAt() { return createdAt; }

        public static class SubtaskResponse {
            private String id;
            private String title;
            private boolean completed;

            public SubtaskResponse(com.example.taskmanager.entity.Subtask s) {
                this.id = s.getId();
                this.title = s.getTitle();
                this.completed = s.isCompleted();
            }

            public String getId() { return id; }
            public String getTitle() { return title; }
            public boolean isCompleted() { return completed; }
        }
    }
}
