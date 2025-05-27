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
  employees: Employee[] = [];
  employeesLoading: boolean = false;
  roleLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  @Input() assignedEmployeeIDs: number[] = [];
  @Output() employeesSelectedEvent = new EventEmitter<number[]>();
  selectedEmployees: Employee[] = [];

  constructor(
    private _employeeService: EmployeeService,
    private _roleService: RoleService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.getEmployees();
    // Initialize selected employees based on input IDs
    this.selectedEmployees = this.employees.filter(emp =>
      this.assignedEmployeeIDs.includes(emp.employeeID)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assignedEmployeeIDs'] && this.employees.length) {
      this.selectedEmployees = this.employees.filter(emp =>
        this.assignedEmployeeIDs.includes(emp.employeeID)
      );
    }
  }

  /** Get all Employees from Employee service */
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
  }

  /** Get RoleName with roleId from Role service */
  getRoleName(roleId: number): string {
    this.roleLoading = true;
    let role = this._roleService.getRoleById(roleId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (role) => {
          if(role) {
            this.roleLoading = false;
            return role.roleName;
          } else {
            return "Unable to get role from role id";
          }
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.roleLoading = false;
        }
      });
    return "Unable to get role";
  }

  onEmployeeChange(event: any) {
    this.selectedEmployees = event.detail.value;
    const selectedIDs = this.selectedEmployees.map(emp => emp.employeeID);
    this.employeesSelectedEvent.emit(selectedIDs);
  }

  compareEmployees(e1: Employee, e2: Employee): boolean {
    return e1 && e2 ? e1.employeeID === e2.employeeID : e1 === e2;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
