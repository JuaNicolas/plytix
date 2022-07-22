import { Component, OnInit } from '@angular/core';

export enum Button {
  Left,
  Right,
}

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class ToggleButtonComponent implements OnInit {
  constructor() {}

  active = true;
  readonly button = Button;

  ngOnInit(): void {}

  handleClick(button: Button) {
    this.active = !button;
  }
}
