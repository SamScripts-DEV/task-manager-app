import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.services';
import { Router } from '@angular/router';
import { map, take } from 'rxjs';


const authGuardFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated.pipe(
    take(1),
    map(isAuth => isAuth ? true : router.parseUrl('/login'))
  );
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', 
    pathMatch: 'full',
  },
  {
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent),
  },
  {
    path: 'tasks',
    canActivate: [authGuardFn], 
    loadComponent: () => import('./pages/tasks/tasks.component').then(m => m.TasksComponent),
  },
  {
    path: 'create-task',
    canActivate: [authGuardFn],
    loadComponent: () => import('./pages/create-task/create-task.component').then(m => m.CreateTaskComponent),
  },
  {
    path: 'edit-task/:id',
    canActivate: [authGuardFn],
    loadComponent: () => import('./pages/create-task/create-task.component').then(m => m.CreateTaskComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];