import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import {
  Component,
  ViewEncapsulation,
  Renderer2,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  RendererFactory2,
  ElementRef,
} from '@angular/core';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import {
  MatDatepickerModule,
  MatCalendar,
  MatDatepicker,
} from '@angular/material/datepicker';
import { GlobalService } from '@app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import {
  CustomCalendarHeaderComponent,
  MY_DATE_FORMATS,
} from '../custom-calendar-header/custom-calendar-header.component'; // Ajusta la ruta
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthRESTService } from '@app/services/auth-rest.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PocketAuthService } from '@app/services/pocket-auth.service';
import { em } from '@fullcalendar/core/internal-common';
import { AddServiceComponent } from '../add-service/add-service.component';
@Component({
  selector: 'app-specialist-detail',
  standalone: true,
  imports: [
    AddServiceComponent,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CustomCalendarHeaderComponent,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './specialist-detail.component.html',
  styleUrls: ['./specialist-detail.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SpecialistDetailComponent implements AfterViewInit, OnDestroy {
  @ViewChild('datepicker') datepicker!: MatDatepicker<Date>;

  @ViewChild('calendar') calendar!: MatCalendar<Date>;
  @ViewChild('header')
  customCalendarHeader!: CustomCalendarHeaderComponent<Date>;
  // selectedDate: Date | null = null;
  isEditing: boolean = false;
  biografia: string = '';
  selectedDate: Date = new Date();

  isEditingCity: boolean = false;
  isEditingCountry: boolean = false;

  isEditingAddress = false;
  tempAddress = '';
  isEditingConsultationFee = false;
  // tempConsultationFee: number;
  // isHovered = { consultationFee: false };

  tempCity: string = '';
  tempCountry: string = '';

  isEditingPhone: boolean = false;
  tempPhone: string = '';
  tempEmail: string = '';

  isHovered: { [key: string]: boolean } = {};

  workingDays = ['tuesday', 'wednesday', 'thursday', 'friday'];
  private mutationObserver: MutationObserver;
  form: FormGroup;
  headerComponent = CustomCalendarHeaderComponent;

  constructor(
    public modalService: NgbModal,

    private renderer: Renderer2,
    private toastr: ToastrService,
    public global: GlobalService,
    private cdr: ChangeDetectorRef,
    public authService: AuthRESTService,
    rendererFactory: RendererFactory2,
    public pocketbase: PocketAuthService,
    private fb: FormBuilder
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.scrollToTop();

    this.mutationObserver = new MutationObserver(() =>
      this.disableNonWorkingDays()
    );

    // Inicializa el formulario
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Añade más campos si es necesario
    });
  }
  // toggleEditConsultationFee() {
  //   this.isEditingConsultationFee = !this.isEditingConsultationFee;
  //   if (!this.isEditingConsultationFee) {
  //     this.tempConsultationFee = null;  // Restablecer el valor temporal si se cancela
  //   } else {
  //     this.tempConsultationFee = this.global.previewRequest.consultationFee;  // Rellenar con el valor actual si se inicia la edición
  //   }
  // }
  openModal() {
    const modalRef = this.modalService.open(AddServiceComponent);
    // Puedes pasar datos al modal utilizando el método 'componentInstance' del modalRef.
    // modalRef.componentInstance.data = myData;
  }
  toggleEditCity() {
    this.isEditingCity = !this.isEditingCity;
    if (this.isEditingCity) {
      // Copiar valores actuales para editar
      this.tempCity = this.global.previewRequest.city;
      this.tempCountry = this.global.previewRequest.country;
    }
  } 
  saveCityAndCountry() {
    // Actualizar los valores en el servicio
    this.global.previewRequest.city = this.tempCity;
    this.global.previewRequest.country = this.tempCountry;

    // Actualizar los valores en localStorage
    const storedUserData = localStorage.getItem('currentUser');
    let currentUserData = storedUserData ? JSON.parse(storedUserData) : null;

    if (currentUserData) {
        currentUserData.city = this.tempCity;
        currentUserData.country = this.tempCountry;

        // Guardar de nuevo en localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUserData));
    }

    // Llamada al backend para actualizar los datos
    this.global.updateSpecialistDetails({
        city: this.tempCity,
        country: this.tempCountry,
    }).subscribe(
        (response) => {
            console.log('Ciudad y País guardados exitosamente:', response);
            this.isEditingCity = false;
            this.toastr.success(
                `Ciudad: <strong>${this.tempCity}</strong> <br> País: <strong>${this.tempCountry}</strong> guardados exitosamente.`,
                '',
                { enableHtml: true }
            );
        },
        (error) => {
            console.error('Error al guardar los cambios', error);
            this.toastr.error('Error al guardar los cambios', 'Error');
        }
    );
}

  saveBiografia() {
    // Aquí puedes agregar lógica para guardar la biografía
    this.isEditing = false;
    console.log('Biografía guardada:', this.biografia); // Esto es solo para verificar que la biografía se guarda correctamente
  }
  private createReservation(email: string) {
    const date = format(this.selectedDate, 'yyyy-MM-dd HH:mm:ss.SSSX', {
      locale: es,
    });
    const bookingData = {
      idUser: email,
      date: date,
      idSpecialist: 'specialistId',
      status: 'reserved',
    };

    this.authService.createBooking(bookingData).subscribe(
      (response) => {
        Swal.close(); // Cierra el mensaje de carga
        Swal.fire({
          title: 'Reserva creada exitosamente',
          text: 'Le hemos enviado a su bandeja de entrada la información de la reserva.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          // Redirige al usuario después de un registro exitoso, si es necesario
          this.global.setRoute('dashboard');
        });
      },
      (error) => {
        Swal.close(); // Cierra el mensaje de carga
        Swal.fire({
          title: 'Error',
          text: 'Error al crear la reserva',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }
  toggleEditAddress() {
    this.isEditingAddress = !this.isEditingAddress;
    if (!this.isEditingAddress) {
      this.tempAddress = '';  // Restablecer el valor temporal si se cancela
    } else {
      this.tempAddress = this.global.previewRequest.address;  // Rellenar con el valor actual si se inicia la edición
    }
  }
  

  saveAddress() {
    // Actualizar el valor en el servicio
    this.global.previewRequest.address = this.tempAddress;
  
    // Actualizar el valor en localStorage
    const storedUserData = localStorage.getItem('currentUser');
    let currentUserData = storedUserData ? JSON.parse(storedUserData) : null;
  
    if (currentUserData) {
        currentUserData.address = this.tempAddress;
  
        // Guardar de nuevo en localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUserData));
    }
  
    // Llamada al backend para actualizar los datos
    this.global.updateSpecialistDetails({
      city: this.tempCity,
      country: this.tempCountry,
      address: this.tempAddress,  // Agrega la propiedad address aquí
    } as { city: string; country: string; address?: string }).subscribe(
      (response) => {
        console.log('Dirección guardada exitosamente:', response);
        this.isEditingAddress = false;
        this.toastr.success(
          `Dirección: <strong>${this.tempAddress}</strong> guardada exitosamente.`,
          '',
          { enableHtml: true }
        );
      },
      (error) => {
        console.error('Error al guardar la dirección', error);
        this.toastr.error('Error al guardar la dirección', 'Error');
      }
    );
  }
  

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
  toggleEditPhone() {
    this.isEditingPhone = !this.isEditingPhone;
    if (this.isEditingPhone) {
      // Copiar el valor actual para editar
      this.tempPhone = this.global.previewRequest.phone;
    }
  }

  savePhone() {
    // Actualizar el valor en el servicio
    this.global.previewRequest.phone = this.tempPhone;

    // Actualizar el valor en localStorage
    const storedUserData = localStorage.getItem('currentUser');
    let currentUserData = storedUserData ? JSON.parse(storedUserData) : null;

    if (currentUserData) {
        currentUserData.phone = this.tempPhone;

        // Guardar de nuevo en localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUserData));
    }

    // Llamada al backend para actualizar los datos
    this.global.updateSpecialistDetails({
      city: this.tempCity,
      country: this.tempCountry,
      phone: this.tempPhone,  // Agrega la propiedad phone aquí
    } as { city: string; country: string; phone?: string }).subscribe(
      (response) => {
        console.log('Teléfono guardado exitosamente:', response);
        this.isEditingPhone = false;
        this.toastr.success(
          `Teléfono: <strong>${this.tempPhone}</strong> guardado exitosamente.`,
          '',
          { enableHtml: true }
        );
      },
      (error) => {
        console.error('Error al guardar los cambios', error);
        this.toastr.error('Error al guardar los cambios', 'Error');
      }
    );
    
  }

  createBooking() {
    if (this.form.invalid) {
      this.toastr.error(
        'Por favor, completa todos los campos obligatorios.',
        'Error'
      );
      return;
    }

    const email = this.form.get('email')?.value;
    const name = this.form.get('name')?.value;
    const password = this.generateRandomPassword(); // Genera la contraseña aleatoria
    const username = email.split('@')[0];

    // Muestra el mensaje de carga
    Swal.fire({
      title: `${name}, estamos procesando la información para su reserva`,
      text: `Por favor, espere...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.pocketbase
      .registerUser(email, password, 'traveler', username)
      .subscribe(
        (userResponse) => {
          // Una vez registrado, crea la reserva
          this.createReservation(email);
        },
        (error) => {
          Swal.close(); // Cierra el mensaje de carga
          this.toastr.error('Error al registrar el usuario', 'Error');
        }
      );
  }

  
  generateRandomPassword(length: number = 12): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.disableNonWorkingDays();
    this.observeCalendarChanges();
  }

  clean() {
    this.workingDays = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
  }

  ngOnDestroy() {
    this.mutationObserver.disconnect();
  }
  onMouseEnter(field: string) {
    console.log('Mouse ha entrado en el calendario');
    // Llama a la función que deseas ejecutar al pasar el mouse por encima
    this.disableNonWorkingDays();
    this.observeCalendarChanges();
    // this.isHovered[field] = true;
  }

  onMouseLeave(field: string) {
    console.log('Mouse ha salido del calendario');
    // Llama a la función que deseas ejecutar al salir el mouse
    this.disableNonWorkingDays();
    this.observeCalendarChanges();
    // this.isHovered[field] = false;
  }
  viewCalendar() {
    // this.global.showCalendar = true;
    this.disableNonWorkingDays();
    this.global.viewCalendar();
    if (this.customCalendarHeader) {
      this.customCalendarHeader.show();
      this.cdr.detectChanges();
      // Asegúrate de que esté inicializado antes de llamar a los métodos
    } else {
      console.error('customCalendarHeader no está inicializado');
    }
  }

  disableNonWorkingDays() {
    // alert('El método show() se está ejecutando.');

    const dayElements = document.querySelectorAll(
      'mat-calendar .mat-calendar-table .mat-calendar-body-cell'
    );

    Array.from(dayElements).forEach((element) => {
      const ariaLabel = element.getAttribute('aria-label');
      if (ariaLabel) {
        const date = new Date(ariaLabel);
        const dayOfWeek = date.getDay();

        if (!this.isWorkingDay(dayOfWeek)) {
          this.renderer.setAttribute(element, 'disabled', '');
          this.renderer.addClass(element, 'non-working-day');
        }
      }
    });
  }

  isWorkingDay(day: number): boolean {
    const daysMap = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return this.global.workingDays.includes(daysMap[day]);
  }

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
    this.renderer.setProperty(document.body, 'scrollTop', 0);
  }

  showAdd() {
    this.toastr.success(
      'El(la) especialista ha sido agregado(a) a tu lista de favoritos',
      'Favoritos'
    );
  }

  getFormattedDate(): string {
    return format(this.selectedDate, "eeee d 'de' MMMM 'de' yyyy", {
      locale: es,
    });
  }
  showDateSelected() {
    // Formatear la fecha en el formato deseado
    const formattedDate = format(
      this.selectedDate,
      "eeee d 'de' MMMM 'de' yyyy",
      { locale: es }
    );

    this.toastr.success(
      `Has seleccionado asistir a la cita el día: <strong>${formattedDate}</strong>`,
      'Fecha',
      { enableHtml: true } // Asegúrate de permitir HTML
    );
  }

  showRemove() {
    this.toastr.info(
      'El(la) especialista ha sido removido(a) de tu lista de favoritos',
      'Favoritos'
    );
  }

  onSelectedChange(date: Date) {
    this.selectedDate = date;
    this.showDateSelected();
    this.disableNonWorkingDays();
  }

  observeCalendarChanges() {
    const calendarBody = document.querySelector(
      'mat-calendar .mat-calendar-content'
    );
    if (calendarBody) {
      this.mutationObserver.observe(calendarBody, {
        childList: true,
        subtree: true,
      });
    }
  }
}
