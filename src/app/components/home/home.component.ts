import { Component ,ViewEncapsulation,AfterViewInit} from '@angular/core';
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
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FaqsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',

  encapsulation: ViewEncapsulation.Emulated 
})
export class HomeComponent implements AfterViewInit {
constructor(
  public global:GlobalService,
  public virtualRouter:virtualRouter,
  public authRest:AuthRESTService,
){
  if(this.authRest.isLogin()){
    // this.virtualRouter.routerActive="dashboard";
    this.global.setRoute("dashboard")
    
  }
}
viewDetail(specialist:any){
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
  
  this.global.setRoute('specialistdetail')
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
