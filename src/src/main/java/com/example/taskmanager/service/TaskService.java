package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskRequest;
import com.example.taskmanager.dto.TaskRequest.SubtaskRequest;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.dto.TaskResponse.SubtaskResponse;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskPriority;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.entity.Subtask;
import com.example.taskmanager.entity.RepeatType;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskDecomposeService decomposeService;

    @Autowired
    private TaskRelationService relationService;

    public List<TaskResponse> getTasks(String userId, TaskStatus status, String tag, TaskPriority priority) {
        List<Task> tasks;
        if (status != null) {
            tasks = taskRepository.findByUserIdAndStatus(userId, status);
        } else if (priority != null) {
            tasks = taskRepository.findByUserIdAndPriority(userId, priority);
        } else if (tag != null && !tag.isEmpty()) {
            tasks = taskRepository.findByUserId(userId).stream()
                .filter(t -> t.getTags() != null && t.getTags().contains(tag))
                .collect(Collectors.toList());
        } else {
            tasks = taskRepository.findByUserIdOrderBySortOrderAsc(userId);
        }
        return tasks.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TaskResponse getTask(String taskId, String userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return toResponse(task);
    }

    public TaskResponse createTask(String userId, TaskRequest request) {
        Task task = new Task();
        task.setId(UUID.randomUUID().toString());
        task.setUserId(userId);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setPriority(request.getPriority() != null ? request.getPriority() : TaskPriority.P2);
        task.setTags(request.getTags() != null ? request.getTags() : new ArrayList<>());
        task.setDueDate(request.getDueDate());
        task.setRepeatType(request.getRepeatType());
        task.setRepeatStartDate(request.getRepeatStartDate());
        if (request.getRepeatType() != null && request.getRepeatStartDate() == null) {
            task.setRepeatStartDate(LocalDateTime.now());
            task.setNextRepeatDate(calculateNextRepeat(LocalDateTime.now(), request.getRepeatType()));
        } else if (request.getRepeatType() != null) {
            task.setNextRepeatDate(calculateNextRepeat(request.getRepeatStartDate(), request.getRepeatType()));
        }
        task.setReminderTime(request.getReminderTime() != null ?
            LocalDateTime.parse(request.getReminderTime(), DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm")) : null);

        if (request.getSubtasks() != null) {
            for (SubtaskRequest sr : request.getSubtasks()) {
                Subtask subtask = new Subtask(sr.getTitle());
                subtask.setCompleted(sr.isCompleted());
                task.getSubtasks().add(subtask);
            }
        }

        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        task = taskRepository.save(task);
        return toResponse(task);
    }

    public TaskResponse updateTask(String taskId, String userId, TaskRequest request) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getTags() != null) {
            task.setTags(request.getTags());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getRepeatType() != null) {
            task.setRepeatType(request.getRepeatType());
            if (task.getRepeatStartDate() == null) {
                task.setRepeatStartDate(LocalDateTime.now());
            }
            task.setNextRepeatDate(calculateNextRepeat(task.getRepeatStartDate(), request.getRepeatType()));
        }
        if (request.getReminderTime() != null) {
            task.setReminderTime(LocalDateTime.parse(request.getReminderTime(), DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm")));
        }

        task.setUpdatedAt(LocalDateTime.now());
        task = taskRepository.save(task);
        return toResponse(task);
    }

    public TaskResponse updateStatus(String taskId, String userId, TaskStatus status) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        TaskStatus oldStatus = task.getStatus();

        if (status != oldStatus) {
            List<Task> blocking = relationService.getBlockingOrDependentTasks(taskId, userId);
            if (!blocking.isEmpty()) {
                String names = blocking.stream().map(Task::getTitle).collect(Collectors.joining(", "));
                throw new RuntimeException("任务被以下任务阻塞: " + names);
            }
        }

        // 重复任务实例完成后自动删除（模板任务保留）
        if (status == TaskStatus.COMPLETED && task.getTemplateId() != null) {
            taskRepository.delete(task);
            return null;
        }

        task.setStatus(status);
        task.setUpdatedAt(LocalDateTime.now());

        // 完成时清除提醒时间
        if (status == TaskStatus.COMPLETED) {
            task.setReminderTime(null);
        }

        if (status == TaskStatus.COMPLETED && oldStatus != TaskStatus.COMPLETED) {
            task.getSubtasks().forEach(s -> s.setCompleted(true));
        } else if (status != TaskStatus.COMPLETED && oldStatus == TaskStatus.COMPLETED) {
            task.getSubtasks().forEach(s -> s.setCompleted(false));
        }

        task = taskRepository.save(task);
        return toResponse(task);
    }

    public TaskResponse updatePriority(String taskId, String userId, TaskPriority priority) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setPriority(priority);
        task.setUpdatedAt(LocalDateTime.now());
        task = taskRepository.save(task);
        return toResponse(task);
    }

    public TaskResponse updateSortOrder(String taskId, String userId, Integer sortOrder) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setSortOrder(sortOrder);
        task.setUpdatedAt(LocalDateTime.now());
        task = taskRepository.save(task);
        return toResponse(task);
    }

    public TaskResponse updateSubtasks(String taskId, String userId, List<SubtaskRequest> subtasks) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.getSubtasks().clear();
        if (subtasks != null) {
            for (SubtaskRequest sr : subtasks) {
                Subtask subtask = new Subtask(sr.getTitle());
                subtask.setCompleted(sr.isCompleted());
                task.getSubtasks().add(subtask);
            }
        }

        task.setUpdatedAt(LocalDateTime.now());
        task = taskRepository.save(task);
        return toResponse(task);
    }

    public TaskResponse decomposeTask(String taskId, String userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        List<Subtask> subtasks = decomposeService.decompose(task.getTitle(), task.getDescription());
        task.getSubtasks().addAll(subtasks);
        task.setUpdatedAt(LocalDateTime.now());
        task = taskRepository.save(task);
        return toResponse(task);
    }

    public List<SubtaskResponse> getDecomposeSuggestions(String taskId, String userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        List<Subtask> subtasks = decomposeService.decompose(task.getTitle(), task.getDescription());
        return subtasks.stream().map(s -> {
            SubtaskResponse sr = new SubtaskResponse();
            sr.setId(s.getId());
            sr.setTitle(s.getTitle());
            sr.setCompleted(s.isCompleted());
            return sr;
        }).collect(Collectors.toList());
    }

    public void deleteTask(String taskId, String userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.delete(task);
    }

    public LocalDateTime calculateNextRepeat(LocalDateTime from, RepeatType repeatType) {
        return switch (repeatType) {
            case DAILY -> from.plusDays(1);
            case WEEKLY -> from.plusWeeks(1);
            case MONTHLY -> from.plusMonths(1);
        };
    }

    private TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setTags(task.getTags() != null ? task.getTags() : new ArrayList<>());
        response.setDueDate(task.getDueDate());
        response.setRepeatType(task.getRepeatType() != null ? task.getRepeatType().name() : null);
        response.setTemplateId(task.getTemplateId());
        response.setNextRepeatDate(task.getNextRepeatDate() != null ? task.getNextRepeatDate().toString() : null);
        response.setRepeatStartDate(task.getRepeatStartDate() != null ? task.getRepeatStartDate().toString() : null);
        response.setReminderTime(task.getReminderTime() != null ? task.getReminderTime().toString() : null);
        response.setCreatedAt(task.getCreatedAt() != null ? task.getCreatedAt().toString() : null);
        response.setUpdatedAt(task.getUpdatedAt());

        int total = task.getSubtasks().size();
        int completed = (int) task.getSubtasks().stream().filter(Subtask::isCompleted).count();
        response.setTotalSubtasks(total);
        response.setCompletedSubtasks(completed);

        List<SubtaskResponse> subtaskResponses = new ArrayList<>();
        for (Subtask s : task.getSubtasks()) {
            SubtaskResponse sr = new SubtaskResponse();
            sr.setId(s.getId());
            sr.setTitle(s.getTitle());
            sr.setCompleted(s.isCompleted());
            subtaskResponses.add(sr);
        }
        response.setSubtasks(subtaskResponses);

        return response;
    }
}
