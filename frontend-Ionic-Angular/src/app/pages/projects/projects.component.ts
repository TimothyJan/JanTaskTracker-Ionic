import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonButton,
  IonList,
  IonItem,
  ModalController
} from '@ionic/angular/standalone';
import { SidemenuComponent } from "../../components/sidemenu/sidemenu.component";
import { CommonModule } from '@angular/common';
import { ProjectComponent } from "./project/project.component";
import { ProjectService } from 'src/app/services/project.service';
import { ProjectCreateModalComponent } from 'src/app/components/modals/project-create-modal/project-create-modal.component';

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
    ProjectComponent
],
})

export class ProjectsComponent implements OnInit {
  listOfProjectIDs: number[] = [];

  constructor(
    private _projectService: ProjectService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getListOfProjectIDs();

    // Subscribe to changes in projects, specifically for deletion
    this._projectService.projectsChanged$.subscribe(() => {
      this.getListOfProjectIDs();
    });
  }

  /** Get list of ProjectIDs */
  getListOfProjectIDs(): void {
    this.listOfProjectIDs = this._projectService.getListOfProjectIDs();
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

}
