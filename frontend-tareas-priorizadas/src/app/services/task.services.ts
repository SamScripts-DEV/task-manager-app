import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { tap, catchError, finalize } from "rxjs/operators";

import { CreateTaskRequest, Task, UpdateTaskRequest } from "@models/task.model";
import { environment } from "@env/environment";


@Injectable({
    providedIn: 'root'
})

export class TaskService {

    private readonly tasks$ = new BehaviorSubject<Task[]>([])
    private readonly isLoading$ = new BehaviorSubject<boolean>(false);
    private readonly error$ = new BehaviorSubject<string | null>(null);


    private readonly apiUrl = environment.apiUrl;
    private readonly tasksUrl = `${this.apiUrl}/tasks`;

    constructor(private http: HttpClient) { }


    getTasks(): Observable<Task[]> {
        this.isLoading$.next(true);
        this.error$.next(null);

        return this.http.get<Task[]>(this.tasksUrl).pipe(
            tap(tasks => { this.tasks$.next(tasks) }),
            catchError(err => {
                this.handleError(err);
                return throwError(() => err);
            }),
            finalize(() => this.isLoading$.next(false))
        );
    }

    createTask(request: CreateTaskRequest): Observable<Task> {
        this.error$.next(null);

        const optimisticTask: Task = {
            id: Date.now(),
            user_id: '' as unknown as number,
            title: request.title,
            descrition: request.description,
            importance: request.importance,
            effort: request.effort,
            due_date: request.due_date,
            completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

        }

        const currenttasks = this.tasks$.getValue();
        this.tasks$.next([...currenttasks, optimisticTask]);

        return this.http.post<Task>(this.tasksUrl, request).pipe(
            tap(realTask => {
                const updatedTasks = this.tasks$.value.map(t =>
                    t.id === optimisticTask.id ? realTask : t
                );
                this.tasks$.next(updatedTasks);
            }),
            catchError(err => {
                const filteredTasks = this.tasks$.value.filter(
                    t => t.id !== optimisticTask.id
                );
                this.tasks$.next(filteredTasks);
                this.handleError(err);
                return throwError(() => err);
            })
        );
    }

    updateTask(taskId: number, request: UpdateTaskRequest): Observable<Task> {
        this.error$.next(null);

        const currentTasks = this.tasks$.value;
        const taskIndex = currentTasks.findIndex(t => t.id === taskId);
        const oldtask = currentTasks[taskIndex];

        const optimisticTask = {
            ...oldtask,
            ...request,
            updated_t: new Date().toISOString(),
        };

        const updatedTasks = [...currentTasks];
        updatedTasks[taskIndex] = optimisticTask;
        this.tasks$.next(updatedTasks);

        return this.http.put<Task>(`${this.tasksUrl}/${taskId}`, request).pipe(
            tap(realTask => {
                const finalTasks = this.tasks$.value.map(t => t.id === taskId ? realTask : t);
                this.tasks$.next(finalTasks);
            }),
            catchError(err => {
                const revertedTasks = this.tasks$.value.map(
                    t => t.id === taskId ? oldtask : t
                )
                this.tasks$.next(revertedTasks);
                this.handleError(err);
                return throwError(() => err);
            })
        )
    }

    completeTask(taskId: number): Observable<Task> {
        this.error$.next(null);

        const currentTasks = this.tasks$.value;
        const taskIndex = currentTasks.findIndex(t => t.id === taskId);
        const oldtask = currentTasks[taskIndex];

        const optimisticTask = {
            ...oldtask,
            completed: true,
            updated_at: new Date().toISOString(),
        };
        const updatedTasks = [...currentTasks];
        updatedTasks[taskIndex] = optimisticTask as Task;
        this.tasks$.next(updatedTasks);

        return this.http
            .patch<Task>(`${this.tasksUrl}/${taskId}/complete`, {})
            .pipe(
                tap(realTask => {
                    const finalTasks = this.tasks$.value.map(t => t.id === taskId ? realTask : t);
                    this.tasks$.next(finalTasks);
                }),
                catchError(err => {
                    const revertedTasks = this.tasks$.value.map(t =>
                        t.id === taskId ? oldtask : t
                    )
                    this.tasks$.next(revertedTasks);
                    this.handleError(err);
                    return throwError(() => err);
                })
            )
    }

    deleteTask(taskId: number): Observable<void> {
        this.error$.next(null);

        const currentTasks = this.tasks$.value;
        const removedTask = currentTasks.find(t => t.id === taskId);
        const filteredTasks = currentTasks.filter(t => t.id !== taskId);
        this.tasks$.next(filteredTasks);

        return this.http.delete<void>(`${this.tasksUrl}/${taskId}`).pipe(
            catchError(err => {
                if (removedTask) {
                    this.tasks$.next([...this.tasks$.value, removedTask]);

                }
                this.handleError(err);
                return throwError(() => err);
            })
        )

    }


    tasks = this.tasks$.asObservable();
    isLoading = this.isLoading$.asObservable();
    error = this.error$.asObservable();



    get tasksValue(): Task[] {
        return this.tasks$.value;

    }

    private handleError(error: any): void {
        let errorMessage = 'Error desconocido';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else if (error.status === 400) {
            errorMessage = error.error?.detail || 'Datos inválidos';
        } else if (error.status === 401) {
            errorMessage = 'No autenticado';
        } else if (error.status === 404) {
            errorMessage = 'Tarea no encontrada';
        } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor';
        } else {
            errorMessage = `Error: ${error.status}`;
        }

        this.error$.next(errorMessage);
    }







}