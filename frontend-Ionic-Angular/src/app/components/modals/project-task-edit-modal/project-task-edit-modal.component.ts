import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ModalController,
  IonButton,
  IonButtons,
  IonTitle,
  IonContent,
  IonHeader,
  IonToolbar,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import { ProjectTask } from 'src/app/models/project-task.model';
import { ProjectTaskService } from 'src/app/services/project-task.service';
import { ToastService } from 'src/app/services/toast.service';
import { Employee } from 'src/app/models/employee.model';
import { StatusSelectorComponent } from "../../status-selector/status-selector.component";
import { InputComponent } from "../../input/input.component";
import { TextAreaComponent } from "../../text-area/text-area.component";
import { DateSelectorComponent } from "../../date-selector/date-selector.component";
import { AssignEmployeesComponent } from "../../assign-employees/assign-employees.component";

@Component({
  selector: 'app-project-task-edit-modal',
  templateUrl: './project-task-edit-modal.component.html',
  styleUrls: ['./project-task-edit-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonTitle,
    IonContent,
    IonHeader,
    IonToolbar,
    IonList,
    IonItem,
    StatusSelectorComponent,
    InputComponent,
    TextAreaComponent,
    DateSelectorComponent,
    AssignEmployeesComponent
]
})
export class ProjectTaskEditModalComponent implements OnInit {
  @Input() projectTaskID: number = -1;

  originalProjectTask: ProjectTask = new ProjectTask(-1, 0, "", "", "Not Started", new Date(), new Date(), []);
  editedProjectTask: ProjectTask = new ProjectTask(-1, 0, "", "", "Not Started", new Date(), new Date(), []);
  statuses: string[] = ["Not Started", "Active", "Completed"];

  startDateString: string = '';
  dueDateString: string = '';

  assignedEmployees: Employee[] = [];

  constructor(
    private modalCtrl: ModalController,
    private _projectTaskService: ProjectTaskService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.getProjectTask();
  }

  /** Get Project Task */
  getProjectTask(): void {
    const projectTask = this._projectTaskService.getProjectTaskByID(this.projectTaskID);
    if (projectTask) {
      this.originalProjectTask = {...projectTask};
      this.editedProjectTask = {...projectTask};
    }
    else {
      this._toastService.presentErrorToast("Unable to retrieve project task.");
    }
  }

  /** Cancel and close modal */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /** Confirm save and close modal */
  confirm() {
    this.saveChanges();
    return this.modalCtrl.dismiss(this.projectTaskID, 'confirm');
  }

  /** Handles title change from input component and assigns title value to editedProjectTask */
  handleTitleChange(title: any): void {
    this.editedProjectTask.title = title;
  }

  /** Handles status change from status-selector component and assigns status value to editedProjectTask */
  handleStatusChange(status: any): void  {
    this.editedProjectTask.status = status;
  }

  /** Handles description change from text-area component and assigns description value to editedProjectTask */
  handleDescriptionChange(description: any): void {
    this.editedProjectTask.description = description;
  }

  /** Handles startDate change from date-selector component and assigns startDate value to editedProjectTask */
  handleStartDateSelection(selectedDate: string) {
    // Convert to Date object if needed
    const dateObj = new Date(selectedDate);
    this.editedProjectTask.startDate = dateObj;
  }

  /** Handles dueDate change from date-selector component and assigns dueDate value to editedProjectTask */
  handleDueDateSelection(selectedDate: string) {
    // Convert to Date object if needed
    const dateObj = new Date(selectedDate);
    this.editedProjectTask.dueDate = dateObj;
  }

  /** Handles assign employees change from assign-employees component and assigns list of employeeIDs to editedProjectTaskForm */
  handleEmployeeSelection(selectedEmployeeIDs: any) {
    this.editedProjectTask.assignedEmployeeIDs = selectedEmployeeIDs;
  }

  /** Update projectTask */
  saveChanges(): void {
    this._projectTaskService.updateProjectTask(this.editedProjectTask);
    this._projectTaskService.notifyProjectTasksChanged();
    this._toastService.presentSuccessToast("Project task updated.");
  }

}
