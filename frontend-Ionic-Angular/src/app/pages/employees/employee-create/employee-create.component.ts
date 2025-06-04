import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department } from 'src/app/models/department.model';
import { Role } from 'src/app/models/role.model';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
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
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss'],
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
  ]
})
export class EmployeeCreateComponent implements OnInit, OnDestroy {

  departments: Department[] = [];
  roles: Role[] = [];
  departmentsLoading: boolean = false;
  rolesLoading: boolean = false;
  createEmployeeLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  employeeForm: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    salary: new FormControl(0, [Validators.min(0), Validators.required]),
    departmentId: new FormControl(-1, Validators.required),
    roleId: new FormControl(null, Validators.required)
  });

  constructor(
    private _employeeService: EmployeeService,
    private _departmentService: DepartmentService,
    private _roleService: RoleService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getDepartments();
    this.capitalizeEmployeeName();
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
          this._toastService.presentErrorToast(error.message);
          this.departmentsLoading = false;
        }
      });
    this._departmentService.departmentsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getDepartments();
      });
  }

  /** Department change updates the roles array to the selected Department Roles  */
  departmentSelectionChange(event: CustomEvent): void {
    this.getRolesFromDepartmentId(event.detail.value);
  }

  /** Roles array is updated to selected departmentId Department roles */
  getRolesFromDepartmentId(departmentId: number): void {
    this.rolesLoading = true;
    this._roleService.getRolesFromDepartmentId(departmentId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (roles) => {
          this.roles = roles;
          this.rolesLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.rolesLoading = false;
        }
      });
  }

  onSubmit(): void {
    this.createEmployeeLoading = true;
    if (this.employeeForm.valid) {
      const formValue = {
        ...this.employeeForm.value,
        departmentId: Number(this.employeeForm.value.departmentId),
        roleId: Number(this.employeeForm.value.roleId),
      }
      this._employeeService.createEmployee(formValue)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.employeeForm.reset();
            this._employeeService.notifyEmployeesChanged();
            this._toastService.presentSuccessToast("Employee created.");
            this.createEmployeeLoading = false;
          },
          error: (error) => {
            this._toastService.presentErrorToast(error.message);
            this.createEmployeeLoading = false;
          }
        });
    }
    else {
      this._toastService.presentErrorToast("Employee failed to be created.");
    }
  }

  /** Capitalize employee name input */
  capitalizeEmployeeName(): void {
    this.employeeForm.get('name')?.valueChanges.subscribe(val => {
      if (val) {
        this.employeeForm.get('name')?.setValue(
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
