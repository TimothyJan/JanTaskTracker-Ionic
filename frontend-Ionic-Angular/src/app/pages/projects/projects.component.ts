import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IonContent,
  IonButton,
  IonList,
  IonItem,
  ModalController,
  IonSpinner
} from '@ionic/angular/standalone';
import { SidemenuComponent } from "../../components/sidemenu/sidemenu.component";
import { CommonModule } from '@angular/common';
import { ProjectComponent } from "./project/project.component";
import { ProjectService } from 'src/app/services/project.service';
import { ProjectCreateModalComponent } from 'src/app/components/modals/project-create-modal/project-create-modal.component';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SidemenuComponent,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    ProjectComponent,
    IonSpinner
],
})

export class ProjectsComponent implements OnInit, OnDestroy {
  listOfProjectIds: number[] = [];
  listOfProjectIdsLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _projectService: ProjectService,
    private modalCtrl: ModalController,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.getListOfProjectIds();

    // Subscribe to changes in projects, specifically for deletion
    this._projectService.projectsChanged$.subscribe(() => {
      this.getListOfProjectIds();
    });
  }

  /** Get list of ProjectIds */
  getListOfProjectIds(): void {
    this.listOfProjectIdsLoading = true;
    this._projectService.getListOfProjectIds()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.listOfProjectIds = data;
          this.listOfProjectIdsLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.listOfProjectIdsLoading = false;
        }
      })
  }

  /** open Project Create Modal */
  async openProjectCreateModal() {
    const modal = await this.modalCtrl.create({
      component: ProjectCreateModalComponent,
      componentProps: {}
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // console.log(data, role);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
