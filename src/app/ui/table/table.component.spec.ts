import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  matDialogAnimations,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let fakeUsersService;

  beforeEach(async () => {
    fakeUsersService = jasmine.createSpyObj<UsersService>(
      'UsersService',
      { deleteUser: of(), editUser: of() },
      { users$: of([]) }
    );

    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [MatDialogModule, MatTableModule],
      providers: [
        MatDialog,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validateInput', () => {
    beforeEach(() => spyOn(component, 'validateInput').and.callThrough());
    afterEach(() => expect(component.validateInput).toHaveBeenCalled());

    describe('Validate Name', () => {
      it('Valid name', () => {
        component.validateInput('nicolas', 'text');
        expect(component.disableEdit).toBeFalse();
      });
      it('Invalid name', () => {
        component.validateInput('nicol!s', 'text');
        expect(component.disableEdit).toBeTrue();
      });
    });
    describe('Validate Email', () => {
      it('Valid email', () => {
        component.validateInput('email@email.com', 'email');
        expect(component.disableEdit).toBeFalse();
      });
      it('Invalid email', () => {
        component.validateInput('ema@il', 'email');
        expect(component.disableEdit).toBeTrue();
      });
    });
  });
});
