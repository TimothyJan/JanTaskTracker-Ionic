import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private departmentsChangedSource = new Subject<void>();  // Emit events when department is added
  departmentsChanged$ = this.departmentsChangedSource.asObservable();

  departmentID: number = 3;

  departments: Department[] = [
    new Department(0, "FINANCE"),
    new Department(1, "HUMAN RESOURCES"),
    new Department(2, "INFORMATION TECHNOLOGY")
  ];

  constructor() { }

  /** Get Departments */
  getDepartments(): Department[] {
    return this.departments;
  }

  /** Get Departments based on id */
  getDepartment(id: number): Department | undefined {
    for(let i=0; i<this.departments.length; i++) {
      if(this.departments[i].departmentID == id) {
        return this.departments[i];
      }
    }
    return undefined
  }

  /** Post new Department */
  createDepartment(department: Department): void {
    let newDepartment = new Department(this.departmentID++, department.departmentName);
    this.departments.push(newDepartment);
    // console.log(this.departments);
  }

  /** Update existing Department based on id */
  updateDepartment(department: Department): void {
    for(let i=0; i<this.departments.length; i++) {
      if(this.departments[i].departmentID == department.departmentID) {
        this.departments[i] = department;
      }
    }
  }

  /** Delete Department based on id */
  deleteDepartment(id: number): void {
    for(let i=0; i<this.departments.length; i++) {
      if(this.departments[i].departmentID == id) {
        this.departments.splice(i, 1);
      }
    }
  }

  /** Emit events for departments update */
  notifyDepartmentsChanged(): void {
    this.departmentsChangedSource.next();
  }

  /** Checks for duplicate department names */
  checkDuplicates(departmentName: string): boolean {
    for(let i=0; i<this.departments.length; i++) {
      if(this.departments[i].departmentName == departmentName.toUpperCase()) {
        return true;
      }
    }
    return false;
  }

}
