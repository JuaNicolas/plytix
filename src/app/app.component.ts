import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, mergeMap } from 'rxjs';
import { CreateUser, Department } from './models/types';
import { UsersService } from './services/users.service';
import { ModalComponent } from './ui/modal/modal.component';
import { Button } from './ui/toggle-button/toggle-button.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  display = !Button.Left;
  departments = Department;
  marketingUsers$ = this.usersService.users$.pipe(
    map((users) => users.filter((u) => u.department === Department.Marketing))
  );
  developmentUsers$ = this.usersService.users$.pipe(
    map((users) => users.filter((u) => u.department === Department.Development))
  );

  constructor(
    private readonly usersService: UsersService,
    private readonly modal: MatDialog
  ) {}

  handleDisplay(event: Button): void {
    this.display = !event;
  }

  addUser(): void {
    this.modal
      .open<ModalComponent, null, CreateUser>(ModalComponent, {
        panelClass: 'custom-dialog-container',
        minWidth: 320,
        width: '700px',
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        mergeMap((user) => this.usersService.addUser(user))
      )
      .subscribe();
  }
}
