import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonSpinner
} from '@ionic/angular/standalone'
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';
import { InputComponent } from "../../input/input.component";
import { StatusSelectorComponent } from "../../status-selector/status-selector.component";
import { TextAreaComponent } from "../../text-area/text-area.component";
import { DateSelectorComponent } from "../../date-selector/date-selector.component";
import { ToastService } from 'src/app/services/toast.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-project-edit-modal',
  templateUrl: './project-edit-modal.component.html',
  styleUrls: ['./project-edit-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    InputComponent,
    StatusSelectorComponent,
    TextAreaComponent,
    DateSelectorComponent,
    IonSpinner
  ]
})

export class ProjectEditModalComponent implements OnInit, OnDestroy {
  @Input() projectId: number = -1;

  originalProject: Project = new Project(-1, "", "", "Not Started", new Date(), new Date());
  editedProject: Project = new Project(-1, "", "", "Not Started", new Date(), new Date());

  projectLoading: boolean = false;
  projectSaveLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private modalCtrl: ModalController,
    private _projectService: ProjectService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.getProject();
  }

  /** Get project with projectId */
  getProject(): void {
    this.projectLoading = true;
    this._projectService.getProjectById(this.projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const project = data;
          if(project) {
            this.originalProject = {...project};
            this.editedProject = {...project};
          }
          else {
            this._toastService.presentErrorToast("Unable to retrieve project");
          }
          this.projectLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.projectLoading = false;
        }
      })
  }

  /** Camcel and close modal */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /** Confirm save and close modal */
  confirm() {
    this.saveChanges();
    return this.modalCtrl.dismiss(this.projectId, 'confirm');
  }

  /** Handles projectName change from input component and assigns projectName value to projectForm */
  handleProjectNameChange(projectName: string): void {
    this.editedProject.projectName = projectName;
  }

  /** Handles status change from status-selector component and assigns status value to projectForm */
  handleStatusChange(status: any) {
    this.editedProject.status = status;
  }

  /** Handles description change from text-area component and assigns description value to projectForm */
  handleDescriptionChange(description: string): void {
    this.editedProject.description = description;
  }

  /** Handles startDate change from date-selector component and assigns date value to projectForm */
  handleStartDateSelection(selectedDate: string) {
    // Convert to Date object if needed
    const dateObj = new Date(selectedDate);
    this.editedProject.startDate = dateObj;
  }

  /** Handles dateDate change from date-selector component and assigns date value to projectForm */
  handleDueDateSelection(selectedDate: string) {
    // Convert to Date object if needed
    const dateObj = new Date(selectedDate);
    this.editedProject.dueDate = dateObj;
  }

  /** Save edits to project */
  saveChanges(): void {
    this.projectSaveLoading = true;
    this._projectService.updateProject(this.editedProject)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this._projectService.notifyProjectsChanged();
          this._toastService.presentSuccessToast("Project saved.");
          this.projectSaveLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.projectSaveLoading = false;
        }
      })

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
