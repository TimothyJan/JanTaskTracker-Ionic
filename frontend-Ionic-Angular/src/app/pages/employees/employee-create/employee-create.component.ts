import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  IonSelectOption
} from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';

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
    IonSelectOption
  ]
})
export class EmployeeCreateComponent implements OnInit {

  departments: Department[] = []; // Array to hold department data
  roles: Role[] = []; // Array to hold role data

  employeeForm: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    salary: new FormControl(0, [Validators.min(0), Validators.required]),
    departmentID: new FormControl(-1, Validators.required),
    roleID: new FormControl(null, Validators.required)
  });

  constructor(
    private _employeeService: EmployeeService,
    private _departmentService: DepartmentService,
    private _roleService: RoleService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.departments = this._departmentService.getDepartments();
    this.capitalizeEmployeeName();
  }

  /** Department change updates the roles array to the selected Department Roles  */
  departmentSelectionChange(event: CustomEvent): void {
    this.getRolesFromDepartmentID(event.detail.value);
  }

  /** Roles array is updated to selected departmentID Department roles */
  getRolesFromDepartmentID(departmentID: number): void {
    this.roles = this._roleService.getRolesFromDepartmentID(departmentID);
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = {
        ...this.employeeForm.value,
        departmentID: Number(this.employeeForm.value.departmentID),
        roleID: Number(this.employeeForm.value.roleID),
      }
      // console.log('Form Submitted:', formValue);
      this._employeeService.addEmployee(formValue);
      this.employeeForm.reset();
      this._employeeService.notifyEmployeesChanged();
      this._toastService.presentSuccessToast("Employee created.");
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

}
