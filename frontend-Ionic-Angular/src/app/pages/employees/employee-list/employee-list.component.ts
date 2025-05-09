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
  departmentsLoading: boolean = false;
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
    this.loadEmployees();
    this.getDepartments();
  }

  /** Load all Employees */
  loadEmployees(): void {
    this.employees = this._employeeService.getEmployees();
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

  /** Get Department name from DepartmentID */
  getDepartmentName(departmentID: number): string | undefined {
    const department = this.departments.find(dep => dep.departmentID == departmentID);
    return department ? department.departmentName : undefined;
  }

  /** Get Role name from RoleID */
  getRoleName(roleID: number): string | undefined {
    return this._roleService.getRole(roleID)?.roleName;
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
      this.loadEmployees();
      console.log(data, role);
    }
  }

  /** Deletes Employee */
  onDelete(employeeID: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this employee?');
    if (confirmDelete) {
      this._employeeService.deleteEmployee(employeeID);
      this.loadEmployees();
      this._toastService.presentSuccessToast("Employee deleted.");
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
