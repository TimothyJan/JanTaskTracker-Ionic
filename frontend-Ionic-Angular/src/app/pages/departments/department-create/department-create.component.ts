import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/services/department.service';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton],
})
export class DepartmentCreateComponent implements OnInit{

  departmentForm: FormGroup = new FormGroup({
    departmentName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)])
  });

  constructor(
    private _departmentService: DepartmentService,
    private _toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.capitalizeDepartmentName();
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      // Check for duplicates
      if (!this._departmentService.checkDuplicates(this.departmentForm.controls["departmentName"].value)) {
        this._departmentService.createDepartment(this.departmentForm.value);
        this.departmentForm.reset();
        this._departmentService.notifyDepartmentsChanged();
        this._toastService.presentSuccessToast("Department created.");
      }
      else {
        this._toastService.presentErrorToast("Department already exists.");
      }
    }
    else {
      this._toastService.presentErrorToast("Department failed to be created.");
    }
  }

  /** Capitalize departmentName input */
  capitalizeDepartmentName(): void {
    this.departmentForm.get('departmentName')?.valueChanges.subscribe(val => {
      if (val) {
        this.departmentForm.get('departmentName')?.setValue(
          val.toUpperCase(),
          { emitEvent: false }  // Prevents infinite loop
        );
      }
    });
  }

}
