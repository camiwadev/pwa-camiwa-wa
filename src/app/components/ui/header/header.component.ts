import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  captionsSpecialties = {
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    remove: 'Eliminar',
    upload: 'Subir',
    // Agrega más etiquetas según necesites
};
dropdownSettings: IDropdownSettings = {
  singleSelection: false,
  idField: 'id',
  textField: 'name',
  selectAllText: 'Seleccionar todos',
  unSelectAllText: 'Deseleccionar todos',
  itemsShowLimit: 3,
  allowSearchFilter: true
};
  constructor(
    public global:GlobalService
  ){}
}
