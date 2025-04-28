import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-assign-employees',
  templateUrl: './assign-employees.component.html',
  styleUrls: ['./assign-employees.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonSelect,
    IonSelectOption
  ]
})
export class AssignEmployeesComponent  implements OnInit, OnChanges {
  employees: Employee[] = [];
  @Input() assignedEmployeeIDs: number[] = [];
  @Output() employeesSelectedEvent = new EventEmitter<number[]>();
  selectedEmployees: Employee[] = [];

  constructor(
    private _employeeService: EmployeeService,
    private _roleService: RoleService
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
    this.employees = this._employeeService.getEmployees();
  }

  /** Get RoleName with roleId from Role service */
  getRoleName(roleId: number): string {
    let role = this._roleService.getRole(roleId);
    if (role) {
      return role.roleName;
    }
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

}
