package com.example.taskmanager.service;

import com.example.taskmanager.entity.Template;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskPriority;
import com.example.taskmanager.entity.Subtask;
import com.example.taskmanager.entity.RepeatType;
import com.example.taskmanager.repository.TemplateRepository;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final TaskRepository taskRepository;

    public TemplateService(TemplateRepository templateRepository, TaskRepository taskRepository) {
        this.templateRepository = templateRepository;
        this.taskRepository = taskRepository;
    }

    public List<Template> getTemplates(String userId) {
        return templateRepository.findByUserId(userId);
    }

    public Template getTemplate(String id, String userId) {
        return templateRepository.findById(id)
            .filter(t -> t.getUserId().equals(userId))
            .orElseThrow(() -> new RuntimeException("Template not found"));
    }

    public Template createTemplate(Template template, String userId) {
        template.setUserId(userId);
        template.setCreatedAt(LocalDateTime.now());
        return templateRepository.save(template);
    }

    public Template updateTemplate(String id, Template updated, String userId) {
        Template template = getTemplate(id, userId);
        template.setName(updated.getName());
        template.setTitle(updated.getTitle());
        template.setDescription(updated.getDescription());
        template.setPriority(updated.getPriority());
        template.setTags(updated.getTags());
        template.setSubtasks(updated.getSubtasks());
        template.setRepeatType(updated.getRepeatType());
        template.setReminderTime(updated.getReminderTime());
        return templateRepository.save(template);
    }

    public void deleteTemplate(String id, String userId) {
        Template template = getTemplate(id, userId);
        templateRepository.delete(template);
    }

    public Task applyTemplate(String templateId, String userId) {
        Template template = getTemplate(templateId, userId);

        Task task = new Task();
        task.setUserId(userId);
        task.setTitle(template.getTitle());
        task.setDescription(template.getDescription());
        task.setPriority(template.getPriority() != null ? template.getPriority() : TaskPriority.P2);
        task.setTags(template.getTags());
        task.setRepeatType(template.getRepeatType());
        task.setTemplateId(templateId);
        if (template.getReminderTime() != null) {
            task.setReminderTime(template.getReminderTime());
        }
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        if (template.getRepeatType() != null) {
            task.setRepeatStartDate(LocalDateTime.now());
            task.setNextRepeatDate(calculateNextRepeat(LocalDateTime.now(), template.getRepeatType()));
        }

        if (template.getSubtasks() != null && !template.getSubtasks().isEmpty()) {
            List<Subtask> subtasks = template.getSubtasks().stream()
                .map(s -> {
                    Subtask st = new Subtask();
                    st.setId(UUID.randomUUID().toString());
                    st.setTitle(s.getTitle());
                    st.setCompleted(false);
                    return st;
                })
                .collect(Collectors.toList());
            task.setSubtasks(subtasks);
        }

        return taskRepository.save(task);
    }

    public LocalDateTime calculateNextRepeat(LocalDateTime from, RepeatType repeatType) {
        return switch (repeatType) {
            case DAILY -> from.plusDays(1);
            case WEEKLY -> from.plusWeeks(1);
            case MONTHLY -> from.plusMonths(1);
        };
    }
}
