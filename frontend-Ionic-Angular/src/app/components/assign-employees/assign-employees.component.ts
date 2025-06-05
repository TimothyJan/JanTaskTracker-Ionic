import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonSelect,
  IonSelectOption,
  IonSpinner
} from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { ProjectTaskService } from 'src/app/services/project-task.service';
import { RoleService } from 'src/app/services/role.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-assign-employees',
  templateUrl: './assign-employees.component.html',
  styleUrls: ['./assign-employees.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonSelect,
    IonSelectOption,
    IonSpinner
  ]
})
export class AssignEmployeesComponent  implements OnInit, OnChanges, OnDestroy {
  @Input() projectTaskId: number = -1;
  @Output() employeesSelectedEvent = new EventEmitter<number[]>();
  employees: Employee[] = [];
  roles: any[] = [];
  assignedEmployeeIds: number[] = []
  selectedEmployees: Employee[] = [];

  assignedEmployeeIdsLoading: boolean = false;
  employeesLoading: boolean = false;
  roleLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _projectTaskService: ProjectTaskService,
    private _employeeService: EmployeeService,
    private _roleService: RoleService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    if (this.projectTaskId != -1) {
      this.getAssignedEmployeeIds();
    } else {
      this.assignedEmployeeIds = [];
    }
    this.getEmployees();
    this.getRoles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assignedEmployeeIds'] && this.employees.length) {
      this.selectedEmployees = this.employees.filter(emp =>
        this.assignedEmployeeIds.includes(emp.employeeId)
      );
    }
  }

  /**  */
  getAssignedEmployeeIds(): void {
    this.assignedEmployeeIdsLoading = true;
    this._projectTaskService.getProjectTaskById(this.projectTaskId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const projectTask = data;
          if (projectTask) {
            this.assignedEmployeeIds = projectTask.assignedEmployeeIds || [];
          }
          else {
            this._toastService.presentErrorToast("Unable to retrieve project task.");
          }
          this.assignedEmployeeIdsLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.assignedEmployeeIdsLoading = false;
        }
      })
  }

  /** Get all Employees from Employee service */
  getEmployees(): void {
    this.employeesLoading = true;
    this._employeeService.getEmployees()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (employees) => {
          this.employees = employees;

          // Initialize selected employees based on input Ids
          this.selectedEmployees = this.employees.filter(emp =>
            this.assignedEmployeeIds.includes(emp.employeeId)
          );

          this.employeesLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.employeesLoading = false;
        }
      });
  }

  /** Get all Roles from Role service */
  getRoles(): void {
    this.roleLoading = true;
    this._roleService.getRoles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (roles) => {
          this.roles = roles;
          this.roleLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.roleLoading = false;
        }
      })
  }

  /** Get RoleName with roleId from Role service */
  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.roleId === roleId);
    return role ? role.roleName : "Unknown role";
  }

  /** On ion-select change, display new employee */
  onEmployeeChange(event: any) {
    this.selectedEmployees = event.detail.value;
    const selectedIds = this.selectedEmployees.map(emp => emp.employeeId);
    this.employeesSelectedEvent.emit(selectedIds);
  }

  compareEmployees(e1: Employee, e2: Employee): boolean {
    return e1 && e2 ? e1.employeeId === e2.employeeId : e1 === e2;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
