package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.entity.TaskPriority;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserId(String userId);

    List<Task> findByUserIdAndStatus(String userId, TaskStatus status);

    List<Task> findByUserIdAndPriority(String userId, TaskPriority priority);

    Optional<Task> findByIdAndUserId(String id, String userId);

    List<Task> findByUserIdOrderBySortOrderAsc(String userId);

    List<Task> findByNextRepeatDateBefore(LocalDateTime dateTime);

    List<Task> findByNextRepeatDateBetween(LocalDateTime start, LocalDateTime end);

    List<Task> findByReminderTimeBefore(LocalDateTime dateTime);

    List<Task> findByDueDateBefore(LocalDateTime dateTime);
}
