import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateUser, Department } from 'src/app/models/types';
import { ControlsOf } from 'src/app/validators/form-controlsof.type';
import { FormValidators } from 'src/app/validators/form-validators';
import { UserRow } from '../table/table.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  readonly departments = Object.values(Department);

  form!: FormGroup<ControlsOf<Omit<CreateUser, 'created'>>>;
  isDisabled = false;

  constructor(
    private readonly fb: NonNullableFormBuilder,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: UserRow
  ) {}

  ngOnInit(): void {
    this.isDisabled = Boolean(this.data);
    this.form = this.fb.group({
      name: this.fb.control(
        {
          value: this.data?.name ?? '',
          disabled: this.isDisabled,
        },
        FormValidators.NameValidators()
      ),
      email: this.fb.control(
        {
          value: this.data?.email ?? '',
          disabled: this.isDisabled,
        },
        FormValidators.EmailValidators()
      ),
      department: this.fb.control(
        {
          value: this.data?.department ?? Department.Development,
          disabled: this.isDisabled,
        },
        FormValidators.DepartmentValidators()
      ),
    });
  }

  onSubmit(): void {
    if (this.isDisabled) {
      this.dialogRef.close(this.data?.id);
      return;
    }
    const { name, email, department } = this.form.getRawValue();
    const payload: CreateUser = {
      name,
      email,
      department,
      created: new Date().toISOString(),
    };

    this.dialogRef.close(payload);
  }
}
