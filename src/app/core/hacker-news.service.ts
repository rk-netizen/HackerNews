import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, of, tap } from 'rxjs';
import { HackerNewsItem } from './models/hacker-news-item';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HackerNewsService {
  private readonly http = inject(HttpClient);
  private readonly API = 'https://hacker-news.firebaseio.com/v0';

  private readonly storyIds$ = new BehaviorSubject<number[]>([]);
  private readonly items$ = new BehaviorSubject<HackerNewsItem[]>([]);
  private readonly loading$ = new BehaviorSubject<boolean>(false);

  storyIds = signal<number[]>([]);
  items = signal<HackerNewsItem[]>([]);
  loading = signal(false);
  mode = signal<'top' | 'new'>('top');
  pageSize = 20;

  hasMore = computed(() => this.items().length < this.storyIds().length);

  constructor() {
    this.storyIds$.subscribe((ids) => this.storyIds.set(ids));
    this.items$.subscribe((posts) => this.items.set(posts));
    this.loading$.subscribe((isLoading) => this.loading.set(isLoading));
  }

  public getStories(mode: 'top' | 'new') {
    this.mode.set(mode);
    this.loading$.next(true);

    this.http
      .get<number[]>(`${this.API}/${mode}stories.json`)
      .pipe(
        tap(() => this.items$.next([])),
        catchError((error: Error) => {
          console.error('Unable to fetch stories', error);
          return of([] as number[]);
        }),
        tap(() => this.loading$.next(false))
      )
      .subscribe((ids) => {
        this.storyIds$.next(ids);
        this.loadMore();
      });
  }

  public loadMore() {
    const storyIds = this.storyIds$.value;
    const loadedItems = this.items$.value;
    const start = loadedItems.length;
    const nextIds = storyIds.slice(start, start + this.pageSize);

    if (!nextIds) return;

    this.loading$.next(true);

    // why use forkjoin
    forkJoin(
      nextIds.map((id) =>
        this.http.get<HackerNewsItem>(`${this.API}/item/${id}.json`).pipe(
          catchError((error: Error) => {
            console.error(`Error fetching ${id}`, error);
            return of(null as unknown as HackerNewsItem);
          })
        )
      )
    )
      .pipe(
        map((newItems) => [...loadedItems, ...newItems.filter(Boolean)]),
        tap(() => this.loading$.next(false))
      )
      .subscribe((items) => this.items$.next(items));
  }
}
