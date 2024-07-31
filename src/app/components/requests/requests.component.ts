import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { virtualRouter } from '@app/services/virtualRouter.service';
import Swal from 'sweetalert2';
import { PopDetailComponent } from '../pop-detail/pop-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule,PopDetailComponent],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent {
  constructor(
    private modalService: NgbModal,
    public global:GlobalService,
    public http:HttpClient,
    public virtualRouter:virtualRouter
  ){}
  isValidImageUrl(url: string): boolean {
    // Expresión regular para verificar si la cadena es una URL de imagen válida
    const imageRegex = /\.(jpeg|jpg|gif|png|webp)$/;
  
    return typeof url === 'string' && url !== '' && imageRegex.test(url);
  }
  openModal(specialist:any) {
    this.global.modalType='request';
    this.global.previewRequest=specialist;
    const modalRef = this.modalService.open(PopDetailComponent);
    // Puedes pasar datos al modal utilizando el método 'componentInstance' del modalRef.
    // modalRef.componentInstance.data = myData;
  }
  showAlert(recordId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Realmente deseas denegar la solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, denegar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteRecord(recordId);
      }
    });
  }


  approveSpecialist(id: string) {
    this.global.approveSpecialist(id).subscribe({
      next: (response) => {
        Swal.fire(
          'Aprobado',
          'El especialista ha sido aprobado exitosamente.',
          'success'
        );
        console.log('Specialist approved:', response);
        this.global.setRoute('dashboard');

        this.global.updateSpecialistsList(); // Update the list after approval
      },
      error: (error) => {
        Swal.fire(
          'Error',
          'Ocurrió un error al aprobar el especialista.',
          'error'
        );
        console.error('Error approving specialist:', error);
      }
    });
  }
  deleteRecord(recordId: string) {
    const url = `https://db.buckapi.com:8090/api/collections/camiwaSpecialists/records/${recordId}`;
    this.http.delete(url).subscribe({
      next: (response) => {
        Swal.fire(
          'Denegado',
          'La solicitud ha sido denegada exitosamente.',
          'success'
        );
        // Aquí puedes agregar lógica adicional para actualizar la vista o realizar otras acciones
      },
      error: (error) => {
        Swal.fire(
          'Error',
          'Ocurrió un error al denegar la solicitud.',
          'error'
        );
      }
    });
  }
}
