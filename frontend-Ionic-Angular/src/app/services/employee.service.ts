import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Employee } from '../models/employee.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development.';

const apiUrl = `${environment.apiUrl}/employee`;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesChangedSource = new Subject<void>(); //Emit events when employee is added
  employeesChanged$ = this.employeesChangedSource.asObservable();

  constructor(private http: HttpClient) { }

  /** Get Employees */
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(apiUrl);
  }

  /** Get Employee based on id */
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${apiUrl}/${id}`);
  }

  /** Post new Employee */
  createEmployee(employee: Employee): Observable<void> {
    return this.http.post<void>(apiUrl, employee);
  }

  /** Update existing Employee based on id */
  updateEmployee(employee: Employee): Observable<void> {
    return this.http.put<void>(`${apiUrl}/${employee.employeeID}`, employee);
  }

  /** Delete Employee based on id */
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${apiUrl}/${id}`);
  }

  /** Emit events for employees update */
  notifyEmployeesChanged(): void {
    this.employeesChangedSource.next();
  }
}
