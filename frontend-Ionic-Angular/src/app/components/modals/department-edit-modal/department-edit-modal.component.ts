import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ModalController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonItem,
  IonTitle,
  IonToolbar,
  IonInput,
} from '@ionic/angular/standalone';
import { Department } from 'src/app/models/department.model';
import { DepartmentService } from 'src/app/services/department.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-department-edit-modal',
  templateUrl: './department-edit-modal.component.html',
  styleUrls: ['./department-edit-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonList,
    IonItem,
    IonTitle,
    IonToolbar,
    IonInput,
  ]
})
export class DepartmentEditModalComponent implements OnInit {
  @Input() departmentID: number = -1;
  originalDepartment: Department = {departmentID: -1, departmentName: ""};
  editedDepartment: Department = {departmentID: -1, departmentName: ""}; // Working copy

  constructor(
    private modalCtrl: ModalController,
    private _departmentService: DepartmentService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.getDepartment();
  }

  /** Get Employee */
  getDepartment(): void {
    const dept = this._departmentService.getDepartment(this.departmentID);
    if (!dept) {
      console.error('Department not found');
      this.modalCtrl.dismiss(null, 'error');
      return;
    }
    this.originalDepartment = {...dept};
    this.editedDepartment = {...dept};
  }

  /** Cancel and close modal */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /** Confirm save */
  confirm() {
    this.saveChanges();
    return this.modalCtrl.dismiss(this.departmentID, 'confirm');
  }

  /** Save Changes */
  saveChanges(): void {
    this._departmentService.updateDepartment(this.editedDepartment);
    this._departmentService.notifyDepartmentsChanged();
    this._toastService.presentSuccessToast("Department saved.");
  }

  /** Capitalize departmentName input */
  onDepartmentNameInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.value) {
      this.editedDepartment.departmentName = inputElement.value.toUpperCase();
    }
  }

}
