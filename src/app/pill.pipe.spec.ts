import { Expertise, PillColor, User } from './models/types';
import { PillPipe } from './pill.pipe';

describe('PillPipe', () => {
  let pipe: PillPipe;

  beforeEach(() => (pipe = new PillPipe()));
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Return each case scenario', () => {
    it('The user is Experienced [1 or less days]', () => {
      const pill = pipe.transform({ created: new Date() } as unknown as User);
      expect(pill).toEqual({
        color: PillColor.Green,
        expertise: Expertise.Experienced,
      });
    });
    it('The user is Advanced [2 or less days]', () => {
      const created = new Date().setDate(new Date().getDate() - 1);
      const pill = pipe.transform({ created } as unknown as User);
      expect(pill).toEqual({
        color: PillColor.Blue,
        expertise: Expertise.Advanced,
      });
    });
    it('The user is Senior [3 or less days]', () => {
      const created = new Date().setDate(new Date().getDate() - 2);
      const pill = pipe.transform({ created } as unknown as User);
      expect(pill).toEqual({
        color: PillColor.Purple,
        expertise: Expertise.Senior,
      });
    });
    it('The user is Expert [more than 3 days]', () => {
      const created = new Date().setDate(new Date().getDate() - 9);
      const pill = pipe.transform({ created } as unknown as User);
      expect(pill).toEqual({
        color: PillColor.Orange,
        expertise: Expertise.Expert,
      });
    });
  });
});
