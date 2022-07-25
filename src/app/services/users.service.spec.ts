import { TestBed } from '@angular/core/testing';
import {
  CreateUser,
  DeleteUser,
  Department,
  EditUser,
  User,
} from '../modal/types';

import { UsersService } from './users.service';

import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

const dummyData: User[] = [
  {
    id: 1,
    name: 'Justin',
    email: 'justin.fisher@mail.com',
    department: Department.Marketing,
    created: '2020-11-05T00:00:00',
  },
  {
    id: 2,
    name: 'Sam',
    email: 'sam.black@mail.com',
    department: Department.Development,
    created: '2020-11-05T00:00:00',
  },
  {
    id: 3,
    name: 'Mabel',
    email: 'mabel.cox@mail.com',
    department: Department.Development,
    created: '2020-11-06T00:00:00',
  },
  {
    id: 4,
    name: 'Sean',
    email: 'sean.wellington@mail.com',
    department: Department.Marketing,
    created: '2020-11-06T00:00:00',
  },
  {
    id: 5,
    name: 'Allie',
    email: 'allie.lopez@mail.com',
    department: Department.Development,
    created: '2020-11-07T00:00:00',
  },
  {
    id: 6,
    name: 'Nannie',
    email: 'nannie.park@mail.com',
    department: Department.Marketing,
    created: '2020-11-07T00:00:00',
  },
];

