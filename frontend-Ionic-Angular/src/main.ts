import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, Route } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

const routes: Route[] = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    loadComponent: () => import('./app/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: "projects",
    loadComponent: () => import('./app/pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: "employees",
    loadComponent: () => import('./app/pages/employees/employees.component').then(m => m.EmployeesComponent)
  },
  {
    path: "roles",
    loadComponent: () => import('./app/pages/roles/roles.component').then(m => m.RolesComponent)
  },
  {
    path: "departments",
    loadComponent: () => import("./app/pages/departments/departments.component").then(m => m.DepartmentsComponent)
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
