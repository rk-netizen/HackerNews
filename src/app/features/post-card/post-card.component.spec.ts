import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCardComponent } from './post-card.component';
import { Story } from '../../core/models/hacker-news-item.interface';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { DomainPipe } from '../../shared/pipes/domain.pipe';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;

  const mockStory: Story = {
    id: 123456,
    title: 'story-title',
    by: 'Dr Austin',
    score: 1250,
    url: 'https://github.com',
    time: Math.floor(Date.now() / 1000) - 3600,
    descendants: 180,
    type: 'story',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCardComponent, TimeAgoPipe, DomainPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('post', mockStory);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display post title', () => {
    fixture.componentRef.setInput('post', mockStory);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const titleLink = compiled.querySelector('a');

    expect(titleLink?.textContent?.trim()).toBe('story-title');
  });

  it('should display domain when URL is present', () => {
    fixture.componentRef.setInput('post', mockStory);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const domainSpan = compiled.querySelector('span.text-gray-500');

    expect(domainSpan?.textContent?.trim()).toBe('(github.com)');
  });

  it('should not display domain when URL is not present', () => {
    fixture.componentRef.setInput('post', { ...mockStory, url: undefined });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const domainSpan = compiled.querySelector('span.text-gray-500');

    expect(domainSpan).toBeFalsy();
  });

  it('should display post score', () => {
    fixture.componentRef.setInput('post', mockStory);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const classInfo = compiled.querySelector('.text-gray-600');

    expect(classInfo?.textContent).toContain('1250 points');
  });

  it('should display post author', () => {
    fixture.componentRef.setInput('post', mockStory);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const classInfo = compiled.querySelector('.text-gray-600');

    expect(classInfo?.textContent).toContain('by Dr Austin');
  });

  it('should display comment count', () => {
    fixture.componentRef.setInput('post', mockStory);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const classInfo = compiled.querySelector('.text-gray-600');

    expect(classInfo?.textContent).toContain('180 comments');
  });

  it('should display 0 comments when descendants is undefined', () => {
    const storyWithoutComments: Story = {
      ...mockStory,
      descendants: undefined,
    };

    fixture.componentRef.setInput('post', storyWithoutComments);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const classInfo = compiled.querySelector('.text-gray-600');

    expect(classInfo?.textContent).toContain('0 comments');
  });
});
