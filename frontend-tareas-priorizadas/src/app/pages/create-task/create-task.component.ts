import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.services';
import { Task } from '../../models/task.model';
import { NavController } from '@ionic/angular/standalone';
import {
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonContent, IonCard, IonCardContent, IonItem, IonLabel,
    IonInput, IonTextarea, IonRange, IonButton, IonIcon,
    IonDatetimeButton, IonModal, IonDatetime, IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-task',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule,
        IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
        IonContent, IonCard, IonCardContent, IonItem, IonLabel,
        IonInput, IonTextarea, IonRange, IonButton, IonIcon,
        IonDatetimeButton, IonModal, IonDatetime, IonText
    ],
    templateUrl: './create-task.component.html',
    styleUrls: ['./create-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taskService = inject(TaskService);
    private navCtrl = inject(NavController);
    private route = inject(ActivatedRoute);

    private router = inject(Router);

    taskForm!: FormGroup;
    isEdit = false;
    taskId: number | null = null;

    isLoading$ = this.taskService.isLoading$;
    error$ = this.taskService.error$;

    constructor() {
        addIcons({ saveOutline });
    }

    ngOnInit(): void {
        this.initializeForm();
        this.checkIfEditMode();
    }

    private initializeForm(): void {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const defaultDate = tomorrow.toISOString().split('T')[0];

        this.taskForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            description: [''],
            importance: [3, [Validators.required]],
            effort: [3, [Validators.required]],
            due_date: [defaultDate, [Validators.required]],
        });
    }

    private checkIfEditMode(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEdit = true;
                this.taskId = Number(params['id']);
                this.loadTaskForEdit();
            }
        });
    }

    private loadTaskForEdit(): void {
        const task = this.taskService.getTaskById(this.taskId!);
        console.log('Cargando tarea para editar:', task);
        if (task) {
            if (task.due_date) {
                task.due_date = new Date(task.due_date).toISOString().split('T')[0];
            }
            this.taskForm.patchValue(task);
        }
    }

    calculateCurrentScore(): number {
        if (!this.taskForm) return 0;
        const imp = this.taskForm.get('importance')?.value || 0;
        const eff = this.taskForm.get('effort')?.value || 1;
        return Number((imp * (1 / eff)).toFixed(2));
    }

    getPriorityColorClass(): string {
        const score = this.calculateCurrentScore();
        if (score >= 4) return 'danger';
        if (score >= 1.5) return 'warning';
        return 'success';
    }

    onSubmit(): void {
        if (this.taskForm.valid) {
            const taskData = this.taskForm.value;
            if (this.isEdit) {
                this.taskService.updateTask(this.taskId!, taskData).subscribe({
                    next: () => this.router.navigate(['/tasks'])
                });
            } else {
                this.taskService.createTask(taskData).subscribe({
                    next: () => this.router.navigate(['/tasks'])
                });
            }
        }
    }
}

