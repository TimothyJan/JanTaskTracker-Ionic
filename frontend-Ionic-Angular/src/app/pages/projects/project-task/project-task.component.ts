import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCardContent,
  IonList,
  IonItem,
  IonText,
  ActionSheetController,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisVerticalSharp } from 'ionicons/icons';
import { ProjectTask } from 'src/app/models/project-task.model';
import { ProjectTaskService } from 'src/app/services/project-task.service';
import { AssignedEmployeeListComponent } from '../../../components/assigned-employee-list/assigned-employee-list.component';
import { ProjectTaskEditModalComponent } from '../../../components/modals/project-task-edit-modal/project-task-edit-modal.component';

@Component({
  selector: 'app-project-task',
  templateUrl: './project-task.component.html',
  styleUrls: ['./project-task.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonCardContent,
    IonList,
    IonItem,
    IonText,
    AssignedEmployeeListComponent
]
})
export class ProjectTaskComponent implements OnInit {
  @Input() projectTaskID: number = 0;
  projectTask: ProjectTask = new ProjectTask(0, 0, "", "", "Not Started");

  titleInvalid: boolean = false;
  descriptionInvalid: boolean = false;

  // Temporary date strings for input bindings
  startDateString: string = '';
  dueDateString: string = '';

  constructor(
    private _projectTaskService: ProjectTaskService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) {
    addIcons({ ellipsisVerticalSharp });
  }

  ngOnInit() {
    this.getProjectTaskByID();
    this.syncDateStrings();
  }

  /** Get ProjectTask by ID */
  getProjectTaskByID(): void {
    this.projectTask = this._projectTaskService.getProjectTaskByID(this.projectTaskID);

    // Sync date strings
    this.syncDateStrings();
  }

  /** Convert Date objects to yyyy-MM-dd strings for binding */
  private syncDateStrings(): void {
    this.startDateString = this.formatDate(this.projectTask.startDate!);
    this.dueDateString = this.formatDate(this.projectTask.dueDate!);
  }

  /** Format a Date object to yyyy-MM-dd */
  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Action Sheet Controller */
  async presentProjectTaskActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.projectTask.title,
      buttons: [
        {
          text: 'Edit',
          handler: () => this.openProjectTaskEditModal(),
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.onDelete(),
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });
    await actionSheet.present();
  }

  /** Opens Employee Edit Modal */
  async openProjectTaskEditModal() {
    const modal = await this.modalCtrl.create({
      component: ProjectTaskEditModalComponent,
      componentProps: {
        projectTaskID: this.projectTaskID
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.getProjectTaskByID();
      // console.log(data, role);
    }
  }

  /** Delete ProjectTask */
  onDelete(): void {
    const confirmDelete = confirm('Are you sure you want to delete this projectTask?');
    if (confirmDelete) {
      this._projectTaskService.deleteProjectTask(this.projectTaskID);
    }
  }
}
