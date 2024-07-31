import { Component, Renderer2 } from '@angular/core';
import { FilterbarComponent } from '../ui/filterbar/filterbar.component';

import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { AuthRESTService } from '@app/services/auth-rest.service';
import { PlaceholderComponent } from '../placeholder/placeholder.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule,FilterbarComponent,PlaceholderComponent,PlaceholderComponent],
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
  ){
    this.renderer.setAttribute(
      document.body,
      'class',
      'fixed sidebar-mini sidebar-collapse'
    );
  }
  viewDetail(specialist:any){
    this.global.previewRequest=specialist;
    this.global.setRoute('specialistdetail')
  }
  setHoverState(index: number, isHovering: boolean) {
    this.hoverStates[index] = isHovering;
    }

}


