import { Component } from '@angular/core';
import { FilterbarComponent } from '../ui/filterbar/filterbar.component';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { PlaceholderComponent } from '../placeholder/placeholder.component';
@Component({
  selector: 'app-mapwrapper',
  standalone: true,
  imports: [FilterbarComponent, CommonModule, PlaceholderComponent],
  templateUrl: './mapwrapper.component.html',
  styleUrl: './mapwrapper.component.css',
})
export class MapwrapperComponent {
  
  hoverColor: string = ''; // Declaración e inicialización de la propiedad hoverColor
  placeholders = [1, 2, 3];
  hoverStates: boolean[] = [];
  constructor(public global: GlobalService) {
    this.hoverStates = new Array(this.global.categories.length).fill(false);
  }
  setHoverState(index: number, isHovering: boolean) {
    this.hoverStates[index] = isHovering;
  }

  viewDetail(specialist: any) {
    // Mapeo de los índices a los nombres de los días de la semana
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
}
