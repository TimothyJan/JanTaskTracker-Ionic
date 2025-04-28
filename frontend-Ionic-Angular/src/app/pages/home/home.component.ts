import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { SidemenuComponent } from "../../components/sidemenu/sidemenu.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [SidemenuComponent, IonContent]

})
export class HomeComponent {

  constructor() { }

}
