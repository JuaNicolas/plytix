import { TestBed } from '@angular/core/testing';
import { Department, User } from '../modal/types';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Store information', () => {
    it('The initial value should be an empty list', () => {
      service.users$.subscribe((list: User[]) => expect(list).toEqual([]));
    });
    it('If a user is inserted into the list it should exist', () => {
      const spy = spyOn(service, 'addUser').and.callThrough();
      const fakeUser: User = {
        id: '1',
        name: 'Nick Jonas',
        email: 'jonas@gmail.com',
        department: Department.Development,
      };
      service.addUser(fakeUser);
      service.users$.subscribe((list: User[]) => {
        expect(list).toHaveSize(1);
        expect(list).toContain(fakeUser);
      });
      expect(spy).toHaveBeenCalledWith(fakeUser);
    });

    it('If a user is edited, it should exist the new version only', () => {
      const fakeUser: User = {
        id: '2',
        name: 'James Brown',
        email: 'brown@gmail.com',
        department: Department.Development,
      };
      service.addUser(fakeUser);
      fakeUser.department = Department.Marketing;
      service.editUser(fakeUser);
      service.users$.subscribe((list: User[]) => {
        expect(list).toContain(fakeUser);
        expect(list).toHaveSize(1);
        expect(list[0].department).not.toBe(Department.Development);
      });
    });

    it('If a user is deleted, it should not exist', () => {
      const fakeUser: User = {
        id: '1',
        name: 'James Brown',
        email: 'brown@gmail.com',
        department: Department.Development,
      };
      service.addUser(fakeUser);
      service.deleteUser('1');
      service.users$.subscribe((list: User[]) => {
        expect(list).not.toContain(fakeUser);
        expect(list).toHaveSize(0);
      });
    });
  });
});
