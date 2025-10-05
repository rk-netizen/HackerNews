import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h3');

    expect(titleElement?.textContent?.trim()).toBe('No data found');
  });

  it('should display custom title', () => {
    fixture.componentRef.setInput('title', 'No stories available');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h3');

    expect(titleElement?.textContent?.trim()).toBe('No stories available');
  });

  it('should display default description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const descriptionElement = compiled.querySelector('p');

    expect(descriptionElement?.textContent?.trim()).toBe("There's nothing to show right now.");
  });

  it('should display custom description', () => {
    fixture.componentRef.setInput('description', 'Try refreshing the page or checking back later.');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const descriptionElement = compiled.querySelector('p');

    expect(descriptionElement?.textContent?.trim()).toBe(
      'Try refreshing the page or checking back later.'
    );
  });

  it('should display action button when actionText is provided', () => {
    fixture.componentRef.setInput('actionText', 'Refresh');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');

    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toBe('Refresh');
  });

  it('should emit refresh event when button is clicked', () => {
    let refreshEmitted = false;
    component.refresh.subscribe(() => {
      refreshEmitted = true;
    });

    fixture.componentRef.setInput('actionText', 'Try Again');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    button?.click();

    expect(refreshEmitted).toBe(true);
  });

  it('should call onRefresh method when button is clicked', () => {
    let onRefreshCalled = false;
    component.onRefresh = () => {
      onRefreshCalled = true;
    };

    fixture.componentRef.setInput('actionText', 'Refresh');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    button?.click();

    expect(onRefreshCalled).toBe(true);
  });
});
