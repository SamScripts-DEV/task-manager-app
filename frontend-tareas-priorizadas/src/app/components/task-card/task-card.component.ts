import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCheckbox, IonBadge, IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { Task } from '@models/task.model';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, flashOutline, calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, IonCheckbox, IonBadge, IonButton, IonIcon],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {

      constructor() {
    addIcons({ createOutline, trashOutline, flashOutline, calendarOutline });
  }
  @Input() task!: Task;
  @Output() complete = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Task>();

  toggleComplete(event?: any): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.complete.emit(this.task.id);
  }

  onDelete(event?: Event): void {
    if (event) event.stopPropagation();
    this.delete.emit(this.task.id);
  }

  onEdit(event?: Event): void {
    if (event) event.stopPropagation();
    this.edit.emit(this.task);
  }

  getPriorityColor(): string {
    const score = this.task.importance * (1 / (this.task.effort || 1));
    if (score >= 4) return '#ef476f';
    if (score >= 1.5) return '#ffd166';
    return '#06d6a0';
  }

  getPriorityLabel(): string {
    const score = this.task.importance * (1 / (this.task.effort || 1));
    if (score >= 4) return 'Alta';
    if (score >= 1.5) return 'Media';
    return 'Baja';
  }

  getFormattedDate(): string {
    if (!this.task.due_date) return 'Sin fecha';
    const date = new Date(this.task.due_date);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }
}
