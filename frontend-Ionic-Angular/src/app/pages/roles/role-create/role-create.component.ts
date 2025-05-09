import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Department } from 'src/app/models/department.model';
import { DepartmentService } from 'src/app/services/department.service';
import { RoleService } from 'src/app/services/role.service';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonSpinner
} from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss'],
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
    IonSelect,
    IonSelectOption,
    IonSpinner
  ],
})
export class RoleCreateComponent implements OnInit, OnDestroy {
  departments: Department[] = [];
  departmentsLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  roleForm: FormGroup = new FormGroup({
    roleName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    departmentID: new FormControl(null, Validators.required)
  });

  constructor(
    private _roleService: RoleService,
    private _departmentService: DepartmentService,
    private _toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.getDepartments();
    this.capitalizeRoleName();
  }

  /** Get all departments */
  getDepartments(): void {
    this.departmentsLoading = true;
    this._departmentService.getDepartments()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.departments = data;
          this.departmentsLoading = false;
        },
        error: (error) => {
          console.log(error.message);
          this.departmentsLoading = false;
        }
      });

    // Subscribe to the department added notification
    this._departmentService.departmentsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getDepartments();  // Reload departments when a new one is added
      });
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      const formValue = {
        ...this.roleForm.value,
        departmentID: Number(this.roleForm.value.departmentID)
      };
      if(!this._roleService.checkDuplicates(formValue)) {
        this._roleService.addRole(formValue);
        this.roleForm.reset();
        this._roleService.notifyRolesChanged();
        this._toastService.presentSuccessToast("Role created.");
      }
      else {
        this._toastService.presentErrorToast("Role already exists.")
      }
    }
    else {
      this._toastService.presentErrorToast("Role failed to be created.");
    }
  }

  /** Capitalize departmentName input */
  capitalizeRoleName(): void {
    this.roleForm.get('roleName')?.valueChanges.subscribe(val => {
      if (val) {
        this.roleForm.get('roleName')?.setValue(
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
