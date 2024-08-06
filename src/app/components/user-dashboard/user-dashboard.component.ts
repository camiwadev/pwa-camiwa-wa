import { Component, Renderer2 } from '@angular/core';
import { FilterbarComponent } from '../ui/filterbar/filterbar.component';
import PocketBase from 'pocketbase';

import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { AuthRESTService } from '@app/services/auth-rest.service';
import { PlaceholderComponent } from '../placeholder/placeholder.component';
import { SpecialistDetailComponent } from "../specialist-detail/specialist-detail.component";
import { virtualRouter } from '@app/services/virtualRouter.service';
import { PocketAuthService } from '@app/services/pocket-auth.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [SpecialistDetailComponent, CommonModule, FilterbarComponent, PlaceholderComponent, PlaceholderComponent, SpecialistDetailComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  hoverColor: string = ''; // Declaración e inicialización de la propiedad hoverColor
  placeholders = [1, 2, 3]; 
  hoverStates: boolean[] = [];
  constructor(
    private renderer: Renderer2,
    public authRest:AuthRESTService,
    public global: GlobalService,
    public pocketbaseAuth:PocketAuthService,
    public virtualRouter:virtualRouter
  ){
    this.renderer.setAttribute(
      document.body,
      'class',
      'fixed sidebar-mini sidebar-collapse'
    );

      this.global.previewRequest=this.authRest.getCurrentUser();
  }
  viewDetail(specialist:any){
    this.global.previewRequest=specialist;
    this.global.setRoute('specialistdetail')
  }
  setHoverState(index: number, isHovering: boolean) {
    this.hoverStates[index] = isHovering;
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
            this.global.previewRequest=record;
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
        localStorage.setItem("currentUser",user_string);
  
  
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
}


