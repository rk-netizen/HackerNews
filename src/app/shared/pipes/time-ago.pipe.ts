import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance } from 'date-fns';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  public transform(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const now = new Date();

    const distance = formatDistance(date, now, {
      includeSeconds: false,
    });

    return `${distance} ago`;
  }
}
