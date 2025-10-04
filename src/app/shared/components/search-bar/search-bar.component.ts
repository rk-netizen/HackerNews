import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  public placeholder = input<string>('Search...');
  public value = input<string>('');

  public searchChange = output<string>();
  public clear = output<void>();

  public onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  public onClear(): void {
    this.clear.emit();
  }
}
