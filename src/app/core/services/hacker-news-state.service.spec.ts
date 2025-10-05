import { TestBed } from '@angular/core/testing';
import { HackerNewsStateService } from './hacker-news-state.service';
import { HackerNewsService } from './hacker-news.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Story } from '../models/hacker-news-item.interface';

describe('HackerNewsStateService', () => {
  let service: HackerNewsStateService;
  let hackerNewsService: HackerNewsService;
  let httpTestingController: HttpTestingController;

  const mockStoryIds = [1, 2, 3, 4, 5];
  const mockStories: Story[] = [
    {
      id: 1,
      title: 'title1',
      by: 'user1',
      score: 100,
      url: 'https://github.com/user1',
      time: 8111996,
      descendants: 10,
    },
    {
      id: 2,
      title: 'title2',
      by: 'user2',
      score: 200,
      url: 'https://github.com/user2',
      time: 118991,
      descendants: 20,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HackerNewsStateService,
        HackerNewsService,
      ],
    });

    service = TestBed.inject(HackerNewsStateService);
    hackerNewsService = TestBed.inject(HackerNewsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct initial state', () => {
    expect(service.stories()).toEqual([]);
    expect(service.loading()).toBe(false);
    expect(service.currentType()).toBe('top');
    expect(service.error()).toBeNull();
    expect(service.searchQuery()).toBe('');
    expect(service.filteredStories()).toEqual([]);
    expect(service.hasMore()).toBe(false);
    expect(service.canLoadMore()).toBe(false);
  });

  describe('loadStories', () => {
    it('should load stories successfully', (done) => {
      hackerNewsService.getStoryIds = () => {
        return of(mockStoryIds);
      };

      hackerNewsService.getStories = () => {
        return of(mockStories);
      };

      service.loadStories('top').subscribe(() => {
        expect(service.currentType()).toBe('top');
        expect(service.loading()).toBe(false);
        expect(service.stories()).toEqual(mockStories);

        done();
      });
    });
  });

  describe('loadMore', () => {
    it('should return EMPTY when canLoadMore is false', (done) => {
      service.loading.set(true);

      const result = service.loadMore();

      result.subscribe({
        next: () => {
          fail('EMPTY should not emit any values');
        },
        complete: () => {
          expect(true).toBe(true);
          done();
        },
      });
    });

    it('should set loading state when canLoadMore is true', () => {
      service.loading.set(false);
      service['storyIdsLoaded'].set(true);
      service['allLoadedStories'].set([mockStories[0]]);
      service['totalAvailableIds'].set(10);
      service['allStoryIds'].set([1, 2, 3, 4, 5]);
      service.stories.set([mockStories[0]]);
      service.searchQuery.set('');

      expect(service.canLoadMore()).toBe(true);

      service.loadMore();

      expect(service.loading()).toBe(true);
      expect(service.error()).toBeNull();
    });
  });

  describe('refresh', () => {
    it('should refresh current stories', (done) => {
      service.currentType.set('new');
      let loadStoriesCalled = false;
      let calledWithType = '';

      service.loadStories = (type) => {
        loadStoriesCalled = true;
        calledWithType = type;
        return of(undefined);
      };

      service.refresh().subscribe(() => {
        expect(loadStoriesCalled).toBe(true);
        expect(calledWithType).toBe('new');

        done();
      });
    });
  });

  describe('setSearchQuery', () => {
    it('should update search query', () => {
      const testQuery = 'query';

      service.setSearchQuery(testQuery);

      expect(service.searchQuery()).toBe(testQuery);
    });
  });

  describe('clearSearch', () => {
    it('should clear search query', () => {
      service.searchQuery.set('test query');

      service.clearSearch();

      expect(service.searchQuery()).toBe('');
    });
  });

  describe('filteredStories', () => {
    beforeEach(() => {
      service['allLoadedStories'].set(mockStories);
    });

    it('should return all stories when no search query', () => {
      service.searchQuery.set('');

      const result = service.filteredStories();

      expect(result).toEqual(mockStories);
    });

    it('should filter stories by title', () => {
      service.searchQuery.set('title1');

      const result = service.filteredStories();

      expect(result).toEqual([mockStories[0]]);
    });

    it('should filter stories by URL', () => {
      service.searchQuery.set('github.com/user2');

      const result = service.filteredStories();

      expect(result).toEqual([mockStories[1]]);
    });

    it('should filter stories by author', () => {
      service.searchQuery.set('user1');

      const result = service.filteredStories();

      expect(result).toEqual([mockStories[0]]);
    });

    it('should return empty array when no matches', () => {
      service.searchQuery.set('lorem-ipsum');

      const result = service.filteredStories();

      expect(result).toEqual([]);
    });
  });
});
