import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  imports: [CommonModule],
  templateUrl: './loading-state.component.html',
})
export class LoadingStateComponent {
  public message = input<string>('Loading...');
  public showSpinner = input<boolean>(true);
}
