import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ModalController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonTitle,
  IonToolbar,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Department } from 'src/app/models/department.model';
import { Role } from 'src/app/models/role.model';
import { DepartmentService } from 'src/app/services/department.service';
import { RoleService } from 'src/app/services/role.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-role-edit-modal',
  templateUrl: './role-edit-modal.component.html',
  styleUrls: ['./role-edit-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonTitle,
    IonToolbar,
    IonInput,
    IonSelect,
    IonSelectOption
  ]
})
export class RoleEditModalComponent  implements OnInit {
  @Input() roleID: number = -1;
  departments: Department[] = [];
  originalRole: Role = {roleID: -1, roleName: "", departmentID: -1};
  editedRole: Role = {roleID: -1, roleName: "", departmentID: -1}; // Working copy

  constructor(
    private modalCtrl: ModalController,
    private _departmentService: DepartmentService,
    private _roleService: RoleService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.getRole();
    this.departments = this._departmentService.getDepartments();
  }

  /** Get Employee */
  getRole(): void {
    const role = this._roleService.getRole(this.roleID);
    if (!role) {
      console.error('Role not found');
      this.modalCtrl.dismiss(null, 'error');
      return;
    }
    this.originalRole = {...role};
    this.editedRole = {...role};
  }

  /** Camcel and close modal */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /** Confirm save and close modal */
  confirm() {
    this.saveChanges();
    return this.modalCtrl.dismiss(this.roleID, 'confirm');
  }

  /** Save Changes */
  saveChanges(): void {
    this._roleService.updateRole(this.editedRole);
    this._roleService.notifyRolesChanged();
    this._toastService.presentSuccessToast("Role saved.");
  }

  /** Capitalize roleName input */
  onRoleNameInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.value) {
      this.editedRole.roleName = inputElement.value.toUpperCase();
    }
  }

}
