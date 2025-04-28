import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { SidemenuComponent } from "../../components/sidemenu/sidemenu.component";
import { DepartmentListComponent } from "./department-list/department-list.component";
import { DepartmentCreateComponent } from "./department-create/department-create.component";

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  standalone: true,
  imports: [SidemenuComponent, IonContent, DepartmentListComponent, DepartmentCreateComponent],
})
export class DepartmentsComponent {

  constructor() { }

}
