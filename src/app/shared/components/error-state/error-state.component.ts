import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-state',
  imports: [CommonModule],
  templateUrl: './error-state.component.html',
})
export class ErrorStateComponent {
  public message = input<string>('Something went wrong. Please try again.');
  public showRetry = input<boolean>(true);

  public retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
