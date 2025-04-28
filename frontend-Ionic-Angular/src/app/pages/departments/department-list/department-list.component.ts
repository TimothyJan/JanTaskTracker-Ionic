import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department } from 'src/app/models/department.model';
import { DepartmentService } from 'src/app/services/department.service';
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
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisVerticalSharp } from 'ionicons/icons';
import { DepartmentEditModalComponent } from '../../../components/modals/department-edit-modal/department-edit-modal.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonCol
  ]
})
export class DepartmentListComponent implements OnInit {

  departments: Department[] = [];
  editModeDepartmentId: number | null = null;

  constructor(
    private _departmentService: DepartmentService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private _toastService: ToastService
  ) {
    addIcons({ ellipsisVerticalSharp });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  /** Load all Departments */
  loadDepartments(): void {
    this.departments = this._departmentService.getDepartments();
  }

  /** Enter Edit mode for editting Department list */
  enterEditMode(departmentId: number): void {
    this.editModeDepartmentId = departmentId;
  }

  /** Action Sheet Controller */
  async presentDepartmentActionSheet(department: Department) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: department.departmentName,
      buttons: [
        {
          text: 'Edit',
          handler: () => this.openDepartmentEditModal(department.departmentID),
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.onDelete(department.departmentID),
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

  /** Opens Department Edit Modal */
  async openDepartmentEditModal(departmentID: number) {
    const modal = await this.modalCtrl.create({
      component: DepartmentEditModalComponent,
      componentProps: {
        departmentID: departmentID
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.loadDepartments();
      // console.log(data, role);
    }
  }

  /** Delete Department */
  onDelete(departmentID: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this department?');
    if (confirmDelete) {
      this._departmentService.deleteDepartment(departmentID);
      this.loadDepartments();
      this._toastService.presentSuccessToast("Department deleted.");
    }
  }

}
