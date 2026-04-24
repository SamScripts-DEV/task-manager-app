import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  
  @Input() state: 'empty' | 'error' | 'loading' = 'empty';
  
  
  @Input() title = '';
  @Input() message = '';
  @Input() icon = '';

  
  getStateConfig() {
    const configs = {
      empty: {
        icon: 'checkmark-done-circle-outline',
        title: 'Â¡Sin tareas pendientes!',
        message: 'Crea una nueva tarea para empezar',
      },
      error: {
        icon: 'alert-circle',
        title: 'Error al cargar',
        message: 'No pudimos cargar las tareas. Intenta de nuevo.',
      },
      loading: {
        icon: 'hourglass',
        title: 'Cargando...',
        message: 'Por favor espera',
      },
    };

    const config = configs[this.state];
    return {
      icon: this.icon || config.icon,
      title: this.title || config.title,
      message: this.message || config.message,
    };
  }
}


