import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { TaskService } from '../../services/task.services';
import { AuthService } from '../../services/auth.services';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { Task } from '../../models/task.model';
import { addIcons } from 'ionicons';
import { logOutOutline, addCircleOutline, add } from 'ionicons/icons';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonRefresher, IonRefresherContent, IonSpinner,
  IonFab, IonFabButton, IonCheckbox, IonBadge
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';



@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [
    CommonModule, TaskCardComponent, DragDropModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonRefresher, IonRefresherContent, IonSpinner,
    IonFab, IonFabButton, 
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private navCtrl = inject(NavController);

  private router = inject(Router);

  tasks$ = this.taskService.tasks$;
  isLoading$ = this.taskService.isLoading$;

    constructor() {
    addIcons({ logOutOutline, addCircleOutline, add });
  }

  ngOnInit() {
    this.taskService.getTasks().subscribe();
  }

  onRefresh(event?: any) {
    this.taskService.getTasks().subscribe(() => {
      if (event && event.target) event.target.complete();
    });
  }

  onTaskComplete(id?: number) {
    if (id !== undefined) {
      console.log('Completando tarea ID:', id);
      this.taskService.completeTask(id).subscribe();
    }
  }

  onTaskDelete(id?: number) {
    if (id !== undefined) {
      console.log('Eliminando tarea ID:', id);
      this.taskService.deleteTask(id).subscribe();
    }
  }

  onTaskEdit(task?: Task) {
    if (task && task.id) {
      console.log('Navegando a editar tarea:', task.id);
      this.navCtrl.navigateForward(`/edit-task/${task.id}`);
    }
  }

  onTaskDrop(event?: CdkDragDrop<Task[]>) {
    if (event) {
      const currentTasks = [...this.taskService.tasksValue];
      moveItemInArray(currentTasks, event.previousIndex, event.currentIndex);
      this.taskService.tasks$.next(currentTasks);
    }
  }

  trackByTaskId(index: number, task: Task) {
    return task.id;
  }

  goToCreateTask() {
    this.router.navigate(['/create-task']);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

