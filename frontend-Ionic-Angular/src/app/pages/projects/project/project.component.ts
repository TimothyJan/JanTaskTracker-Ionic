import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  ActionSheetController,
  ModalController,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisVerticalSharp } from 'ionicons/icons';
import { Project } from 'src/app/models/project.model';
import { ProjectTaskService } from 'src/app/services/project-task.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectTaskComponent } from "../project-task/project-task.component";
import { CommonModule } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { ProjectEditModalComponent } from 'src/app/components/modals/project-edit-modal/project-edit-modal.component';
import { ProjectTaskCreateModalComponent } from 'src/app/components/modals/project-task-create-modal/project-task-create-modal.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    ProjectTaskComponent,
    IonSpinner
]
})

export class ProjectComponent implements OnInit, OnDestroy {
  @Input() projectId: number = 0;
  project : Project = new Project(0, "", "", "Not Started", new Date(), new Date());
  listOfProjectTaskIds: number[] = [];

  projectNameInvalid: boolean = false;
  descriptionInvalid: boolean = false;

  startDateString: string = '';
  dueDateString: string = '';

  projectLoading: boolean = false;
  listOfProjectTaskIdsLoading: boolean = false;
  deleteProjectLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _projectService: ProjectService,
    private _projectTaskService: ProjectTaskService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private _toastService: ToastService
  ) {
    addIcons({ ellipsisVerticalSharp });
  }

  ngOnInit() {
    this.getProjectById();
    this.getListOfProjectTaskIdsByProjectId();

    // Subscription for project changes
    this._projectService.projectsChanged$.subscribe(() => {
      this.getProjectById();
    });

    // Subscription for project task list changes
    this._projectTaskService.projectTasksChanged$.subscribe(() => {
      this.getListOfProjectTaskIdsByProjectId();
    });
  }

  /** Get Project by Id */
  getProjectById(): void {
    this.projectLoading = true;
    this._projectService.getProjectById(this.projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.project = data;
          this.projectLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.projectLoading = false;
        }
      })
  }

  /** Get list of ProjectTaskIds by ProjectId */
  getListOfProjectTaskIdsByProjectId(): void {
    this.listOfProjectTaskIdsLoading = true;
    this._projectTaskService.getListOfProjectTaskIdsByProjectId(this.projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.listOfProjectTaskIds = data;
          this.listOfProjectTaskIdsLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.listOfProjectTaskIds = [];
          this.listOfProjectTaskIdsLoading = false;
        }
      })
  }

  /** Opens Action Sheet for Project */
  async presentProjectActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.project.projectName,
      buttons: [
        {
          text: 'Edit Project',
          handler: () => this.openProjectEditModal(),
        },
        {
          text: 'Add Project Task',
          handler: () => this.openProjectTaskCreateModal(),
        },
        {
          text: 'Delete Project',
          role: 'destructive',
          handler: () => this.onDelete(this.project.projectId),
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

  /** Opens Project Task Create Modal */
  async openProjectTaskCreateModal() {
    const modal = await this.modalCtrl.create({
      component: ProjectTaskCreateModalComponent,
      componentProps: {
        projectId: this.projectId
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // console.log(data, role);
    }
  }

  /** Opens Project Edit Edit Modal */
  async openProjectEditModal() {
    const modal = await this.modalCtrl.create({
      component: ProjectEditModalComponent,
      componentProps: {
        projectId: this.projectId
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // console.log(data, role);
    }
  }

  onDelete(projectId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this project?');
    if (confirmDelete) {
      this.deleteProjectLoading = true;
      this._projectService.deleteProject(projectId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            this._projectService.notifyProjectsChanged();
            this._toastService.presentSuccessToast("Department deleted.");
            this.deleteProjectLoading = false;

            // Remove this component from the DOM
            const element = document.querySelector(`[projectid="${this.projectId}"]`);
            if (element) {
              element.remove();
            }
          },
          error: (error) => {
            this._toastService.presentErrorToast(error.message);
            this.deleteProjectLoading = false;
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
