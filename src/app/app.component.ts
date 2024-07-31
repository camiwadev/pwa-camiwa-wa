import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalService } from './services/global.service';
import { CommonModule } from '@angular/common';
import { ScriptService } from './services/script.service';
import { MapwrapperComponent } from './components/mapwrapper/mapwrapper.component';
import { HeaderComponent } from './components/ui/header/header.component';
import { HeaderHomeComponent } from './components/ui/header-home/header-home.component';
import { FooterComponent } from './components/ui/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { virtualRouter } from './services/virtualRouter.service';
import { TestComponent } from './components/test/test.component';
import { HeaderDashboardComponent } from './components/ui/header-dashboard/header-dashboard.component';
import { TravRegisterComponent } from './components/trav-register/trav-register.component';
import { TravHomeComponent } from './components/trav-home/trav-home.component';
import { TravLoginComponent } from './components/trav-login/trav-login.component';
import { SidebarDashboardComponent } from './components/ui/sidebar-dashboard/sidebar-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthRESTService } from './services/auth-rest.service';
import { CategoriesComponent } from './components/categories/categories.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { SpecialistRegisterComponent } from './components/specialist-register/specialist-register.component';
import { RequestsComponent } from './components/requests/requests.component';
import { SpecialistDetailComponent } from './components/specialist-detail/specialist-detail.component';
import { AboutComponent } from './components/about/about.component';
import { AboutHeaderComponent } from './components/ui/about-header/about-header.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactHeaderComponent } from './components/ui/contact-header/contact-header.component';
import { SpecialistsComponent } from './components/specialists/specialists.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MapwrapperComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HeaderHomeComponent,
    TestComponent,
    HeaderDashboardComponent,
    TravRegisterComponent,
    TravHomeComponent,
    TravLoginComponent,
    SidebarDashboardComponent,
    AdminDashboardComponent,
    CategoriesComponent,
    SpecialistsComponent,
    UserDashboardComponent,
    SpecialistRegisterComponent,
    RequestsComponent,
    SpecialistDetailComponent,
    AboutComponent,
    AboutHeaderComponent,
    ContactComponent,
    SpecialistDetailComponent,
  ContactHeaderComponent  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'camiwa';
  constructor(
    public global: GlobalService,
    public script: ScriptService,
    public virtualRouter: virtualRouter ,
    public autRest:AuthRESTService
 ) {
  this.script.load(
    'jquery',
    'bootstrap',
    'aos',
    'macy',
    'simple-parallax',
    'owl-carousel',
    'resizeSensor',
    'theia-sticky-sidebar',
    'waypoints',
    'counter-up',
    'fancy-ui-widget',
    'fancy-file-fileupload',
    'fancy-file-uploader',
    'fancy-file-transport',
    'ion.rangeSlider',
    'magnific-popup',
    'select2',
    'google-maps',
    'custom-script',
    'listing-map',
    'metisMenu', 
    'perfect', 
    'app', 
    'dashboard', 
    'messenger',
  )
    .then(() => {
      console.log('Todos los scripts se cargaron correctamente');
    })
    .catch(error => console.log(error));
    // this.epicFunction();
    this.global.allLoaded=true;
  }
}

