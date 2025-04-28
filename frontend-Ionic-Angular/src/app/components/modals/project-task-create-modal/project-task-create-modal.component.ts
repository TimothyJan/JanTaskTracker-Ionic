import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem
} from '@ionic/angular/standalone';
import { InputComponent } from "../../input/input.component";
import { TextAreaComponent } from "../../text-area/text-area.component";
import { StatusSelectorComponent } from "../../status-selector/status-selector.component";
import { DateSelectorComponent } from "../../date-selector/date-selector.component";
import { ProjectTaskService } from 'src/app/services/project-task.service';
import { ToastService } from 'src/app/services/toast.service';
import { ProjectTask } from 'src/app/models/project-task.model';
import { AssignEmployeesComponent } from "../../assign-employees/assign-employees.component";

@Component({
  selector: 'app-project-task-create-modal',
  templateUrl: './project-task-create-modal.component.html',
  styleUrls: ['./project-task-create-modal.component.scss'],
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
    TextAreaComponent,
    StatusSelectorComponent,
    DateSelectorComponent,
    AssignEmployeesComponent
]
})
export class ProjectTaskCreateModalComponent  implements OnInit {
  @Input() projectID: number = -1;

  projectTaskForm: FormGroup = new FormGroup({
    projectID: new FormControl(0, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    title: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    description: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    status: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    startDate: new FormControl(""),
    dueDate: new FormControl(""),
    assignedEmployeeIDs: new FormControl([]),
  });

  constructor(
    private modalCtrl: ModalController,
    private _projectTaskService: ProjectTaskService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.assignProjectID();
  }

  /** Camcel and close modal */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /** Confirm save and close modal */
  confirm() {
    if(this.projectTaskForm.valid) {
      this.createProjectTask();
      return this.modalCtrl.dismiss('confirm');
    }
    return this.modalCtrl.dismiss('confirm');
  }

  /** Assigns projectID to projectTaskForm */
  assignProjectID(): void {
    this.projectTaskForm.controls["projectID"].setValue(this.projectID);
  }

  /** Handles task change from input component and assigns title to projectTaskForm */
  handleTitleChange(title: string): void {
    this.projectTaskForm.controls["title"].setValue(title);
  }

  /** Handles description change from text area component and assigns description to projectTaskForm */
  handleDescriptionChange(description: string): void {
    this.projectTaskForm.controls["description"].setValue(description);
  }

  /** Handles status change from status selector component and assigns status to projectTaskForm */
  handleStatusChange(status: string): void {
    this.projectTaskForm.controls["status"].setValue(status);
  }

  /** Handles startDate change from date-selector component and assigns date value to projectTaskForm */
  handleStartDateSelection(selectedDate: string) {
    // Convert to Date object if needed
    const dateObj = new Date(selectedDate);
    this.projectTaskForm.controls['startDate'].setValue(dateObj);
  }

  /** Handles dueDate change from date-selector component and assigns date value to projectTaskForm */
  handleDueDateSelection(selectedDate: string) {
    // Convert to Date object if needed
    const dateObj = new Date(selectedDate);
    this.projectTaskForm.controls['dueDate'].setValue(dateObj);
  }

  /** Handles assign employees change from assign-employees component and assigns list of employeeIDs to projectTaskForm */
  handleEmployeeSelection(selectedEmployeeIDs: any) {
    this.projectTaskForm.controls['assignedEmployeeIDs'].setValue(selectedEmployeeIDs);
  }

  /** Create Project Task */
  createProjectTask(): void {
    const newProjectTask = new ProjectTask(
      0,
      this.projectTaskForm.controls["projectID"].value,
      this.projectTaskForm.controls["title"].value,
      this.projectTaskForm.controls["description"].value,
      this.projectTaskForm.controls["status"].value,
      this.projectTaskForm.controls["startDate"].value,
      this.projectTaskForm.controls["dueDate"].value,
      this.projectTaskForm.controls["assignedEmployeeIDs"].value
    );
    this._projectTaskService.createProjectTask(newProjectTask);
    this._projectTaskService.notifyProjectTasksChanged();
    this._toastService.presentSuccessToast("Project task created.");
  }
}
