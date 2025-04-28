
import { Component } from '@angular/core';
import { OrganizerComponent } from "./components/organizer/organizer.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [OrganizerComponent],
})
export class AppComponent {
  constructor() {  }
}
