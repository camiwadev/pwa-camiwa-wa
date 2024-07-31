import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import PocketBase from 'pocketbase';
import { PocketAuthService } from '@app/services/pocket-auth.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { GlobalService } from '@app/services/global.service';
import { SelectComponent } from '../select/select.component';
const pb = new PocketBase('https://db.buckapi.com:8090');
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgMultiSelectDropDownModule,SelectComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  data = {
    name: "",
    categories: [] as any[],
  };
  dropdownList = [];
  category = 'Seleccione una';
  categorySeted: boolean = false;
  categoriaNombre: string = ''; // Propiedad para almacenar el nombre de la categoría
  specialtyName: string = ''; // Propiedad para almacenar el nombre de la categoría
  dropdownSettings: IDropdownSettings = {idField:""};
  selectedNivel: string = ''; // Propiedad para almacenar el nivel seleccionado
  selectedItems = [];
  constructor(
    public global: GlobalService,
    public pocketAuthService: PocketAuthService,
    public modalService: NgbModal
  ) {
    this.getCategories();
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
  getCategories() {
    this.global.getCategories().subscribe((response) => {
      this.global.categories = response.items;
      console.log("REP"+JSON.stringify(this.global.categories))
      // this.global.allcategory = response;
      // this.global.categories = this.global.categories;
    });
  }
  async saveCategoria() {
    if (this.selectedNivel === 'primer_nivel') {
      const categoriaData = {
        name: this.categoriaNombre,
        // Agrega otros campos de datos de la categoría aquí según sea necesario
      };

      try {
        await this.pocketAuthService.saveCategor(categoriaData);
        // Si necesitas realizar alguna acción después de guardar la categoría, puedes hacerlo aquí
      } catch (error) {
        console.error('Error al guardar la categoría:', error);
        // Maneja el error de acuerdo a tus necesidades
      }
    } else {
      console.error(
        'Error: Debe seleccionar "De primer nivel" para guardar una categoría.'
      );
      // Puedes manejar esta situación de acuerdo a tus necesidades, por ejemplo, mostrando un mensaje de error al usuario.
    }
  }
  async saveSpecialty() {
    if (this.selectedNivel === 'segundo_nivel') {
      const specialtyData = {
        name: this.specialtyName,
        fatherId: this.global.idCategorySelected,
        // Agrega otros campos de datos de la categoría aquí según sea necesario
      };

      try {
        await this.pocketAuthService.saveSpecialty(specialtyData);
        // Si necesitas realizar alguna acción después de guardar la categoría, puedes hacerlo aquí
      } catch (error) {
        console.error('Error al guardar la categoría:', error);
        // Maneja el error de acuerdo a tus necesidades
      }
    } else {
      console.error(
        'Error: Debe seleccionar "De primer nivel" para guardar una categoría.'
      );
      // Puedes manejar esta situación de acuerdo a tus necesidades, por ejemplo, mostrando un mensaje de error al usuario.
    }
  }
}
