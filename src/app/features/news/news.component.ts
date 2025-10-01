import { Component, computed, inject, OnInit } from '@angular/core';
import { HackerNewsService } from '../../core/hacker-news.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  imports: [PostCardComponent, CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit {
  private readonly hnService = inject(HackerNewsService);

  public posts = this.hnService.items;
  public loading = this.hnService.loading;
  public mode = this.hnService.mode;
  public hasMore = computed(() => this.hnService.hasMore());

  public ngOnInit(): void {
    this.hnService.getStories('top');
  }

  public setMode(mode: 'top' | 'new') {
    this.hnService.getStories(mode);
  }

  public loadMore() {
    this.hnService.loadMore();
  }
}
