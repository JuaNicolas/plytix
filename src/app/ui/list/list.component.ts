import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { Department, User } from 'src/app/models/types';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('search', { static: true })
  searchInput!: ElementRef<HTMLInputElement>;

  private usersOriginal: User[] = [];
  private readonly _subject$ = new Subject<void>();
  @Input() set users(value: User[]) {
    this.usersOriginal = value;
    this.usersCopy = value;
  }

  @Input() department!: Department;

  usersCopy: User[] = [];

  constructor() {}

  ngOnInit(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        takeUntil(this._subject$),
        map((event: any) => event?.target?.value),
        map((value) => String(value).toLowerCase()),
        debounceTime(250),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
          (this.usersCopy = this.usersOriginal.filter(
            (user) =>
              user.email.toLowerCase().search(value) !== -1 ||
              user.name.toLowerCase().search(value) !== -1
          ))
      );
  }

  ngOnDestroy(): void {
    this._subject$.next();
    this._subject$.complete();
  }
}
