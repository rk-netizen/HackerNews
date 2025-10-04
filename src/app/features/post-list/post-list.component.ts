import { Component, inject, OnInit } from '@angular/core';
import { HackerNewsStateService } from '../../core/services/hacker-news-state.service';
import { StoryType } from '../../core/models/hacker-news-item';
import { PostCardComponent } from '../post-card/post-card.component';

import {
  LoadingStateComponent,
  ErrorStateComponent,
  EmptyStateComponent,
  SearchBarComponent,
} from '../../shared';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list',
  imports: [
    PostCardComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    SearchBarComponent,
    CommonModule,
  ],
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit {
  private readonly stateService = inject(HackerNewsStateService);

  readonly stories = this.stateService.filteredStories;
  readonly loading = this.stateService.loading;
  readonly currentType = this.stateService.currentType;
  readonly hasMore = this.stateService.hasMore;
  readonly canLoadMore = this.stateService.canLoadMore;
  readonly error = this.stateService.error;
  readonly searchQuery = this.stateService.searchQuery;

  public ngOnInit(): void {
    this.stateService.loadStories('top').subscribe();
  }

  public switchMode(type: StoryType): void {
    this.stateService.loadStories(type).subscribe();
  }

  public loadMore(): void {
    if (this.loading()) {
      return;
    }
    this.stateService.loadMore().subscribe();
  }

  public refresh(): void {
    this.stateService.refresh().subscribe();
  }

  public onSearchChange(query: string): void {
    this.stateService.setSearchQuery(query);
  }

  public onSearchClear(): void {
    this.stateService.clearSearch();
  }

  public isActiveType(type: StoryType): boolean {
    return this.currentType() === type;
  }

  public getButtonClasses(type: StoryType): string {
    return this.isActiveType(type) ? 'bg-black text-white' : 'hover:bg-gray-100';
  }
}
