import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ModalController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonItem,
  IonTitle,
  IonToolbar,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner
} from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { Department } from 'src/app/models/department.model';
import { Employee } from 'src/app/models/employee.model';
import { Role } from 'src/app/models/role.model';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { RoleService } from 'src/app/services/role.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-employee-edit-modal',
  templateUrl: './employee-edit-modal.component.html',
  styleUrls: ['./employee-edit-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonList,
    IonItem,
    IonTitle,
    IonToolbar,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonSpinner
  ],
})
export class EmployeeEditModalComponent implements OnInit, OnDestroy {
  @Input() employeeId: number = -1;
  originalEmployee: Employee = {employeeId:-1, name:"", salary:-1, departmentId:-1, roleId:-1};
  editedEmployee: Employee = {employeeId:-1, name:"", salary:-1, departmentId:-1, roleId:-1};
  departments: Department[] = [];
  filteredRoles: Role[] = [];

  employeeLoading: boolean = false;
  departmentsLoading: boolean = false;
  filteredRolesLoading: boolean = false;
  employeeSaving: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private modalCtrl: ModalController,
    private _employeeService: EmployeeService,
    private _departmentService: DepartmentService,
    private _roleService: RoleService,
    private _toastService: ToastService
  ) {}

  ngOnInit() {
    this.getEmployeeById();
    this.getDepartments();
  }

  /** Get Employee */
  getEmployeeById(): void {
    this.employeeLoading = true;
    const employee = this._employeeService.getEmployeeById(this.employeeId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (employee) => {
          this.originalEmployee = {...employee};
          this.editedEmployee = {...employee};
          this.employeeLoading = false;
          this.getRolesFromDepartmentId();
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.employeeLoading = false;
        }
      });
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

  /** Get filtered roles */
  getRolesFromDepartmentId(): void {
    this.filteredRolesLoading = true;
    console.log(this.editedEmployee.departmentId);
    this._roleService.getRolesFromDepartmentId(this.editedEmployee.departmentId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (filteredRoles) => {
          this.filteredRoles = filteredRoles;
          this.filteredRolesLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.filteredRolesLoading = false;
        }
      });
  }

  /** When department selection changes update the filteredRoles */
  changeFilteredRoles(event: CustomEvent): void {
    this.filteredRolesLoading = true;
    this._roleService.getRolesFromDepartmentId(this.editedEmployee.departmentId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (filteredRoles) => {
          this.filteredRoles = filteredRoles;
          this.filteredRolesLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.filteredRolesLoading = false;
        }
      });
  }

  /** Camcel and close modal */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /** Confirm save and close modal */
  confirm() {
    this.saveChanges();
    return this.modalCtrl.dismiss(this.employeeId, 'confirm');
  }

  /** save Changes */
  saveChanges(): void {
    this.employeeSaving = true;
    this._employeeService.updateEmployee(this.editedEmployee)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this._employeeService.notifyEmployeesChanged();
          this._toastService.presentSuccessToast("Employee saved.");
          this.employeeSaving = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.employeeSaving = false;
        }
    });
  }

  /** Capitalize Employee name input */
  onEmployeeNameInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.value) {
      this.editedEmployee.name = inputElement.value.toUpperCase();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
