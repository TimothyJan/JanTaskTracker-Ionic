import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { SidemenuComponent } from "../../components/sidemenu/sidemenu.component";
import { RoleCreateComponent } from "./role-create/role-create.component";
import { RoleListComponent } from "./role-list/role-list.component";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  standalone: true,
  imports: [SidemenuComponent, IonContent, RoleCreateComponent, RoleListComponent],
})
export class RolesComponent {

  constructor() { }

}
