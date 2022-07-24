import { TestBed } from '@angular/core/testing';
import { CreateUser, Department, EditUser, User } from '../modal/types';

import { UsersService } from './users.service';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { combineLatest, map, mergeMap, take } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UsersService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Store information', () => {
    afterEach(() => httpTestingController.verify());
    it('The initial value should be an empty list', () => {
      service.users$.subscribe((list: User[]) => expect(list).toEqual([]));
    });
    it('If a user is inserted into the list it should exist', () => {
      const spy = spyOn(service, 'addUser').and.callThrough();
      const fakeUser: CreateUser = {
        name: 'Nick Jonas',
        email: 'jonas@gmail.com',
        department: Department.Development,
      };

      service
        .addUser(fakeUser)
        .subscribe((newUser) =>
          expect(newUser).toEqual({ id: 1, ...fakeUser })
        );

      // AddUser should have made one request to POST
      const req = httpTestingController.expectOne(environment.url);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(fakeUser);

      // Expect server to return the User after POST
      const expectedResponse = new HttpResponse({
        status: 201,
        statusText: 'Created',
        body: { id: 1, ...fakeUser },
      });
      req.event(expectedResponse);

      // Expect service to save new User
      service.users$.subscribe((data) => {
        expect(data).toContain({ id: 1, ...fakeUser });
        expect(data).toHaveSize(1);
      });

      expect(spy).toHaveBeenCalledWith(fakeUser);
    });

    it('If a user is edited it should exist the new version only', () => {
      const spy = spyOn(service, 'editUser').and.callThrough();

      const modifiedUser: User = {
        id: 1,
        name: 'Nick Jonas',
        email: 'jonas@gmail.com',
        department: Department.Marketing,
      };

      service
        .editUser(modifiedUser)
        .subscribe((newUser) => expect(newUser).toEqual(modifiedUser));

      // AddUser should have made one request to PATCH
      const req = httpTestingController.expectOne(
        `${environment.url}/${modifiedUser.id}`
      );
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(modifiedUser);

      // Expect server to return the User after POST
      const expectedResponse = new HttpResponse({
        status: 200,
        statusText: 'OK',
        body: modifiedUser,
      });
      req.event(expectedResponse);

      expect(spy).toHaveBeenCalledWith(modifiedUser);
    });

    xit('If a user is deleted, it should not exist', () => {
      const fakeUser: User = {
        id: 1,
        name: 'James Brown',
        email: 'brown@gmail.com',
        department: Department.Development,
      };
      service.addUser(fakeUser);
      service.deleteUser(1);
      service.users$.subscribe((list: User[]) => {
        expect(list).not.toContain(fakeUser);
        expect(list).toHaveSize(0);
      });
    });
  });
});
