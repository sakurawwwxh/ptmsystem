package com.example.taskmanager.service;

import com.example.taskmanager.entity.RepeatType;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RecurringTaskService {

    private final TaskRepository taskRepository;

    public RecurringTaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Scheduled(cron = "0 0 2 * * ?")
    public void processRecurringTasks() {
        LocalDateTime now = LocalDateTime.now();
        List<Task> dueTasks = taskRepository.findByNextRepeatDateBefore(now);

        for (Task templateTask : dueTasks) {
            if (templateTask.getRepeatType() == null) continue;

            Task newTask = new Task();
            newTask.setUserId(templateTask.getUserId());
            newTask.setTitle(templateTask.getTitle());
            newTask.setDescription(templateTask.getDescription());
            newTask.setPriority(templateTask.getPriority());
            newTask.setTags(templateTask.getTags());
            newTask.setRepeatType(templateTask.getRepeatType());
            newTask.setTemplateId(templateTask.getTemplateId());
            newTask.setRepeatStartDate(templateTask.getRepeatStartDate());
            newTask.setCreatedAt(LocalDateTime.now());
            newTask.setUpdatedAt(LocalDateTime.now());

            if (templateTask.getSubtasks() != null && !templateTask.getSubtasks().isEmpty()) {
                newTask.setSubtasks(templateTask.getSubtasks().stream()
                    .map(s -> {
                        com.example.taskmanager.entity.Subtask st = new com.example.taskmanager.entity.Subtask();
                        st.setId(UUID.randomUUID().toString());
                        st.setTitle(s.getTitle());
                        st.setCompleted(false);
                        return st;
                    })
                    .toList());
            }

            taskRepository.save(newTask);

            templateTask.setNextRepeatDate(calculateNextRepeat(now, templateTask.getRepeatType()));
            taskRepository.save(templateTask);
        }
    }

    public LocalDateTime calculateNextRepeat(LocalDateTime from, RepeatType repeatType) {
        return switch (repeatType) {
            case DAILY -> from.plusDays(1);
            case WEEKLY -> from.plusWeeks(1);
            case MONTHLY -> from.plusMonths(1);
        };
    }
}
