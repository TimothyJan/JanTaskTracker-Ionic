import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from 'src/app/models/employee.model';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { RoleService } from 'src/app/services/role.service';
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
import { EmployeeEditModalComponent } from '../../../components/modals/employee-edit-modal/employee-edit-modal.component';
import { ToastService } from 'src/app/services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { Department } from 'src/app/models/department.model';
import { Role } from 'src/app/models/role.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
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
export class EmployeeListComponent implements OnInit, OnDestroy {

  employees: Employee[] = [];
  departments: Department[] = [];
  roles: Role[] = [];
  employeesLoading: boolean = false;
  departmentsLoading: boolean = false;
  rolesLoading: boolean = false;
  roleNameLoading: boolean = false;
  deleteEmployeeLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _employeeService: EmployeeService,
    private _departmentService: DepartmentService,
    private _roleService: RoleService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private _toastService: ToastService
  ) {
    addIcons({ ellipsisVerticalSharp });
  }

  ngOnInit(): void {
    this.getEmployees();
    this.getDepartments();
    this.getRoles();
  }

  /** Get all Employees */
  getEmployees(): void {
    this.employeesLoading = true;
    this._employeeService.getEmployees()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (employees) => {
          this.employees = employees;
          this.employeesLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.employeesLoading = false;
        }
      });

      this._employeeService.employeesChanged$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.getEmployees();
        });
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

  /** Get Department name from DepartmentID */
  getDepartmentName(departmentID: number): string | undefined {
    const department = this.departments.find(dep => dep.departmentID == departmentID);
    return department ? department.departmentName : undefined;
  }

  /* Get all Roles */
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
      })
  }

  /** Get Role name from RoleID */
  getRoleName(roleID: number) {
    const role = this.roles.find(role => role.roleID == roleID);
    return role? role.roleName : undefined;
  }

  /** Action Sheet Controller */
  async presentEmployeeActionSheet(employee: Employee) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: employee.name,
      buttons: [
        {
          text: 'Edit',
          handler: () => this.openEmployeeEditModal(employee.employeeID),
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.onDelete(employee.employeeID),
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
  async openEmployeeEditModal(employeeID: number) {
    const modal = await this.modalCtrl.create({
      component: EmployeeEditModalComponent,
      componentProps: {
        employeeID: employeeID
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.getEmployees();
      console.log(data, role);
    }
  }

  /** Deletes Employee */
  onDelete(employeeID: number): void {
    this.deleteEmployeeLoading = true;
    const confirmDelete = confirm('Are you sure you want to delete this employee?');
    if (confirmDelete) {
      this._employeeService.deleteEmployee(employeeID)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            this._employeeService.notifyEmployeesChanged();
            this._toastService.presentSuccessToast("Employee deleted");
            this.deleteEmployeeLoading = false;
          },
          error: (error) => {
            this._toastService.presentErrorToast(error.message);
            this.deleteEmployeeLoading = false;
          }
        })

      this.getEmployees();
      this._toastService.presentSuccessToast("Employee deleted.");
    }
    else {
      this.deleteEmployeeLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
