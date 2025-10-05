import { DomainPipe } from './domain.pipe';

describe('DomainPipe', () => {
  let pipe: DomainPipe;

  beforeEach(() => {
    pipe = new DomainPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should extract domain from valid URL', () => {
    const url = 'https://test.com/test-path';
    const result = pipe.transform(url);
    expect(result).toBe('(test.com)');
  });

  it('should return empty string for invalid URLs', () => {
    expect(pipe.transform('invalid-url')).toBe('');
  });

  it('should return empty string for undefined or empty input', () => {
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });
});
