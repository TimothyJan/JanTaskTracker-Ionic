import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectsChangedSource = new Subject<void>();  // Emit events when department is added/changed
  projectsChanged$ = this.projectsChangedSource.asObservable();

  projectID: number = 3;

  private projects: Project[] = [
    new Project(1, 'Project Alpha', 'First project', 'Active', new Date('2024-11-13'), new Date('2025-11-13')),
    new Project(2, 'Project Beta', 'Second project', 'Active', new Date('2024-11-13'), new Date('2025-1-13')),
  ];

  constructor() {}

  // Get all projects
  getProjects(): Project[] {
    return this.projects;
  }

  /** Get list of all projectIDs */
  getListOfProjectIDs(): number[] {
    let listOfProjectIDs: number[] = [];
    this.projects.forEach((project) => {
      listOfProjectIDs.push(project.projectID);
    });
    return listOfProjectIDs;
  }

  // Get a project by ID
  getProjectByID(projectID: number): Project {
    return this.projects.find((project) => project.projectID === projectID)!;
  }

  // Add a new project
  createProject(newProject: Project): void {
    newProject.projectID = this.projectID++;
    this.projects.push(newProject);
    this.projectsChangedSource.next();
  }

  // Update an existing project
  updateProject(updatedProject: Project): void {
    const index = this.projects.findIndex((project) => project.projectID === updatedProject.projectID);
    if (index !== -1) {
      this.projects[index] = updatedProject;
      this.projectsChangedSource.next();
    }
  }

  // Delete a project
  deleteProject(projectID: number): void {
    const index = this.projects.findIndex(project => project.projectID === projectID);
    if (index !== -1) {
      this.projects.splice(index, 1);
      this.projectsChangedSource.next(); // Notify subscribers that the project list has changed
    }
  }

  /** Emit events for projects update */
  notifyProjectsChanged(): void {
    this.projectsChangedSource.next();
  }
}
