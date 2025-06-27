import { Routes } from '@angular/router';

export const routes: Routes = [
    
  {
    path: '',
    loadComponent: () => import('./products'),
  },
  {
    path: 'create',
    loadComponent: () => import('./create/create'),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./create/create'),
  },
];

export default routes
