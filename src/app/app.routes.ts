import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DashboardComponent } from './admin/manage-categories/dashboard/dashboard.component';
import { AddCategoryComponent } from './admin/manage-categories/add-category/add-category.component';
import { CertificatesComponent } from './admin/manage-categories/certificates/certificates.component';


export const routes: Routes = [
  { path: '', component: PortfolioComponent },
   { path: 'dashboard', component: DashboardComponent },
   { path: 'addCategory', component: AddCategoryComponent },
   { path: 'addCertificates', component: CertificatesComponent},
];
