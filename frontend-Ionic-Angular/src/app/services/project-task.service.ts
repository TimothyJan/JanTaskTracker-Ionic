import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProjectTask } from '../models/project-task.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development.';

const apiUrl = `${environment.apiUrl}/projecttask`;

@Injectable({
  providedIn: 'root'
})
export class ProjectTaskService {
  private projectTasksChangedSource = new Subject<void>();  // Emit events when department is added
  projectTasksChanged$ = this.projectTasksChangedSource.asObservable();

  constructor(private http: HttpClient) {}

  // Get all project tasks
  getProjectTasks(): Observable<ProjectTask[]> {
    return this.http.get<ProjectTask[]>(`${apiUrl}`);
  }

  // Get tasks by project Id
  getTasksByProjectId(projectId: number): Observable<ProjectTask[]> {
    return this.http.get<ProjectTask[]>(`${apiUrl}/project/${projectId}`);
  }

  // Get a project task by Id
  getProjectTaskById(taskId: number): Observable<ProjectTask> {
    return this.http.get<ProjectTask>(`${apiUrl}/${taskId}`);
  }

  // Create a new project task
  createProjectTask(newProjectTask: ProjectTask): Observable<ProjectTask> {
    return this.http.post<ProjectTask>(`${apiUrl}`, newProjectTask);
  }

  // Update an existing project task
  updateProjectTask(updatedTask: ProjectTask): Observable<void> {
    return this.http.put<void>(`${apiUrl}/${updatedTask.projectTaskId}`, updatedTask);
  }

  // Delete a project task
  deleteProjectTask(projectTaskId: number): Observable<void> {
    return this.http.delete<void>(`${apiUrl}/${projectTaskId}`);
  }

  // Get a list of project task Ids by project Id
  getListOfProjectTaskIdsByProjectId(projectId: number): Observable<number[]> {
    return this.http.get<number[]>(`${apiUrl}/project/${projectId}/tasks`);
  }

  // Notify subscribers about project tasks update
  notifyProjectTasksChanged(): void {
    this.projectTasksChangedSource.next();
  }
}
