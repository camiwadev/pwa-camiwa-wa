import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
    public autRest:AuthRESTService,
    public http: HttpClient
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
    this.trackVisitor();
  }


trackVisitor(): void {
  const visitData: {
    country: string;
    device: string;
    browser: string;
    os: string;
    datetime: string;
    location: {
      lat: number | null;
      lng: number | null;
    };
  } = {
    country: '', // Lo obtendremos en un paso posterior
    device: this.getDeviceType(),
    browser: this.getBrowserInfo(),
    os: this.getOSInfo(),
    datetime: new Date().toISOString(),
    location: { lat: null, lng: null }
  };

  // Obtener la ubicación si es un dispositivo móvil
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      visitData.location.lat = position.coords.latitude;
      visitData.location.lng = position.coords.longitude;
      this.sendVisitData(visitData);
    }, (error) => {
      console.error('Error obteniendo la ubicación', error);
      this.sendVisitData(visitData);
    });
  } else {
    this.sendVisitData(visitData);
  }
}
getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'Mobile';
  return 'Web';
}
getBrowserInfo(): string {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  if (ua.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
  } else if (ua.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
  } else if (ua.indexOf('Safari') > -1) {
    browserName = 'Safari';
  } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) {
    browserName = 'Internet Explorer';
  }
  return browserName;
}

getOSInfo(): string {
  const ua = navigator.userAgent;
  let osName = 'Unknown';
  if (ua.indexOf('Win') > -1) {
    osName = 'Windows';
  } else if (ua.indexOf('Mac') > -1) {
    osName = 'MacOS';
  } else if (ua.indexOf('X11') > -1) {
    osName = 'UNIX';
  } else if (ua.indexOf('Linux') > -1) {
    osName = 'Linux';
  }
  return osName;
}
sendVisitData(visitData: any): void {
  // Obtener país desde una API de geolocalización por IP
  this.http.get('https://ipapi.co/json/').subscribe((response: any) => {
    visitData.country = response.country_name;
    this.http.post('https://db.buckapi.com:8090/api/collections/visits/records', visitData)
      .subscribe(response => {
        console.log('Datos de la visita enviados correctamente', response);
        if (visitData.device === 'Mobile') {
          window.location.href = 'https://m.camiwa.com';
        }
      }, error => {
        console.error('Error al enviar los datos de la visita', error);
      });
  });
}
}