import { Component, Input, OnInit } from '@angular/core';

export enum PillColor {
  Green = 'green',
  Purple = 'purple',
  Blue = 'blue',
  Orange = 'orange',
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() pillStyle: PillColor = PillColor.Blue;
  constructor() {}

  ngOnInit(): void {}
}
