import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalService } from '@app/services/global.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule,NgMultiSelectDropDownModule,FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {
  idSelected=";"
  data = {
    name: "",
    categories: [] as any[],
  };
  dropdownList = [];
  category = 'Seleccione una';
  categorySeted: boolean = false;
  categoriaNombre: string = ''; // Propiedad para almacenar el nombre de la categoría
  dropdownSettings: IDropdownSettings = {idField:""};
  selectedNivel: string = ''; // Propiedad para almacenar el nivel seleccionado
  selectedItems = [];

constructor(
  public global:GlobalService
){
  this.dropdownSettings = {
    singleSelection: true,
    idField: "id",
    textField: "name",
    searchPlaceholderText:"Buscar",
    selectAllText: "Seleccionar todo",
    unSelectAllText: "Deseleccionar todo",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
}
onItemSelect(){
  this.global.idCategorySelected=this.data.categories[0].id;
}
}
