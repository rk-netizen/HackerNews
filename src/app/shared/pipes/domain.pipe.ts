import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'domain',
})
export class DomainPipe implements PipeTransform {
  public transform(url: string | undefined): string {
    if (!url || !this.isValidUrl(url)) {
      return '';
    }

    const domain = new URL(url).hostname;
    return `(${domain})`;
  }

  private isValidUrl(url: string): boolean {
    const urlPattern = /^https?:\/\/.+/i;
    return urlPattern.test(url) && URL.canParse?.(url) !== false;
  }
}
