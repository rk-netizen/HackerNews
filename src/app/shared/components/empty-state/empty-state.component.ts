import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  public title = input<string>('No data found');
  public description = input<string>("There's nothing to show right now.");
  public actionText = input<string>();
  public refresh = output<void>();

  public onRefresh(): void {
    this.refresh.emit();
  }
}
