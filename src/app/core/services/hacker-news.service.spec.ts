import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HackerNewsService } from './hacker-news.service';
import { Story } from '../models/hacker-news-item.interface';
import { provideHttpClient } from '@angular/common/http';

describe('HackerNewsService', () => {
  let service: HackerNewsService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://hacker-news.firebaseio.com/v0';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HackerNewsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(HackerNewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getStoryIds()', () => {
    it('should fetch "TOP" story IDs successfully', () => {
      const mockIds = [1, 2, 3, 4, 5];

      service.getStoryIds('top').subscribe((ids) => {
        expect(ids).toEqual(mockIds);
        expect(ids.length).toBe(5);
      });

      const req = httpMock.expectOne(`${baseUrl}/topstories.json`);
      expect(req.request.method).toBe('GET');
      req.flush(mockIds);
    });

    it('should fetch "NEW" story IDs successfully', () => {
      const mockIds = [10, 11, 12];

      service.getStoryIds('new').subscribe((ids) => {
        expect(ids).toEqual(mockIds);
      });

      const req = httpMock.expectOne(`${baseUrl}/newstories.json`);
      expect(req.request.method).toBe('GET');
      req.flush(mockIds);
    });

    it('should return empty array on error', () => {
      service.getStoryIds('top').subscribe((ids) => {
        expect(ids).toEqual([]);
      });

      const req = httpMock.expectOne(`${baseUrl}/topstories.json`);
      req.flush(null, {
        status: 500,
        statusText: 'Network error',
      });
    });
  });

  describe('getStory()', () => {
    const mockStory: Story = {
      id: 12345,
      title: 'title-test',
      url: 'https://title-test.com',
      score: 30,
      by: 'test-user',
      time: 2025 - 11 - 11,
      descendants: 25,
      type: 'story',
    };

    it('should fetch a single story successfully', () => {
      service.getStory(12345).subscribe((story) => {
        expect(story).toEqual(mockStory);
        expect(story?.title).toBe('Test Story');
      });

      const req = httpMock.expectOne(`${baseUrl}/item/12345.json`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStory);
    });

    it('should return null on error', () => {
      service.getStory(121212).subscribe((story) => {
        expect(story).toBeNull();
      });

      const req = httpMock.expectOne(`${baseUrl}/item/121212.json`);
      req.flush(null, {
        status: 404,
        statusText: 'Not found',
      });
    });
  });

  describe('getStories()', () => {
    const mockStory1: Story = {
      id: 1,
      title: 'First Story',
      url: 'https://example.com/first',
      score: 100,
      by: 'user1',
      time: 1234567890,
      descendants: 20,
      type: 'story',
    };

    const mockStory2: Story = {
      id: 2,
      title: 'Second Story',
      url: 'https://example.com/second',
      score: 75,
      by: 'user2',
      time: 1234567891,
      descendants: 15,
      type: 'story',
    };

    it('should fetch multiple stories successfully', () => {
      const storyIds = [1, 2];

      service.getStories(storyIds).subscribe((stories) => {
        expect(stories.length).toBe(2);
        expect(stories[0]).toEqual(mockStory1);
        expect(stories[1]).toEqual(mockStory2);
      });

      const req1 = httpMock.expectOne(`${baseUrl}/item/1.json`);
      const req2 = httpMock.expectOne(`${baseUrl}/item/2.json`);

      expect(req1.request.method).toBe('GET');
      expect(req2.request.method).toBe('GET');

      req1.flush(mockStory1);
      req2.flush(mockStory2);
    });

    it('should filter out null responses and return only successful stories', () => {
      const storyIds = [1, 10, 2];

      service.getStories(storyIds).subscribe((stories) => {
        expect(stories.length).toBe(2);
        expect(stories[0]).toEqual(mockStory1);
        expect(stories[1]).toEqual(mockStory2);
      });

      const req1 = httpMock.expectOne(`${baseUrl}/item/1.json`);
      const req10 = httpMock.expectOne(`${baseUrl}/item/10.json`);
      const req2 = httpMock.expectOne(`${baseUrl}/item/2.json`);

      req1.flush(mockStory1);
      req10.flush(null, { status: 404, statusText: 'Not found' });
      req2.flush(mockStory2);
    });

    it('should return empty array when all requests fail', () => {
      const storyIds = [10, 20];

      service.getStories(storyIds).subscribe((stories) => {
        expect(stories).toEqual([]);
        expect(stories.length).toBe(0);
      });

      const req1 = httpMock.expectOne(`${baseUrl}/item/10.json`);
      const req2 = httpMock.expectOne(`${baseUrl}/item/20.json`);

      req1.flush(null, { status: 500, statusText: 'Server error' });
      req2.flush(null, { status: 404, statusText: 'Not found' });
    });
  });
});
