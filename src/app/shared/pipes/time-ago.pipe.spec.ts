import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    pipe = new TimeAgoPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format "now" timestamp correctly', () => {
    const now = Math.floor(Date.now() / 1000);
    const fiveMinutesAgo = now - 5 * 60;

    const result = pipe.transform(fiveMinutesAgo);
    expect(result).toContain('ago');
    expect(result).toContain('minute');
  });

  it('should handle timestamps from hours ago', () => {
    const now = Math.floor(Date.now() / 1000);
    const twoHoursAgo = now - 2 * 60 * 60;

    const result = pipe.transform(twoHoursAgo);
    expect(result).toContain('ago');
    expect(result).toContain('hour');
  });

  it('should handle timestamps from days ago', () => {
    const now = Math.floor(Date.now() / 1000);
    const threeDaysAgo = now - 3 * 24 * 60 * 60;

    const result = pipe.transform(threeDaysAgo);
    expect(result).toContain('ago');
    expect(result).toContain('day');
  });

  it('should handle a year ago timestamps', () => {
    const now = Math.floor(Date.now() / 1000);
    const oneYearAgo = now - 365 * 24 * 60 * 60;

    const result = pipe.transform(oneYearAgo);
    expect(result).toContain('ago');
    expect(result).toContain('year');
  });
});
