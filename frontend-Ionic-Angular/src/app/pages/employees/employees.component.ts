import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { SidemenuComponent } from "../../components/sidemenu/sidemenu.component";
import { EmployeeCreateComponent } from "./employee-create/employee-create.component";
import { EmployeeListComponent } from "./employee-list/employee-list.component";

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  standalone: true,
  imports: [SidemenuComponent, IonContent, EmployeeCreateComponent, EmployeeListComponent],
})
export class EmployeesComponent{

  constructor() { }

}