describe('UsersService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UsersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Store information', () => {
    afterEach(() => httpTestingController.verify());

    describe('Get Users', () => {
      it('The initial value should be an empty list', () => {
        service.users$.subscribe((list: User[]) => expect(list).toEqual([]));
      });

      it('It should return an empty  user list', () => {
        const spy = spyOn(service, 'getUsers').and.callThrough();
        service
          .getUsers()
          .subscribe((users) => expect(users).toBeInstanceOf(Array));

        const req = httpTestingController.expectOne(environment.url);
        expect(req.request.method).toEqual('GET');

        // Expect server to return the users after GET
        const expectedResponse = new HttpResponse({
          status: 200,
          statusText: 'Ok',
          body: [],
        });
        req.event(expectedResponse);

        service.users$.subscribe((users) => {
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveSize(0);
          expect(users).toEqual([]);
        });
        expect(spy).toHaveBeenCalled();
      });

      it('It should return a populated user list', () => {
        const spy = spyOn(service, 'getUsers').and.callThrough();
        service
          .getUsers()
          .subscribe((users) => expect(users).toBeInstanceOf(Array));

        const req = httpTestingController.expectOne(environment.url);
        expect(req.request.method).toEqual('GET');

        // Expect server to return the users after GET
        const expectedResponse = new HttpResponse({
          status: 200,
          statusText: 'Ok',
          body: dummyData,
        });
        req.event(expectedResponse);

        service.users$.subscribe((users) => {
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveSize(6);
          expect(users).toEqual(dummyData);
        });
        expect(spy).toHaveBeenCalled();
      });

      it('It should return an empty user list if any error occur', () => {
        const spy = spyOn(service, 'getUsers').and.callThrough();

        service.getUsers().subscribe({
          error: (response) =>
            expect(response).toBeInstanceOf(HttpErrorResponse),
        });

        const req = httpTestingController.expectOne(environment.url);
        expect(req.request.method).toEqual('GET');

        // Reject server to the users after GET
        req.error(new ProgressEvent('Bad Request'), {
          status: 500,
          statusText: 'Internal Server Error',
        });

        service.users$.subscribe((users) => {
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveSize(0);
          expect(users).toEqual([]);
        });
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('Add User', () => {
      it('If a user is inserted into the list it should exist', () => {
        const spy = spyOn(service, 'addUser').and.callThrough();
        const fakeUser: CreateUser = {
          name: 'Nick Jonas',
          email: 'jonas@gmail.com',
          department: Department.Development,
          created: new Date().toISOString(),
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

      it('If add user fail it should not be added to the list', () => {
        const spy = spyOn(service, 'addUser').and.callThrough();
        const fakeUser: CreateUser = {
          name: 'Nick Jonas',
          email: 'jonas@gmail.com',
          department: Department.Development,
          created: new Date().toISOString(),
        };

        service.addUser(fakeUser).subscribe({
          error: (response) =>
            expect(response).toBeInstanceOf(HttpErrorResponse),
        });

        // AddUser should have made one request to POST
        const req = httpTestingController.expectOne(environment.url);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(fakeUser);

        // Expect server to throw error after POST
        req.error(new ProgressEvent('Bad Request'), {
          status: 500,
          statusText: 'Internal Server Error',
        });

        // Expect service to has not saved the user
        service.users$.subscribe((data) => {
          expect(data).not.toContain({ id: 1, ...fakeUser });
          expect(data).toHaveSize(0);
        });

        expect(spy).toHaveBeenCalledWith(fakeUser);
      });
    });

    describe('Edit User', () => {
      it('If a user is edited it should exist the new version only', () => {
        const spy = spyOn(service, 'editUser').and.callThrough();

        const modifiedUser: EditUser = {
          id: 1,
          name: 'Nick Jonas',
          email: 'jonas@gmail.com',
          department: Department.Marketing,
          created: new Date().toISOString(),
        };

        service
          .editUser(modifiedUser)
          .subscribe((newUser) => expect(newUser).toEqual(modifiedUser));

        // EditUser should have made one request to PATCH
        const req = httpTestingController.expectOne(
          `${environment.url}/${modifiedUser.id}`
        );
        expect(req.request.method).toEqual('PATCH');
        expect(req.request.body).toEqual(modifiedUser);
        expect(req.request.urlWithParams).toEqual(
          `${environment.url}/${modifiedUser.id}`
        );

        // Expect server to return the User after PATCH
        const expectedResponse = new HttpResponse({
          status: 200,
          statusText: 'OK',
          body: modifiedUser,
        });
        req.event(expectedResponse);

        service.users$.subscribe((users) =>
          expect(users).not.toContain(modifiedUser)
        );

        expect(spy).toHaveBeenCalledWith(modifiedUser);
      });

      it('If edit user fails the user should not be modified', () => {
        const spy = spyOn(service, 'editUser').and.callThrough();

        const modifiedUser: EditUser = {
          id: 1,
          name: 'Nick Jonas',
          email: 'jonas@gmail.com',
          department: Department.Marketing,
          created: new Date().toISOString(),
        };

        service.editUser(modifiedUser).subscribe({
          error: (response) =>
            expect(response).toBeInstanceOf(HttpErrorResponse),
        });

        // EditUser should have made one request to PATCH
        const req = httpTestingController.expectOne(
          `${environment.url}/${modifiedUser.id}`
        );
        expect(req.request.method).toEqual('PATCH');
        expect(req.request.body).toEqual(modifiedUser);
        expect(req.request.urlWithParams).toEqual(
          `${environment.url}/${modifiedUser.id}`
        );

        // Expect server to throw error after PATCH
        req.error(new ProgressEvent('Bad Request'), {
          status: 500,
          statusText: 'Internal Server Error',
        });

        expect(spy).toHaveBeenCalledWith(modifiedUser);
      });
    });

    describe('Delete User', () => {
      it('If a user is deleted, it should not exist', () => {
        const spy = spyOn(service, 'deleteUser').and.callThrough();

        const deleteUser: DeleteUser = {
          id: 1,
        };

        service
          .deleteUser(deleteUser)
          .subscribe((response) => expect(response).toBeNull());

        // DeleteUser should have made one request to DELETE
        const req = httpTestingController.expectOne(
          `${environment.url}/${deleteUser.id}`
        );
        expect(req.request.method).toEqual('DELETE');
        expect(req.request.urlWithParams).toEqual(
          `${environment.url}/${deleteUser.id}`
        );

        // Expect server to return the status after DELETE
        const expectedResponse = new HttpResponse({
          status: 200,
          statusText: 'OK',
        });
        req.event(expectedResponse);

        expect(spy).toHaveBeenCalledWith(deleteUser);
      });

      it('If a user is deleted and fails nothing happens', () => {
        const spy = spyOn(service, 'deleteUser').and.callThrough();

        const deleteUser: DeleteUser = {
          id: 1,
        };

        service.deleteUser(deleteUser).subscribe({
          error: (response) =>
            expect(response).toBeInstanceOf(HttpErrorResponse),
        });

        // DeleteUser should have made one request to DELETE
        const req = httpTestingController.expectOne(
          `${environment.url}/${deleteUser.id}`
        );
        expect(req.request.method).toEqual('DELETE');
        expect(req.request.urlWithParams).toEqual(
          `${environment.url}/${deleteUser.id}`
        );

        // Expect server to throw error after DELETE
        req.error(new ProgressEvent('Bad Request'), {
          status: 500,
          statusText: 'Internal Server Error',
        });

        expect(spy).toHaveBeenCalledWith(deleteUser);
      });
    });
  });
});
