import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListComponent } from './post-list.component';
import { HackerNewsStateService } from '../../core/services/hacker-news-state.service';
import { HackerNewsService } from '../../core/services/hacker-news.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let stateService: HackerNewsStateService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HackerNewsStateService,
        HackerNewsService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(HackerNewsStateService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isActiveType', () => {
    it('should return true when checking active type matches current type', () => {
      stateService.currentType.set('new');

      const result = component.isActiveType('new');

      expect(result).toBe(true);
    });

    it('should return false when checking active type does not match current type', () => {
      stateService.currentType.set('top');

      const result = component.isActiveType('new');

      expect(result).toBe(false);
    });
  });

  describe('getButtonClasses', () => {
    it('should return active classes when type is active', () => {
      stateService.currentType.set('top');

      const result = component.getButtonClasses('top');

      expect(result).toBe('bg-black text-white');
    });

    it('should return hover classes when type is not active', () => {
      stateService.currentType.set('top');

      const result = component.getButtonClasses('new');

      expect(result).toBe('hover:bg-gray-100');
    });
  });

  describe('loadMore()', () => {
    it('should not load more when already loading', () => {
      stateService.loading.set(true);

      component.loadMore();

      stateService.loadMore().subscribe((load) => {
        expect(load).toBeFalsy();
      });
    });

    it('should call loadMore when asked to load more stories', () => {
      stateService.loading.set(false);

      component.loadMore();

      stateService.loadMore().subscribe((load) => {
        expect(load).toBeTruthy();
      });
    });
  });

  it('should update search query when onSearchChange is called', () => {
    const testQuery = 'query';

    component.onSearchChange(testQuery);

    expect(stateService.searchQuery()).toBe(testQuery);
  });

  it('should clear search query when onSearchClear is called', () => {
    stateService.searchQuery.set('query');

    component.onSearchClear();

    expect(stateService.searchQuery()).toBe('');
  });
});
