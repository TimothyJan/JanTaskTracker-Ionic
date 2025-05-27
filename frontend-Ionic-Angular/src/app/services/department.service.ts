import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Department } from '../models/department.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development.';

const apiUrl = `${environment.apiUrl}/department`;

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private departmentsChangedSource = new Subject<void>();  // Emit events when department is added
  departmentsChanged$ = this.departmentsChangedSource.asObservable();

  constructor(private http: HttpClient) { }

  /** Get Departments */
  getDepartments(): Observable<Department []> {
    return this.http.get<Department[]>(apiUrl);
  }

  /** Get Departments based on id */
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${apiUrl}/${id}`);
  }

  /** Post new Department */
  createDepartment(departmentData: { departmentName: string }): Observable<void> {
    return this.http.post<void>(apiUrl, departmentData);
  }

  /** Update existing Department based on id */
  updateDepartment(department: Department): Observable<void> {
    return this.http.put<void>(`${apiUrl}/${department.departmentID}`, department);
  }

  /** Delete Department based on id */
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${apiUrl}/${id}`)
      // .pipe(catchError(this.handleError));
  }

  /** Checks for duplicate department names */
  checkDuplicates(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${apiUrl}/check-duplicate?name=${name}`);
  }

  /** Emit events for departments update */
  notifyDepartmentsChanged(): void {
    this.departmentsChangedSource.next();
  }

}
