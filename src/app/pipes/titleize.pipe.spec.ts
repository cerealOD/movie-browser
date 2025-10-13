import { TitleizePipe } from './titleize.pipe';

describe('TitleizePipe', () => {
  let pipe: TitleizePipe;

  beforeEach(() => {
    pipe = new TitleizePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  // only this test is relevant in the app
  it('should capitalize each word separated by hyphens', () => {
    const result = pipe.transform('the-dark-knight');
    expect(result).toBe('The Dark Knight');
  });
});
