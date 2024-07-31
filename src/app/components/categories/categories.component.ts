import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';
import { GlobalService } from '@app/services/global.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ModalComponent,CommonModule,NgMultiSelectDropDownModule,FormsModule,SelectComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
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
  private modalService: NgbModal,
  public global:GlobalService
){
  this.dropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Seleccionar todo",
    unSelectAllText: "Deseleccionar todo",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
}

openModal() {
  const modalRef = this.modalService.open(ModalComponent);
  // Puedes pasar datos al modal utilizando el método 'componentInstance' del modalRef.
  // modalRef.componentInstance.data = myData;
}
}
