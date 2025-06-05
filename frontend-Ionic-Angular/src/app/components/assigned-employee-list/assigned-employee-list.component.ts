import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  IonList,
  IonListHeader,
  IonItem,
  IonText,
  IonSpinner
} from '@ionic/angular/standalone';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Employee } from 'src/app/models/employee.model';
import { ProjectTask } from 'src/app/models/project-task.model';
import { Role } from 'src/app/models/role.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { ProjectTaskService } from 'src/app/services/project-task.service';
import { RoleService } from 'src/app/services/role.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-assigned-employee-list',
  templateUrl: './assigned-employee-list.component.html',
  styleUrls: ['./assigned-employee-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonList,
    IonListHeader,
    IonItem,
    IonText,
    IonSpinner
  ]
})
export class AssignedEmployeeListComponent  implements OnInit, OnDestroy {
  @Input() projectTaskId: number = 0;
  projectTask: ProjectTask = new ProjectTask(0, 0, "", "", "Not Started");
  employees: Employee[] = [];
  roles: Role[] = [];

  projectTaskLoading: boolean = false;
  employeesLoading: boolean = false;
  rolesLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _projectTaskService: ProjectTaskService,
    private _employeeService: EmployeeService,
    private _roleService: RoleService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.getProjectTaskById();
    this.getEmployees();
    this.getRoles();

    // Subscribe to project task changes
    this._projectTaskService.projectTasksChanged$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => {
      this.getProjectTaskById();
    });
  }

  /** Get ProjectTask by Id */
  getProjectTaskById(): void {
    this.projectTaskLoading = true;
    this._projectTaskService.getProjectTaskById(this.projectTaskId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.projectTask = data;
          this.projectTaskLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.projectTaskLoading = false;
        }
      })
  }

  /** Get all Employees */
  getEmployees(): void {
    this.employeesLoading = true;
    this._employeeService.getEmployees()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (employees) => {
          this.employees = employees;
          this.employeesLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.employeesLoading = false;
        }
      });

      this._employeeService.employeesChanged$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.getEmployees();
        });
  }

  /* Get all Roles */
  getRoles(): void {
    this.rolesLoading = true;
    this._roleService.getRoles()
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
    this._roleService.rolesChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getRoles();
      })
  }

  /** Get User by employeeId */
  getEmployeeNameAndRoleNameByEmployeeId(employeeId: number) {
    const employee = this.employees.find(emp => emp.employeeId == employeeId);
    const role = this.roles.find(role => role.roleId == employee?.roleId);
    return employee?.name + " - " + role?.roleName;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
