import { Component, input } from '@angular/core';
import { Story } from '../../core/models/hacker-news-item';
import { TimeAgoPipe, DomainPipe } from '../../shared';

@Component({
  selector: 'app-post-card',
  imports: [TimeAgoPipe, DomainPipe],
  templateUrl: './post-card.component.html',
})
export class PostCardComponent {
  post = input.required<Story>();
}
