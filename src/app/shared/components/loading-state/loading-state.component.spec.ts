import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingStateComponent } from './loading-state.component';

describe('LoadingStateComponent', () => {
  let component: LoadingStateComponent;
  let fixture: ComponentFixture<LoadingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default loading message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const messageElement = compiled.querySelector('p');

    expect(messageElement?.textContent?.trim()).toBe('Loading...');
  });

  it('should display custom loading message', () => {
    fixture.componentRef.setInput('message', 'Loading stories...');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const messageElement = compiled.querySelector('p');

    expect(messageElement?.textContent?.trim()).toBe('Loading stories...');
  });

  it('should show spinner by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('[aria-label="Loading"]');

    expect(spinner).toBeTruthy();
    expect(spinner?.classList).toContain('animate-spin');
  });

  it('should hide spinner when showSpinner is false', () => {
    fixture.componentRef.setInput('showSpinner', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('[aria-label="Loading"]');

    expect(spinner).toBeFalsy();
  });
});
