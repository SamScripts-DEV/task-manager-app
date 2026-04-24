import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  
  private readonly apiUrl = environment.apiUrl;
  private readonly tasksUrl = `${this.apiUrl}/tasks`;

  public readonly tasks$ = new BehaviorSubject<Task[]>([]);
  public readonly isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly error$ = new BehaviorSubject<string | null>(null);

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

    if (request.due_date && request.due_date.length <= 10) {
      request.due_date = new Date(request.due_date).toISOString();
    }

    const optimisticTask: Task = {
      id: Date.now(),
      user_id: 0 as unknown as number,
      title: request.title,
      description: request.description,
      importance: request.importance,
      effort: request.effort,
      due_date: request.due_date,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const currentTasks = this.tasks$.getValue();
    this.tasks$.next([...currentTasks, optimisticTask]);

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
    
    if (taskIndex === -1) {
      return throwError(() => new Error('Task not found'));
    }

    const oldTask = currentTasks[taskIndex];

    if (request.due_date && request.due_date.length <= 10) {
      request.due_date = new Date(request.due_date).toISOString();
    }

    const optimisticTask = {
      ...oldTask,
      ...request,
      updated_at: new Date().toISOString(),
    };

    const updatedTasks = [...currentTasks];
    updatedTasks[taskIndex] = optimisticTask as Task;
    this.tasks$.next(updatedTasks);

    return this.http.put<Task>(`${this.tasksUrl}/${taskId}`, request).pipe(
      tap(realTask => {
        const finalTasks = this.tasks$.value.map(t => t.id === taskId ? realTask : t);
        this.tasks$.next(finalTasks);
      }),
      catchError(err => {
        const revertedTasks = this.tasks$.value.map(
          t => t.id === taskId ? oldTask : t
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
    
    if (taskIndex === -1) {
      return throwError(() => new Error('Task not found'));
    }

    const oldTask = currentTasks[taskIndex];

    const optimisticTask = {
      ...oldTask,
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
            t.id === taskId ? oldTask : t
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

  getTaskById(id: number): Task | undefined {
    return this.tasks$.value.find(t => t.id === id);
  }

  private handleError(error: any): void {
    let errorMessage = 'Unknown error';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 400 || error.status === 422) {
  
      errorMessage = Array.isArray(error.error?.detail) 
        ? error.error.detail[0].msg 
        : (error.error?.detail || 'Invalid data');
    } else if (error.status === 401) {
      errorMessage = 'Not authenticated';
    } else if (error.status === 404) {
      errorMessage = 'Task not found';
    } else if (error.status === 0) {
      errorMessage = 'Could not connect to the server';
    } else {
      errorMessage = `Error: ${error.status}`;
    }

    this.error$.next(errorMessage);
  }
}



