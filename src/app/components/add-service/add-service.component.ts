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
import { PocketbaseService } from '@app/services/pocketbase.service';
import { AuthRESTService } from '@app/services/auth-rest.service';
import { ToastrService } from 'ngx-toastr';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { UploaderCaptions } from 'ngx-awesome-uploader';
const pb = new PocketBase('https://db.buckapi.com:8090');
import { ServicesAdapter } from '@app/services.adapter';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    SelectComponent,
    FilePickerModule,
  ],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.css',
})
export class AddServiceComponent {
  public captionsServices: UploaderCaptions = {
    dropzone: {
      title: '10 MB máx.',
      or: '.',
      browse: 'Subir imagenes del servicio',
    },
    cropper: {
      crop: 'Cortar',
      cancel: 'Cancelar',
    },
    previewCard: {
      remove: 'Borrar',
      uploadError: 'error',
    },
  };
  adapterServices = new ServicesAdapter(this.http, this.global);
  tittle: string = '';
  description: string = '';
  data = {
    name: '',
    categories: [] as any[],
  };
  selectedNivel: string = ''; // Propiedad para almacenar el nivel seleccionado
  selectedItems = [];
  constructor(
    public global: GlobalService,
    public pocketAuthService: PocketAuthService,
    public pocketRest: AuthRESTService,
    public modalService: NgbModal,
    public http: HttpClient,
    private toastr: ToastrService // Inyecta ToastrService
  ) {}
  async saveService() {
    try {
      const serviceData = {
        images: this.global.servicesImages,
        userId: this.pocketRest.getUserId(), // Obtiene el ID del usuario autenticado
        tittle: this.tittle,
        description: this.description,
      };

      const record = await this.pocketAuthService.saveService(serviceData);
      console.log('Servicio guardado exitosamente:', record);

      // Mostrar mensaje de éxito con Toastr
      this.toastr.success('El servicio ha sido guardado exitosamente.', 'Éxito');
      this.global.servicesImages= [];
      // Cerrar el modal
      this.modalService.dismissAll();

    } catch (error) {
      console.error('Error al guardar el servicio:', error);
      this.toastr.error('Ocurrió un error al guardar el servicio.', 'Error');
    }
  }

  removeImage(index: number) {
    this.global.servicesImages.splice(index, 1);
  }
}
