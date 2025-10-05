import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state.component';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default error message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const messageElement = compiled.querySelector('p');

    expect(messageElement?.textContent).toContain('Something went wrong. Please try again.');
  });

  it('should display custom error message', () => {
    fixture.componentRef.setInput('message', 'Network connection failed');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const messageElement = compiled.querySelector('p');

    expect(messageElement?.textContent).toContain('Network connection failed');
  });

  it('should show retry button by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');

    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toBe('Try Again');
  });

  it('should hide retry button when showRetry is false', () => {
    fixture.componentRef.setInput('showRetry', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');

    expect(button).toBeFalsy();
  });

  it('should emit retry event when button is clicked', () => {
    let retryEmitted = false;
    component.retry.subscribe(() => {
      retryEmitted = true;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    button?.click();

    expect(retryEmitted).toBe(true);
  });

  it('should call onRetry method when button is clicked', () => {
    let onRetryCalled = false;
    component.onRetry = () => {
      onRetryCalled = true;
    };

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    button?.click();

    expect(onRetryCalled).toBe(true);
  });
});
