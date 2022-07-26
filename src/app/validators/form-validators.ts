import { Validators } from '@angular/forms';

export class FormValidators {
  static DepartmentValidators() {
    return [Validators.required];
  }

  static NameValidators() {
    return [Validators.required, Validators.minLength(2)];
  }

  static EmailValidators() {
    return [Validators.required, Validators.email];
  }
}
