import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/services/department.service';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonButton,
  IonSpinner
} from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { Subject, switchMap, takeUntil } from 'rxjs';

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
    IonButton,
    IonSpinner
  ],
})
export class DepartmentCreateComponent implements OnInit, OnDestroy{

  createDepartmentLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

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
    this.createDepartmentLoading = true;

    if (this.departmentForm.valid) {
      const departmentName = this.departmentForm.controls["departmentName"].value;
      const departmentData = { departmentName: departmentName };

      this._departmentService.checkDuplicates(departmentName)
        .pipe(
          takeUntil(this.unsubscribe$),
          switchMap(isDuplicate => {
            if (isDuplicate) {
              throw new Error('Department already exists.');
            }
            return this._departmentService.createDepartment(departmentData);
          })
        )
        .subscribe({
          next: () => {
            this.departmentForm.reset();
            this._departmentService.notifyDepartmentsChanged();
            this._toastService.presentSuccessToast("Department created successfully.");
            this.createDepartmentLoading = false;
          },
          error: (error) => {
            this._toastService.presentErrorToast(error.message);
            this.createDepartmentLoading = false;
          }
        });
    } else {
      this._toastService.presentErrorToast("Please fill in all required fields correctly.");
      this.createDepartmentLoading = false;
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
