package com.example.taskmanager.service;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskRelation;
import com.example.taskmanager.entity.RelationType;
import com.example.taskmanager.repository.TaskRelationRepository;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.Set;

@Service
public class TaskRelationService {

    private final TaskRelationRepository relationRepository;
    private final TaskRepository taskRepository;

    public TaskRelationService(TaskRelationRepository relationRepository, TaskRepository taskRepository) {
        this.relationRepository = relationRepository;
        this.taskRepository = taskRepository;
    }

    public List<TaskRelation> getTaskRelations(String taskId, String userId) {
        return relationRepository.findBySourceTaskIdOrTargetTaskId(taskId, taskId).stream()
            .filter(r -> r.getUserId().equals(userId))
            .toList();
    }

    public List<TaskRelation> getBlockingTasks(String taskId, String userId) {
        return relationRepository.findByTargetTaskId(taskId).stream()
            .filter(r -> r.getRelationType() == RelationType.BLOCKS || r.getRelationType() == RelationType.DEPENDS_ON)
            .filter(r -> r.getUserId().equals(userId))
            .toList();
    }

    public List<TaskRelation> getBlockedTasks(String taskId, String userId) {
        return relationRepository.findBySourceTaskId(taskId).stream()
            .filter(r -> r.getRelationType() == RelationType.BLOCKS || r.getRelationType() == RelationType.DEPENDS_ON)
            .filter(r -> r.getUserId().equals(userId))
            .toList();
    }

    public TaskRelation createRelation(String sourceTaskId, String targetTaskId, RelationType type, String userId) {
        if (sourceTaskId.equals(targetTaskId)) {
            throw new RuntimeException("Cannot create relation to self");
        }

        if (!taskRepository.findById(sourceTaskId).map(t -> t.getUserId().equals(userId)).orElse(false)) {
            throw new RuntimeException("Source task not found");
        }
        if (!taskRepository.findById(targetTaskId).map(t -> t.getUserId().equals(userId)).orElse(false)) {
            throw new RuntimeException("Target task not found");
        }

        // 循环检测：如果 source blocks target，再让 target blocks source 会死锁
        if (type == RelationType.BLOCKS || type == RelationType.DEPENDS_ON) {
            if (wouldCreateCycle(sourceTaskId, targetTaskId, userId)) {
                throw new RuntimeException("创建此关联会形成循环依赖，导致死锁");
            }
        }

        TaskRelation relation = new TaskRelation();
        relation.setUserId(userId);
        relation.setSourceTaskId(sourceTaskId);
        relation.setTargetTaskId(targetTaskId);
        relation.setRelationType(type);
        relation.setCreatedAt(LocalDateTime.now());
        return relationRepository.save(relation);
    }

    // 检测如果创建 source->target 的BLOCKS/DEPENDS_ON关系，是否形成循环
    // 循环示例：A blocks B，再创建 B blocks A = 死锁
    private boolean wouldCreateCycle(String sourceTaskId, String targetTaskId, String userId) {
        // 从 targetTaskId 出发，检查是否有一条路径能回到 sourceTaskId
        // 这条路径只能走 BLOCKS 或 DEPENDS_ON 类型的边
        Set<String> visited = new java.util.HashSet<>();
        java.util.Queue<String> queue = new java.util.LinkedList<>();
        queue.add(targetTaskId);

        while (!queue.isEmpty()) {
            String current = queue.poll();
            if (current.equals(sourceTaskId)) {
                return true; // 找到回路
            }
            if (visited.contains(current)) {
                continue;
            }
            visited.add(current);

            // 查找 current 作为 source 的 BLOCKS/DEPENDS_ON 关系
            List<TaskRelation> outgoing = relationRepository.findBySourceTaskId(current).stream()
                .filter(r -> r.getUserId().equals(userId))
                .filter(r -> r.getRelationType() == RelationType.BLOCKS || r.getRelationType() == RelationType.DEPENDS_ON)
                .toList();

            for (TaskRelation rel : outgoing) {
                if (!visited.contains(rel.getTargetTaskId())) {
                    queue.add(rel.getTargetTaskId());
                }
            }
        }
        return false;
    }

    public void deleteRelation(String id, String userId) {
        TaskRelation relation = relationRepository.findById(id)
            .filter(r -> r.getUserId().equals(userId))
            .orElseThrow(() -> new RuntimeException("Relation not found"));
        relationRepository.delete(relation);
    }

    public List<Task> getBlockingOrDependentTasks(String taskId, String userId) {
        List<TaskRelation> blocking = relationRepository.findByTargetTaskId(taskId).stream()
            .filter(r -> r.getRelationType() == RelationType.BLOCKS || r.getRelationType() == RelationType.DEPENDS_ON)
            .filter(r -> r.getUserId().equals(userId))
            .toList();

        return blocking.stream()
            .map(r -> taskRepository.findById(r.getSourceTaskId()).orElse(null))
            .filter(t -> t != null && !t.getStatus().name().equals("COMPLETED"))
            .toList();
    }
}
