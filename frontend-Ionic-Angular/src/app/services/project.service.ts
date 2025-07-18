import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Project } from '../models/project.model';
import { environment } from 'src/environments/environment.development.';
import { HttpClient } from '@angular/common/http';

const apiUrl = `${environment.apiUrl}/project`;

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsChangedSource = new Subject<void>();  // Emit events when department is added
  projectsChanged$ = this.projectsChangedSource.asObservable();

  constructor(private http: HttpClient) {}

  /** Get all projects */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${apiUrl}`);
  }

  /** Get a project by Id */
  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${apiUrl}/${projectId}`);
  }

  /** Add a new project */
  createProject(newProject: Project): Observable<Project> {
    return this.http.post<Project>(`${apiUrl}`, newProject);
  }

  /** Update an existing project */
  updateProject(updatedProject: Project): Observable<void> {
    return this.http.put<void>(`${apiUrl}/${updatedProject.projectId}`, updatedProject);
  }

  /** Delete a project */
  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${apiUrl}/${projectId}`);
  }

  /** Get list of all projectIds */
  getListOfProjectIds(): Observable<number[]> {
    return this.http.get<number[]>(`${apiUrl}/projectIds`);
  }

  /** Emit events for project updates */
  notifyProjectsChanged(): void {
    this.projectsChangedSource.next();
  }
}
