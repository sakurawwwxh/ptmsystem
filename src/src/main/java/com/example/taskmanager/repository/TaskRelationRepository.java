package com.example.taskmanager.repository;

import com.example.taskmanager.entity.TaskRelation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TaskRelationRepository extends MongoRepository<TaskRelation, String> {
    List<TaskRelation> findByUserId(String userId);
    List<TaskRelation> findBySourceTaskId(String sourceTaskId);
    List<TaskRelation> findByTargetTaskId(String targetTaskId);
    List<TaskRelation> findBySourceTaskIdOrTargetTaskId(String sourceTaskId, String targetTaskId);
    void deleteBySourceTaskIdOrTargetTaskId(String sourceTaskId, String targetTaskId);
}
