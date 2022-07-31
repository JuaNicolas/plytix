import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, take } from 'rxjs';
import { AppComponent } from './app.component';
import { Department, User } from './models/types';
import { UsersService } from './services/users.service';
import { Button } from './ui/toggle-button/toggle-button.component';

const devUserMock: User = {
  id: 0,
  name: 'Tino',
  email: 'giordano@gmail.com',
  department: Department.Development,
  created: new Date().toISOString(),
};
const markUserMock: User = {
  id: 0,
  name: 'Marciano',
  email: 'lucciano@gmail.com',
  department: Department.Marketing,
  created: new Date().toISOString(),
};
const mockUsers: User[] = [devUserMock, markUserMock];

describe('AppComponent', () => {
  let component: AppComponent;
  let fakeUsersService: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    fakeUsersService = jasmine.createSpyObj<UsersService>(
      'UsersService',
      {
        addUser: of(),
        getUsers: of(mockUsers),
      },
      {
        users$: of(mockUsers),
      }
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule, NoopAnimationsModule],
      declarations: [AppComponent],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    component = TestBed.createComponent(AppComponent).componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('handleDisplay', () => {
    beforeEach(() => spyOn(component, 'handleDisplay').and.callThrough());
    afterEach(() => expect(component.handleDisplay).toHaveBeenCalled());

    it('should handle user press Left Button', () => {
      component.handleDisplay(Button.Left);
      expect(component.display).toBeTrue();
    });

    it('should handle user press Right Button', () => {
      component.handleDisplay(Button.Right);
      expect(component.display).toBeFalse();
    });
  });

  describe('Filter users by department', () => {
    it('Should filter by Marketing', () => {
      component.marketingUsers$.pipe(take(1)).subscribe((users) => {
        expect(users).not.toContain(devUserMock);
        expect(users).toContain(markUserMock);
        expect(users).toHaveSize(1);
      });
    });
    it('Should filter by Development', () => {
      component.developmentUsers$.pipe(take(1)).subscribe((users) => {
        expect(users).not.toContain(markUserMock);
        expect(users).toContain(devUserMock);
        expect(users).toHaveSize(1);
      });
    });
  });
});
