export interface Task {
    id: number;
    user_id: number;
    title: string;
    description: string;
    due_date: string
    importance: number;
    effort: number;
    completed: boolean;
    created_at: string;
    updated_at: string;
    priority_score?: number;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    importance: number;
    effort: number;
    due_date: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

export interface TaskResponse {
    tasks: Task[];
    total: number;
}