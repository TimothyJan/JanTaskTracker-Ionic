import { Component, OnInit } from '@angular/core';
import { Department } from 'src/app/models/department.model';
import { Role } from 'src/app/models/role.model';
import { DepartmentService } from 'src/app/services/department.service';
import { RoleService } from 'src/app/services/role.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { RoleEditModalComponent } from '../../../components/modals/role-edit-modal/role-edit-modal.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
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
    IonCol,
  ]
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  departments: Department[] = [];
  editModeRoleId: number | null = null;

  constructor(
    private _departmentService: DepartmentService,
    private _roleService: RoleService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private _toastService: ToastService
  ) {
    addIcons({ ellipsisVerticalSharp });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadRoles();
  }

  loadDepartments(): void {
    this.departments = this._departmentService.getDepartments();
  }

  /** Load all roles */
  loadRoles(): void {
    this.roles = this._roleService.getRoles();
  }

  /** Get Department name from DepartmentID */
  getDepartmentName(departmentID: number): string | undefined {
    const department = this.departments.find(dep => dep.departmentID == departmentID);
    return department ? department.departmentName : undefined;
  }

  /** Action Sheet Controller */
  async presentRoleActionSheet(role: Role) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: role.roleName,
      buttons: [
        {
          text: 'Edit',
          handler: () => this.openEmployeeEditModal(role.roleID),
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.onDelete(role.roleID),
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
  async openEmployeeEditModal(roleID: number) {
    const modal = await this.modalCtrl.create({
      component: RoleEditModalComponent,
      componentProps: {
        roleID: roleID
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.loadRoles();
      // console.log(data, role);
    }
  }

  /** Delete Role */
  onDelete(roleID: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this role?');
    if (confirmDelete) {
      this._roleService.deleteRole(roleID);
      this.loadRoles();
      this._toastService.presentSuccessToast("Role deleted.");
    }
  }

}
