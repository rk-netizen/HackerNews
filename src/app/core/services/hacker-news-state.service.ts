import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, EMPTY, switchMap, tap, catchError, finalize, map } from 'rxjs';
import { HackerNewsService } from './hacker-news.service';
import { Story, StoryType } from '../models/hacker-news-item.interface';

@Injectable({
  providedIn: 'root',
})
export class HackerNewsStateService {
  private readonly apiService = inject(HackerNewsService);

  public stories = signal<Story[]>([]);
  public loading = signal<boolean>(false);
  public currentType = signal<StoryType>('top');
  public error = signal<string | null>(null);
  public searchQuery = signal<string>('');

  private readonly allStoryIds = signal<number[]>([]);
  private readonly storyIdsLoaded = signal<boolean>(false);
  private readonly totalAvailableIds = signal<number>(0);
  private readonly allLoadedStories = signal<Story[]>([]);

  public filteredStories = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allStories = this.allLoadedStories();

    return allStories.filter(
      (story) =>
        story.title?.toLowerCase().includes(query) ||
        story.url?.toLowerCase().includes(query) ||
        story.by?.toLowerCase().includes(query)
    );
  });

  public hasMore = computed(() => {
    return (
      !this.searchQuery() &&
      this.allLoadedStories().length < this.totalAvailableIds() &&
      this.storyIdsLoaded()
    );
  });
  public canLoadMore = computed(() => this.hasMore() && !this.loading());

  public loadStories(type: StoryType): Observable<void> {
    this.updateState({ currentType: type, loading: true, error: null });
    this.clearStories();

    return this.apiService.getStoryIds(type).pipe(
      tap((allIds) => {
        // Lazy loading IDs
        const initialBatch = allIds.slice(0, 100);
        this.allStoryIds.set(initialBatch);
        this.totalAvailableIds.set(allIds.length);
        this.storyIdsLoaded.set(true);
      }),
      switchMap((allIds) => {
        const firstPageIds = allIds.slice(0, 20);
        return this.apiService.getStories(firstPageIds);
      }),
      tap((stories) => {
        this.allLoadedStories.set(stories);
        this.updateState({ stories, loading: false });
      }),
      catchError((error) => {
        console.error('Failed to load stories', error);
        this.error.set(error.message);
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
      map(() => undefined)
    );
  }

  public loadMore(): Observable<void> {
    if (!this.canLoadMore()) {
      return EMPTY;
    }

    this.loading.set(true);
    this.error.set(null);

    const currentCount = this.stories().length;
    const availableIds = this.allStoryIds();

    if (
      currentCount + 20 >= availableIds.length &&
      availableIds.length < this.totalAvailableIds()
    ) {
      return this.loadMoreIds().pipe(
        switchMap(() => this.loadNextBatch()),
        finalize(() => this.loading.set(false))
      );
    }

    return this.loadNextBatch().pipe(finalize(() => this.loading.set(false)));
  }

  private loadMoreIds(): Observable<void> {
    return this.apiService.getStoryIds(this.currentType()).pipe(
      tap((allIds) => {
        const currentLength = this.allStoryIds().length;
        const nextBatchEnd = Math.min(currentLength + 100, allIds.length);
        const nextBatch = allIds.slice(currentLength, nextBatchEnd);

        this.allStoryIds.update((current) => [...current, ...nextBatch]);
      }),
      map(() => undefined),
      catchError((error) => {
        console.error('Failed to load more story IDs', error);
        return EMPTY;
      })
    );
  }

  private loadNextBatch(): Observable<void> {
    const currentCount = this.allLoadedStories().length;
    const nextIds = this.allStoryIds().slice(currentCount, currentCount + 20);

    if (nextIds.length === 0) {
      return EMPTY;
    }

    return this.apiService.getStories(nextIds).pipe(
      tap((newStories) => {
        this.allLoadedStories.update((current) => [...current, ...newStories]);
        this.stories.update((current) => [...current, ...newStories]);
      }),
      catchError((error) => {
        console.error('Failed to load more stories', error);
        this.error.set(error.message);
        return EMPTY;
      }),
      map(() => undefined)
    );
  }

  public refresh(): Observable<void> {
    return this.loadStories(this.currentType());
  }

  public setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  public clearSearch(): void {
    this.searchQuery.set('');
  }

  private updateState(updates: {
    stories?: Story[];
    loading?: boolean;
    error?: string | null;
    currentType?: StoryType;
  }): void {
    if (updates.stories !== undefined) this.stories.set(updates.stories);
    if (updates.loading !== undefined) this.loading.set(updates.loading);
    if (updates.error !== undefined) this.error.set(updates.error);
    if (updates.currentType !== undefined) this.currentType.set(updates.currentType);
  }

  private clearStories(): void {
    this.stories.set([]);
    this.allLoadedStories.set([]);
    this.allStoryIds.set([]);
    this.storyIdsLoaded.set(false);
    this.totalAvailableIds.set(0);
    this.searchQuery.set('');
  }
}
