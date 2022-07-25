import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() user!: User;
  constructor() {}
}
