import { Component, OnDestroy, OnInit } from '@angular/core';
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
  ModalController,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisVerticalSharp } from 'ionicons/icons';
import { RoleEditModalComponent } from '../../../components/modals/role-edit-modal/role-edit-modal.component';
import { ToastService } from 'src/app/services/toast.service';
import { Subject, takeUntil } from 'rxjs';

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
    IonSpinner
  ]
})
export class RoleListComponent implements OnInit, OnDestroy {
  roles: Role[] = [];
  departments: Department[] = [];
  editModeRoleId: number | null = null;
  departmentsLoading: boolean = false;
  rolesLoading: boolean = false;
  deleteRoleLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

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
    this.getDepartments();
    this.getRoles();
  }

  /** Get all departments */
  getDepartments(): void {
    this.departmentsLoading = true;
    this._departmentService.getDepartments()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.departments = data;
          this.departmentsLoading = false;
        },
        error: (error) => {
          console.log(error.message);
          this._toastService.presentErrorToast(error.message);
          this.departmentsLoading = false;
        }
      });

    this._departmentService.departmentsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getDepartments();
      });
  }

  /** Get all roles */
  getRoles(): void {
    this.rolesLoading = true;
    this._roleService.getRoles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (roles) => {
          this.roles = roles;
          this.rolesLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.rolesLoading = false;
        }
      });

    this._roleService.rolesChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getRoles();
      });
  }

  /** Get Department name from DepartmentId */
  getDepartmentName(departmentId: number): string | undefined {
    const department = this.departments.find(dep => dep.departmentId == departmentId);
    return department ? department.departmentName : undefined;
  }

  /** Action Sheet Controller */
  async presentRoleActionSheet(role: Role) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: role.roleName,
      buttons: [
        {
          text: 'Edit',
          handler: () => this.openEmployeeEditModal(role.roleId),
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.onDelete(role.roleId),
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
  async openEmployeeEditModal(roleId: number) {
    const modal = await this.modalCtrl.create({
      component: RoleEditModalComponent,
      componentProps: {
        roleId: roleId
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.getRoles();
      // console.log(data, role);
    }
  }

  /** Delete Role */
  onDelete(roleId: number): void {
    this.deleteRoleLoading = true;
    const confirmDelete = confirm('Are you sure you want to delete this role?');
    if (confirmDelete) {
      this._roleService.deleteRole(roleId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            this._roleService.notifyRolesChanged();
            this._toastService.presentSuccessToast("Role deleted.");
            this.deleteRoleLoading = false;
          },
          error: (error) => {
            this._toastService.presentErrorToast(error.message);
            this.deleteRoleLoading = false;
          }
        });
      this._toastService.presentSuccessToast("Role deleted.");
    }
    else {
      this.deleteRoleLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
