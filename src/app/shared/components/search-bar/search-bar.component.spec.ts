import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default placeholder', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');

    expect(input?.placeholder).toBe('Search...');
  });

  it('should display custom placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Search stories...');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');

    expect(input?.placeholder).toBe('Search stories...');
  });

  it('should have empty value by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;

    expect(input?.value).toBe('');
  });

  it('should display custom value', () => {
    fixture.componentRef.setInput('value', 'angular');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;

    expect(input?.value).toBe('angular');
  });

  it('should show clear button when value is present', () => {
    fixture.componentRef.setInput('value', 'test');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const clearButton = compiled.querySelector('button[aria-label="clear-search"]');

    expect(clearButton).toBeTruthy();
    expect(clearButton?.textContent?.trim()).toBe('x');
  });

  it('should emit searchChange when input value changes', () => {
    let emittedValue = '';
    component.searchChange.subscribe((value: string) => {
      emittedValue = value;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;

    input.value = 'input-value';
    input.dispatchEvent(new Event('input'));

    expect(emittedValue).toBe('input-value');
  });

  it('should emit clear event when clear button is clicked', () => {
    let clearEmitted = false;
    component.clear.subscribe(() => {
      clearEmitted = true;
    });

    fixture.componentRef.setInput('value', 'test');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const clearButton = compiled.querySelector('button[aria-label="clear-search"]') as HTMLElement;
    clearButton?.click();

    expect(clearEmitted).toBe(true);
  });

  it('should call onSearchInput method when input changes', () => {
    let onSearchInputCalled = false;

    component.onSearchInput = (event: Event) => {
      onSearchInputCalled = true;
      component.onSearchInput(event);
    };

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;

    input.value = 'input-value';
    input.dispatchEvent(new Event('input'));

    expect(onSearchInputCalled).toBe(true);
  });

  it('should call onClear method when clear button is clicked', () => {
    let onClearCalled = false;

    component.onClear = () => {
      onClearCalled = true;
      component.onClear();
    };

    fixture.componentRef.setInput('value', 'test');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const clearButton = compiled.querySelector('button[aria-label="clear-search"]') as HTMLElement;
    clearButton?.click();

    expect(onClearCalled).toBe(true);
  });
});
