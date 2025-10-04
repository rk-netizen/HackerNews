import { Routes } from '@angular/router';
import { PostListComponent } from './features/post-list/post-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/stories', pathMatch: 'full' },
  { path: 'stories', component: PostListComponent },
  { path: '**', redirectTo: '/stories' },
];
