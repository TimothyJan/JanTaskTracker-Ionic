import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
} from '@ionic/angular/standalone';
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
    IonSelectOption
  ],
})
export class EmployeeEditModalComponent implements OnInit {
  @Input() employeeID: number = -1;
  originalEmployee: Employee = {employeeID:-1, name:"", salary:-1, departmentID:-1, roleID:-1};
  editedEmployee: Employee = {employeeID:-1, name:"", salary:-1, departmentID:-1, roleID:-1};
  departments: Department[] = [];
  filteredRoles: Role[] = [];

  constructor(
    private modalCtrl: ModalController,
    private _employeeService: EmployeeService,
    private _departmentService: DepartmentService,
    private _roleService: RoleService,
    private _toastService: ToastService
  ) {}

  ngOnInit() {
    this.getEmployee();
    this.departments = this._departmentService.getDepartments();
    this.filteredRoles= this._roleService.getRolesFromDepartmentID(this.originalEmployee.departmentID);
  }

  /** Get Employee */
  getEmployee(): void {
    const employee = this._employeeService.getEmployee(this.employeeID);
    if (!employee) {
      console.error('Employee not found');
      this.modalCtrl.dismiss(null, 'error');
      return;
    }
    this.originalEmployee = {...employee};
    this.editedEmployee = {...employee};
  }

  /** When department selection changes update the filteredRoles */
  changeFilteredRoles(event: CustomEvent): void {
    this.filteredRoles= this._roleService.getRolesFromDepartmentID(this.editedEmployee.departmentID)
  }

  /** Camcel and close modal */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /** Confirm save and close modal */
  confirm() {
    this.saveChanges();
    return this.modalCtrl.dismiss(this.employeeID, 'confirm');
  }

  /** save Changes */
  saveChanges(): void {
    this._employeeService.updateEmployee(this.editedEmployee);
    this._employeeService.notifyEmployeesChanged();
    this._toastService.presentSuccessToast("Employee saved.");
  }

  /** Capitalize Employee name input */
  onEmployeeNameInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.value) {
      this.editedEmployee.name = inputElement.value.toUpperCase();
    }
  }

}
