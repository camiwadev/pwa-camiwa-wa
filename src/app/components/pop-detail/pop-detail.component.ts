import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pop-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-detail.component.html',
  styleUrl: './pop-detail.component.css'
})
export class PopDetailComponent {
constructor(public global:GlobalService){}
imageSelected=false;
img=";"
setimage(image:any){
  this.img=image;
  this.imageSelected=true;
}
unselectImg(){
  this.imageSelected=false;
}
unapproveSpecialist(id: string) {
  this.global.unapproveSpecialist(id).subscribe({
    next: (response) => {
      Swal.fire(
        'Inhabilitado',
        'El especialista ha sido inhabilitado exitosamente.',
        'success'
      );
      console.log('Specialist unapproved:', response);
      this.global.modalType='request';
      this.global.setRoute('dashboard');

      this.global.updateSpecialistsList(); // Update the list after unapproval
    },
    error: (error) => {
      Swal.fire(
        'Error',
        'Ocurrió un error al inhabilitar el especialista.',
        'error'
      );
      console.error('Error unapproving specialist:', error);
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
      this.global.modalType='view';

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
}
