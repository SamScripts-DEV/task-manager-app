export interface Task {
    id: number;
    use_id: number;
    title: string;
    descrition: string;
    due_date: string
    importance: number;
    effort: number;
    completed: boolean;
    created_at: string;
    updated_at: string;
    priority: number;
}