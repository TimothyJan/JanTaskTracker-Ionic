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
import { Subject, switchMap, takeUntil } from 'rxjs';

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
  createRoleLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  roleForm: FormGroup = new FormGroup({
    roleName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    departmentId: new FormControl(null, Validators.required)
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
          this._toastService.presentErrorToast(error.message);
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
    this.createRoleLoading = true;

    if (this.roleForm.valid) {
      const roleName = this.roleForm.controls["roleName"].value;
      const departmentId = Number(this.roleForm.value.departmentId);
      const roleData = {
        roleName: roleName,
        departmentId: departmentId
      };

      this._roleService.checkDuplicates(roleName, departmentId)
        .pipe(
          takeUntil(this.unsubscribe$),
          switchMap(isDuplicate => {
            if (isDuplicate) {
              throw new Error('Role already exists within department.');
            }
            return this._roleService.createRole(roleData);
          })
        )
        .subscribe({
          next: () => {
            this.roleForm.reset();
            this._roleService.notifyRolesChanged();
            this._toastService.presentSuccessToast("Role created successfully.");
            this.createRoleLoading = false;
          },
          error: (error) => {
            this._toastService.presentErrorToast(error.message);
            this.createRoleLoading = false;
          }
        });
    } else {
      this._toastService.presentErrorToast("Please fill in all required fields correctly.");
      this.createRoleLoading = false;
    }
  }

  /** Capitalize roleName input */
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
