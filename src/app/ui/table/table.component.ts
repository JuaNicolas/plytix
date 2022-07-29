import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, mergeMap } from 'rxjs';
import { Department, User, UserRow } from 'src/app/models/types';
import { UsersService } from 'src/app/services/users.service';
import { ModalComponent } from '../modal/modal.component';

const COLUMNS_SCHEMA: {
  key: string;
  type: 'text' | 'select' | 'email' | 'isEdit';
  label: string;
}[] = [
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

  disableEdit = false;

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
        this.disableEdit = false;
      });
  }

  validateInput(
    input: string,
    type: 'text' | 'select' | 'email' | 'isEdit'
  ): void {
    if (type === 'email') {
      this.disableEdit = !new RegExp(
        String.raw`\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b`
      ).test(input);
    }

    if (type === 'text') {
      this.disableEdit = !new RegExp('^([a-zA-Z]{2,})$').test(input);
    }
  }

  removeRow(user: UserRow): void {
    const dialog = this.modal.open<ModalComponent, UserRow, UserRow>(
      ModalComponent,
      {
        data: user,
        panelClass: 'custom-dialog-container',
        minWidth: 320,
        width: '700px',
      }
    );
    dialog.afterOpened().subscribe(() => (this.users = [...this.usersCopy]));

    dialog
      .afterClosed()
      .pipe(
        filter(Boolean),
        mergeMap(({ id }) => this.usersService.deleteUser({ id }))
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
    this.disableEdit = false;
  }
}
