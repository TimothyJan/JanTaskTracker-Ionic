import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  IonSpinner
} from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
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
    IonSpinner
  ]
})
export class DepartmentEditModalComponent implements OnInit, OnDestroy {
  @Input() departmentID: number = -1;
  originalDepartment: Department = {departmentID: -1, departmentName: ""};
  editedDepartment: Department = {departmentID: -1, departmentName: ""}; // Working copy
  departmentLoading: boolean = false;
  departmentSaving: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private modalCtrl: ModalController,
    private _departmentService: DepartmentService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.getDepartment();
  }

  /** Get Department */
  getDepartment(): void {
    this.departmentLoading = true;
    this._departmentService.getDepartmentById(this.departmentID)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (dept) => {
          this.originalDepartment = {...dept};
          this.editedDepartment = {...dept};
          this.departmentLoading = false;
        },
        error: (error) => {
          this._toastService.presentErrorToast(error.message);
          this.departmentLoading = false;
        }
      });

    // Subscribe to the department added notification
    this._departmentService.departmentsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getDepartment();  // Reload departments when a new one is added
      });
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
    this.departmentSaving = true;
    this._departmentService.updateDepartment(this.editedDepartment)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response) => {
        this._departmentService.notifyDepartmentsChanged();
        this._toastService.presentSuccessToast("Department saved.");
        this.departmentSaving = false;
      },
      error: (error) => {
        this._toastService.presentErrorToast(error.message);
        this.departmentSaving = false;
      }
    });
  }

  /** Capitalize departmentName input */
  onDepartmentNameInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.value) {
      this.editedDepartment.departmentName = inputElement.value.toUpperCase();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
