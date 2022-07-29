import { Pipe, PipeTransform } from '@angular/core';
import { Expertise, Pill, PillColor, User } from './models/types';

import * as dayjs from 'dayjs';

@Pipe({
  name: 'pill',
})
export class PillPipe implements PipeTransform {
  transform(user: User): Pill {
    const userDate = dayjs(user.created);
    const today = dayjs();
    const difference = today.diff(userDate, 'h', true);

    if (difference >= 72) {
      return {
        color: PillColor.Orange,
        expertise: Expertise.Expert,
      };
    }

    if (72 > difference && difference >= 48) {
      return {
        color: PillColor.Purple,
        expertise: Expertise.Senior,
      };
    }

    if (48 > difference && difference >= 24) {
      return {
        color: PillColor.Blue,
        expertise: Expertise.Advanced,
      };
    }

    return {
      color: PillColor.Green,
      expertise: Expertise.Experienced,
    };
  }
}
