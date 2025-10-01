import { Component, input } from '@angular/core';
import { HackerNewsItem } from '../../core/models/hacker-news-item';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent {
  post = input.required<HackerNewsItem>();
}
