package com.example.taskmanager;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByTaskIdOrderByCreatedAtDesc(String taskId);
    void deleteByTaskId(String taskId);
}