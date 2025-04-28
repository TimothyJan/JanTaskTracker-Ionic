import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, readerOutline, peopleOutline, personOutline, businessOutline } from 'ionicons/icons';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class OrganizerComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home-outline' },
    { title: 'Projects', url: '/projects', icon: 'reader-outline' },
    { title: 'Employees', url: '/employees', icon: 'people-outline' },
    { title: 'Roles', url: '/roles', icon: 'person-outline' },
    { title: 'Departments', url: '/departments', icon: 'business-outline' },
  ];
  currentYear = new Date().getFullYear();

  constructor() {
    addIcons({ homeOutline, readerOutline, peopleOutline, personOutline, businessOutline });
  }

}
