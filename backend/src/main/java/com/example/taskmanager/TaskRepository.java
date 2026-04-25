package com.example.taskmanager;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserIdOrderBySortOrderAsc(String userId);
    List<Task> findByUserIdAndStatus(String userId, TaskStatus status);
    List<Task> findByUserIdAndTagsContaining(String userId, String tag);
}