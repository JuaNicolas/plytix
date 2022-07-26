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
    const difference = today.diff(userDate, 'd');

    if (difference > 3) {
      return {
        color: PillColor.Orange,
        expertise: Expertise.Expert,
      };
    }
    if (difference >= 2) {
      return {
        color: PillColor.Purple,
        expertise: Expertise.Senior,
      };
    }
    if (difference >= 1) {
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
