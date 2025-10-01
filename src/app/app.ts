import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { NewsComponent } from './features/news/news.component';

@Component({
  selector: 'app-root',
  imports: [NewsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('hacker-news');
}
