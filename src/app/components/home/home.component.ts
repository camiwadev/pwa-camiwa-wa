import {
  Component,
  ViewEncapsulation,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { virtualRouter } from '@app/services/virtualRouter.service';
import { AuthRESTService } from '@app/services/auth-rest.service';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { FaqsComponent } from '../faqs/faqs.component';
import PocketBase from 'pocketbase';
import { ItemsService } from '@app/services/items.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FaqsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',

  encapsulation: ViewEncapsulation.Emulated,
})
export class HomeComponent implements AfterViewInit {
  private subscriptions: Subscription = new Subscription();

  constructor(
    public global: GlobalService,
    public virtualRouter: virtualRouter,
    public authRest: AuthRESTService,
    private renderer: Renderer2,
    public itemsService:ItemsService
  ) {
    if (this.authRest.isLogin()) {
      // this.virtualRouter.routerActive="dashboard";
      let type = this.authRest.getType();
      // alert('type: '+type)
      switch (type) {
        case 'admin':
          this.virtualRouter.routerActive = 'dashboard';
          break;
        case 'traveler':
          // Si el tipo de usuario es 'cliente', hacer la solicitud al API
          let id = this.authRest.getCurrentUser().id;
          this.renderer.setAttribute(
            document.body,
            'class',
            'fixed sidebar-mini sidebar-collapse'
          );
          // alert('entra')
          this.virtualRouter.routerActive = 'mapwrapper';
          this.fetchClientData(id);
          // Pasar el ID del cliente al método
          break;
        case 'specialist':
          // Si el tipo de usuario es 'cliente', hacer la solicitud al API
          this.renderer.setAttribute(
            document.body,
            'class',
            'fixed sidebar-mini sidebar-collapse'
          );
          this.virtualRouter.routerActive = 'mapwrapper';
          let id2 = this.authRest.getCurrentUser().id;
          this.fetchSpecialistData(id2); 
          
    this.itemsService.subscribeToCamiwaServices(id2);

    this.global.subscription.add(
      this.itemsService.camiwaServiceEvents$.subscribe((event) => {
        if (event) {
          this.global.camiwaServices.push(event.record); // Asegúrate de actualizar una colección iterable
        }
      })
    );// Pasar el ID del cliente al método
          break;
        default:
          this.virtualRouter.routerActive = 'mapwrapper';
          break;
      }
    }
  }
  truncateText(text: string, limit: number): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }
  fetchSpecialistData(userId: string): void {
    const pb = new PocketBase('https://db.buckapi.com:8090');
    pb.collection('camiwaSpecialists')
      .getList(1, 1, {
        filter: `userId="${userId}"`,
      })
      .then((resultList: any) => {
        if (resultList.items && resultList.items.length > 0) {
          const record = resultList.items[0];
          console.log('Datos del especialista:', JSON.stringify(record));
          localStorage.setItem('status', record.status);
          this.virtualRouter.routerActive = 'dashboard';
          let user_string = JSON.stringify(record);
          this.global.previewRequest = record;
          const daysMap = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
          ];

          // Transforma el array de booleanos en un array de nombres de días
          const workingDays = record.days
            .map((isWorking: boolean, index: number) =>
              isWorking ? daysMap[index] : null
            ) // Mapea a los días si es true
            .filter((day: string | null): day is string => day !== null); // Filtra los nulls y asegura que day es string

          // Asigna el resultado a this.global.workingDays
          this.global.workingDays = workingDays;
          console.log(JSON.stringify(this.global.workingDays));

          // Actualiza la vista de detalle y la ruta
          this.global.previewRequest = record;

          localStorage.setItem('currentUser', user_string);
        } else {
          console.error('No se encontraron registros para el usuario:', userId);
          this.virtualRouter.routerActive = 'dashboard';
        }
      })
      .catch((error) => {
        console.error('Error al obtener datos del especialista:', error);
        this.virtualRouter.routerActive = 'user-home';
      });
  }
  private handleCamiwaServiceEvent(event: any) {
    console.log('Evento de camiwaServices:', event);
    // Aquí manejas los eventos según sea necesario
  }

  private getUserIdFromGlobal(): string {
    // Devuelve el userId de this.global.previewRequest
    return this.global.previewRequest.userId;
  }
  fetchClientData(userId: string): void {
    // Crear una instancia de PocketBase
    const pb = new PocketBase('https://db.buckapi.com:8090');

    // Hacer la solicitud para obtener los datos del cliente
    pb.collection('camiwaTravelers')
      .getList(1, 1, {
        userId: userId,
      })
      .then((resultList: any) => {
        // Verificar si hay resultados
        if (resultList.items && resultList.items.length > 0) {
          const record = resultList.items[0]; // Tomar el primer registro
          console.log('Datos del cliente:', JSON.stringify(record));
          localStorage.setItem('status', record.status);
          // Redirigir al usuario al home del clienteuser
          this.virtualRouter.routerActive = 'mapwrapper';
        } else {
          console.error('No se encontraron registros para el usuario:', userId);
          // Redirigir al usuario al home
          this.virtualRouter.routerActive = 'bashboard';
        }
      })
      .catch((error) => {
        // Manejar errores de la solicitud al API aquí
        console.error('Error al obtener datos del cliente:', error);
        // Redirigir al usuario al home
        this.virtualRouter.routerActive = 'dashboard';
      });
  }
  viewDetail(specialist: any) {
    const daysMap = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const workingDays = specialist.days
      .map((isWorking: boolean, index: number) =>
        isWorking ? daysMap[index] : null
      ) // Mapea a los días si es true
      .filter((day: string | null): day is string => day !== null); // Filtra los nulls y asegura que day es string

    // Asigna el resultado a this.global.workingDays
    this.global.workingDays = workingDays;
    console.log(JSON.stringify(this.global.workingDays));

    // Actualiza la vista de detalle y la ruta
    this.global.previewRequest = specialist;

    this.global.setRoute('specialistdetail');
  }
  ngAfterViewInit() {
    new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        // when window width is >= 640px
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        // when window width is >= 768px
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        // when window width is >= 1024px
        1024: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
      },
    });
  }
}
