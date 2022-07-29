import * as dayjs from 'dayjs';
import { Expertise, PillColor, User } from './models/types';
import { PillPipe } from './pill.pipe';

describe('PillPipe', () => {
  let pipe: PillPipe;

  beforeEach(() => (pipe = new PillPipe()));
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Return each case scenario', () => {
    beforeEach(() => spyOn(pipe, 'transform').and.callThrough());
    afterEach(() => expect(pipe.transform).toHaveBeenCalled());

    describe('The user is Experienced [1 or less days]', () => {
      it('23 HS', () => {
        const created = dayjs().subtract(23, 'hour');
        const pill = pipe.transform({ created } as unknown as User);
        expect(pill).toEqual({
          color: PillColor.Green,
          expertise: Expertise.Experienced,
        });
      });

      it('8HS', () => {
        const created = dayjs().subtract(8, 'hour');
        const pill = pipe.transform({ created } as unknown as User);
        expect(pill).toEqual({
          color: PillColor.Green,
          expertise: Expertise.Experienced,
        });
      });
    });

    describe('The user is Advanced [2 or less days]', () => {
      it('25', () => {
        const created = dayjs().subtract(25, 'hour');
        const pill = pipe.transform({ created } as unknown as User);
        expect(pill).toEqual({
          color: PillColor.Blue,
          expertise: Expertise.Advanced,
        });
      });

      it('47', () => {
        const created = dayjs().subtract(47, 'hour');
        const pill = pipe.transform({ created } as unknown as User);
        expect(pill).toEqual({
          color: PillColor.Blue,
          expertise: Expertise.Advanced,
        });
      });
    });

    describe('The user is Senior [3 or less days]', () => {
      it('50', () => {
        const created = dayjs().subtract(50, 'hour');
        const pill = pipe.transform({ created } as unknown as User);
        expect(pill).toEqual({
          color: PillColor.Purple,
          expertise: Expertise.Senior,
        });
      });
      it('71', () => {
        const created = dayjs().subtract(71, 'hour');
        const pill = pipe.transform({ created } as unknown as User);
        expect(pill).toEqual({
          color: PillColor.Purple,
          expertise: Expertise.Senior,
        });
      });
    });

    describe('The user is Expert [more than 3 days]', () => {
      it('72', () => {
        const created = dayjs().subtract(72, 'hour');
        const pill = pipe.transform({ created } as unknown as User);
        expect(pill).toEqual({
          color: PillColor.Orange,
          expertise: Expertise.Expert,
        });
      });

      it('300', () => {
        const created = dayjs().subtract(300, 'hour');
        const pill = pipe.transform({ created } as unknown as User);
        expect(pill).toEqual({
          color: PillColor.Orange,
          expertise: Expertise.Expert,
        });
      });
    });
  });
});
