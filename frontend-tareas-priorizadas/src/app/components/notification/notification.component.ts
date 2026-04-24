import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService } from '@app/services/notification.service';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, alertCircle, warning, informationCircle } from 'ionicons/icons';


@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule, IonIcon],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
    notification$ = this.notificationService.notification;

    constructor(private notificationService: NotificationService) {
        addIcons({ checkmarkCircle, alertCircle, warning, informationCircle });
    }

    getColor(type: string): string {
        const colors: { [key: string]: string } = {
            success: 'success',
            error: 'danger',
            warning: 'warning',
            info: 'primary',
        };
        return colors[type] || 'primary';
    }

    getIcon(type: string): string {
        const icons: { [key: string]: string } = {
            success: 'checkmark-circle',
            error: 'alert-circle',
            warning: 'warning',
            info: 'information-circle',
        };
        return icons[type] || 'information-circle';
    }
}


