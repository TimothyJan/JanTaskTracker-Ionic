import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  IonSpinner
} from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
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
    IonSelectOption,
    IonSpinner
  ]
})
export class RoleEditModalComponent  implements OnInit, OnDestroy {
  @Input() roleID: number = -1;
  departments: Department[] = [];
  originalRole: Role = {roleID: -1, roleName: "", departmentID: -1};
  editedRole: Role = {roleID: -1, roleName: "", departmentID: -1}; // Working copy
  departmentsLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private modalCtrl: ModalController,
    private _departmentService: DepartmentService,
    private _roleService: RoleService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.getRole();
    this.getDepartments();
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
          this.departmentsLoading = false;
        }
      });

    // Subscribe to the department added notification
    this._departmentService.departmentsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getDepartments();  // Reload departments when a new one is added
      });
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
