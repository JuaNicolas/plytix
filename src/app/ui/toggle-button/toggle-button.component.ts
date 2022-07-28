import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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
  @Output() display = new EventEmitter<Button>();
  constructor() {}

  active = true;
  readonly button = Button;

  ngOnInit(): void {}

  handleClick(button: Button) {
    this.active = !button;
    this.display.emit(button);
  }
}
