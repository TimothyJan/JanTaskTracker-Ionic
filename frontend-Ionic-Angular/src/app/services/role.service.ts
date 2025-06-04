import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Role } from '../models/role.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development.';

const apiUrl = `${environment.apiUrl}/role`;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private rolesChangedSource = new Subject<void>();  // Emit events when role is added
  rolesChanged$ = this.rolesChangedSource.asObservable();

  constructor(private http: HttpClient) { }

  /** Get Roles */
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(apiUrl)
  }

  /** Get Roles based on DepartmenIdd */
  getRolesFromDepartmentId(departmentId: number): Observable<Role[]> {
    return this.http.get<Role[]>(`${apiUrl}/department/${departmentId}/roles`)
  }

  /** Get Role based on id */
  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${apiUrl}/${id}`)
  }

  /** Post new Role */
  createRole(roleData: {roleName: string, departmentId: number}): Observable<void> {
    return this.http.post<void>(apiUrl, roleData);
  }

  /** Update existing Role based on id */
  updateRole(role: Role): Observable<void> {
    return this.http.put<void>(`${apiUrl}/${role.roleId}`, role)
  }

  /** Delete Role based on id */
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${apiUrl}/${id}`)
  }

  /** Checks for duplicate role names */
  checkDuplicates(name: string, departmentId: number): Observable<boolean> {
    return this.http.get<boolean>(`${apiUrl}/check-duplicate?name=${name}`);
  }

  /** Emit events for roles update */
  notifyRolesChanged(): void {
    this.rolesChangedSource.next();
  }

}
