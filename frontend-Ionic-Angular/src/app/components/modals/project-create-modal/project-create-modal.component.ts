import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
} from '@ionic/angular/standalone';
import { InputComponent } from "../../input/input.component";
import { StatusSelectorComponent } from "../../status-selector/status-selector.component";
import { TextAreaComponent } from "../../text-area/text-area.component";
import { DateSelectorComponent } from "../../date-selector/date-selector.component";
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';
import { ToastService } from 'src/app/services/toast.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-project-create-modal',
  templateUrl: './project-create-modal.component.html',
  styleUrls: ['./project-create-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    TextAreaComponent,
    InputComponent,
    StatusSelectorComponent,
    TextAreaComponent,
    DateSelectorComponent,
    IonSpinner
]
})
export class ProjectCreateModalComponent implements OnDestroy {

  projectForm: FormGroup = new FormGroup({
    projectName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    description: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    status: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    startDate: new FormControl(""),
    dueDate: new FormControl("")
  });

  projectCreateLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private modalCtrl: ModalController,
    private _projectService: ProjectService,
    private _toastService: ToastService
  ) {}

  /** Camcel and close modal */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /** Confirm save and close modal */
  confirm() {
    if(this.projectForm.valid) {
      this.createProject();
      return this.modalCtrl.dismiss('confirm');
    }
    return this.modalCtrl.dismiss('confirm');
  }

  /** Handles projectName change from input component and assigns projectName value to projectForm */
  handleProjectNameChange(projectName: string): void {
    this.projectForm.controls['projectName'].setValue(projectName);
  }

  /** Handles status change from status-selector component and assigns status value to projectForm */
  handleStatusChange(status: string) {
    this.projectForm.controls['status'].setValue(status);
  }

  /** Handles description change from text-area component and assigns description value to projectForm */
  handleDescriptionChange(description: string): void {
    this.projectForm.controls['description'].setValue(description);
  }

  /** Handles startDate change from date-selector component and assigns date value to projectForm */
  handleStartDateSelection(selectedDate: string) {
    // Convert to Date object if needed
    const dateObj = new Date(selectedDate);
    this.projectForm.controls['startDate'].setValue(dateObj);
  }

  /** Handles dateDate change from date-selector component and assigns date value to projectForm */
  handleDueDateSelection(selectedDate: string) {
    // Convert to Date object if needed
    const dateObj = new Date(selectedDate);
    this.projectForm.controls['dueDate'].setValue(dateObj);
  }

  /** Add Project */
  createProject(): void {
    this.projectCreateLoading = true;
    const newProject = new Project(
      0,
      this.projectForm.controls["projectName"].value,
      this.projectForm.controls["description"].value,
      this.projectForm.controls["status"].value,
      this.projectForm.controls["startDate"].value,
      this.projectForm.controls["dueDate"].value,
    );
    this._projectService.createProject(newProject)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this._projectService.notifyProjectsChanged();
          this._toastService.presentSuccessToast("Project created.");
          this.projectCreateLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.projectCreateLoading = false;
        }
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
