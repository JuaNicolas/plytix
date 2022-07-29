import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, mergeMap } from 'rxjs';
import { Department, User, UserRow } from 'src/app/models/types';
import { UsersService } from 'src/app/services/users.service';
import { ModalComponent } from '../modal/modal.component';

const COLUMNS_SCHEMA = [
  {
    key: 'name',
    type: 'text',
    label: 'Name',
  },
  {
    key: 'email',
    type: 'email',
    label: 'E-mail',
  },
  {
    key: 'department',
    type: 'select',
    label: 'Department',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  readonly displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  readonly columnsSchema = COLUMNS_SCHEMA;
  readonly departments = Object.values(Department);
  users: UserRow[] = [];
  private usersCopy: UserRow[] = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly modal: MatDialog
  ) {}

  ngOnInit(): void {
    this.usersService.users$
      .pipe(
        map((users) => users.map((user) => ({ ...user, isEditable: false })))
      )
      .subscribe((users) => {
        this.users = [...users];
        this.usersCopy = [...users];
      });
  }

  removeRow(user: UserRow): void {
    const dialog = this.modal.open<ModalComponent, UserRow, number>(
      ModalComponent,
      {
        data: user,
      }
    );
    dialog.afterOpened().subscribe(() => (this.users = [...this.usersCopy]));

    dialog
      .afterClosed()
      .pipe(
        filter(Boolean),
        mergeMap((id) => this.usersService.deleteUser({ id }))
      )
      .subscribe();
  }

  editRow(row: User): void {
    this.users = this.usersCopy.map((u) => ({
      ...u,
      isEditable: row.id === u.id,
    }));
  }

  confirmChange(user: UserRow): void {
    this.usersService.editUser(user).subscribe();
  }

  cancelChange(): void {
    this.users = [...this.usersCopy];
  }
}