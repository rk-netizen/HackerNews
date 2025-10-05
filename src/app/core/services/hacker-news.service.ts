import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StoryType, Story } from '../models/hacker-news-item';

@Injectable({
  providedIn: 'root',
})
export class HackerNewsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://hacker-news.firebaseio.com/v0';

  public getStoryIds(type: StoryType): Observable<number[]> {
    return this.http
      .get<number[]>(`${this.baseUrl}/${type}stories.json`)
      .pipe(catchError(() => of([])));
  }

  public getStory(id: number): Observable<Story | null> {
    return this.http.get<Story>(`${this.baseUrl}/item/${id}.json`).pipe(catchError(() => of(null)));
  }

  public getStories(ids: number[]): Observable<Story[]> {
    const requests = ids.map((id) => this.getStory(id));

    return forkJoin(requests).pipe(
      map((stories) => stories.filter(Boolean) as Story[]),
      catchError(() => of([]))
    );
  }
}
