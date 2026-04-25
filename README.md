# PTM Task Manager

任务管理系统，前端 React，后端 Spring Boot，数据存储 MongoDB。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite + TypeScript + Tailwind CSS + dnd-kit + framer-motion |
| 后端 | Spring Boot 3.2 + Spring Data MongoDB + JWT |
| 数据库 | MongoDB |

## 功能

- 用户注册 / 登录（JWT 认证）
- 看板视图（Kanban Board）
- 列表视图（Task List）
- 任务模板
- 子任务
- 任务评论
- 定期任务
- 邮件提醒

## 启动

**后端：**

```bash
cd src
mvn spring-boot:run
```

服务端口 `8080`。

**前端：**

```bash
cd frontend
npm install
npm run dev
```

服务端口 `5173`。

## 目录结构

```
ptmsystem/
├── frontend/                 # React 前端
│   └── src/
│       ├── api/              # API 调用
│       ├── components/       # React 组件
│       │   ├── KanbanBoard.tsx
│       │   ├── KanbanColumn.tsx
│       │   ├── KanbanCard.tsx
│       │   ├── TaskList.tsx
│       │   ├── TaskDetail.tsx
│       │   ├── TaskForm.tsx
│       │   ├── LoginForm.tsx
│       │   └── TemplateList.tsx
│       └── context/          # AuthContext
└── src/                      # Spring Boot 后端
    └── src/main/java/com/example/taskmanager/
        ├── controller/       # REST API 控制器
        ├── service/          # 业务逻辑
        ├── entity/           # MongoDB 实体
        ├── repository/       # 数据访问层
        ├── dto/              # 数据传输对象
        ├── config/           # 安全配置
        ├── filter/           # JWT 过滤器
        └── util/             # 工具类
```

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/tasks | 获取用户任务 |
| POST | /api/tasks | 创建任务 |
| PUT | /api/tasks/{id} | 更新任务 |
| DELETE | /api/tasks/{id} | 删除任务 |
| GET | /api/templates | 获取模板列表 |
