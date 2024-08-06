import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { UploaderCaptions } from 'ngx-awesome-uploader';
import { DemoFilePickerAdapter } from '@app/file-picker.adapter';
import { CertificatesAdapter } from '@app/certificates.adapter';
import { AvatarAdapter } from '@app/avatar.adapter';
import { GlobalService } from '@app/services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { PocketAuthService } from '@app/services/pocket-auth.service';
import { CommonModule } from '@angular/common';
import { virtualRouter } from '@app/services/virtualRouter.service';
import Swal from 'sweetalert2';
import { Toast, ToastrService } from 'ngx-toastr';
type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
interface FormData {
   userId: '',
  images: string[];
  documents: string[];
  avatar: string[];
  certificates: string[];
  full_name: string;
  email: string;
  phone: string;
  address: string;
  consultationAddress: string;
  city: string;
  country: string;
  gender: string;
  profession: string;
  studyArea: string;
  university: string;
  graduationYear: string;
  specialties: any[];
  category: string;
  services: string;
  availability: string;
  days: boolean[];
  membershipPlan: string;
  advertiseServices: any[];
  schedule: string;
  status: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  membership: string;
  advertiseProfile: boolean;
  advertisePlatform: boolean;
}
@Component({
  selector: 'app-specialist-register',
  standalone: true,
  imports: [
    CommonModule,
    FilePickerModule,
    FormsModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './specialist-register.component.html',
  styleUrl: './specialist-register.component.css',
  encapsulation: ViewEncapsulation.Emulated,
})
export class SpecialistRegisterComponent {
  captionsSpecialties = {
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    remove: 'Eliminar',
    upload: 'Subir',
  };

  formData: FormData = {
    userId: '',
    images: [],
    documents: [],
    avatar: [],
    certificates: [],
    full_name: '',
    email: '',
    phone: '',
    address: '',
    consultationAddress: '',
    city: '',
    country: '',
    gender: '',
    profession: '',
    studyArea: '',
    university: '',
    graduationYear: '',
    specialties: [],
    category: '',
    services: '',
    availability: '',
    monday: true,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    days: Array(7).fill(true),
    membershipPlan: '',
    advertiseServices: [],
    schedule: '',
    status: '',
    membership: 'Unlimited Plan',
    advertiseProfile: true,
    advertisePlatform: false,
  };

  public captions: UploaderCaptions = {
    dropzone: {
      title: '10 MB máx.',
      or: '.',
      browse: 'Subir documento',
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
  public captionsCertificates: UploaderCaptions = {
    dropzone: {
      title: '10 MB máx.',
      or: '.',
      browse: 'Subir certificado',
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
  public captionsAvatar: UploaderCaptions = {
    dropzone: {
      title: 'Foto de perfil.',
      or: '.',
      browse: 'Subir Fotografía',
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
  adapter = new DemoFilePickerAdapter(this.http, this.global);
  adapterCertificates = new CertificatesAdapter(this.http, this.global);
  adapterAvatar = new AvatarAdapter(this.http, this.global);
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Seleccionar todos',
    unSelectAllText: 'Deseleccionar todos',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  specialties = [
    { id: 1, name: 'Cardiología' },
    { id: 2, name: 'Dermatología' },
    { id: 3, name: 'Endocrinología' },
    { id: 4, name: 'Gastroenterología' },
    { id: 5, name: 'Neurología' },
  ];
  constructor(
    private formBuilder: FormBuilder,
    public global: GlobalService,
    public pocketAuthService: PocketAuthService,
    public http: HttpClient,
    public virtualRouter: virtualRouter,
    private renderer: Renderer2,
  private toastr: ToastrService
  ) {}

  onCheckboxChange(day: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formData.days[day] = input.checked;
    console.log(`${day} is now ${input.checked ? 'checked' : 'unchecked'}`);
  }

  onCategoryChange(selectedCategory: any): void {
    if (selectedCategory) {
      console.log('seleecionada: ' + JSON.stringify(selectedCategory));
      this.global.categorySelected = true;
      let idCategorySelected = selectedCategory[0].id;
      this.global.specialtiesFiltered = [];
      for (let specialty of this.global.specialties) {
        console.log(
          'comparando [' + idCategorySelected + '] con [' + specialty.fatherId
        );
        if (idCategorySelected === specialty.fatherId) {
          console.log(
            'Especialidad agregada al array: ' + JSON.stringify(specialty)
          );
          this.global.specialtiesFiltered.push(specialty);
        }
      }
    } else {
      this.global.categorySelected = false;
    }
  }


  onSubmit() {
    const email = this.formData.email;
    const name = this.formData.full_name;
    const password = this.global.generateRandomPassword(); // Genera la contraseña aleatoria
    const username = email.split('@')[0];
    this.global.pin=password;
    Swal.fire({
      title: `${name}, estamos procesando la información para su registro`,
      text: `Por favor, espere...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.pocketAuthService.onlyRegisterUser(email, password, 'specialist', username).subscribe(
      (user) => {
        this.formData.userId = user.id;
        const url = 'https://db.buckapi.com:8090/api/collections/camiwaSpecialists/records';
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        this.formData.documents = this.global.uploaderImages;
        this.formData.certificates = this.global.certificates;
        this.formData.images = this.global.avatar;
        this.formData.status = 'new';
        this.http.post(url, this.formData, { headers }).subscribe(
          (data) => {
            Swal.close(); // Cierra el mensaje de carga
            setTimeout(() => {
              Swal.fire({
                title: 'Registro exitoso',
                text: `El registro del especialista se ha completado con éxito. Su contraseña es: ${password}`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
            }, 500);
            let type = 'specialist';
            // this.pocketAuthService.setUser(data);
            localStorage.setItem('isLoggedin', 'true');
            localStorage.setItem('type', type);
            this.global.setStep(2);
            switch (type) {
              case 'admin':
                this.virtualRouter.routerActive = 'admin-home';
                break;
              case 'specialist':
                this.renderer.setAttribute(
                  document.body,
                  'class',
                  'fixed sidebar-mini sidebar-collapse'
                );
                this.virtualRouter.routerActive = 'new';
                break;
              case 'visit':
                this.virtualRouter.routerActive = 'dashboard';
                break;
              default:
                console.error('Tipo de usuario no reconocido');
            }
            this.global.setRoute('dashboard');
          },
          (error) => {
            Swal.close(); // Cierra el mensaje de carga
            this.toastr.error('Error al enviar los datos', 'Error');
            console.error('Error al enviar los datos:', error);
          }
        );
      },
      (error) => {
        Swal.close(); // Cierra el mensaje de carga
        this.toastr.error('Error al registrar el usuario', 'Error');
        console.error('Error al crear el usuario:', error);
      }
    );
  }
  
 
  ngOnInit(): void {
    this.loadExternalScripts([
      'assets/specilist-register/js/jquery-3.3.1.min.js',
      'assets/specilist-register/js/main.js',
      'assets/specilist-register/js/jquery.validate.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js',
      'assets/specilist-register/js/bootstrap.min.js',
      'assets/specilist-register/js/conditionize.flexible.jquery.min.js',
      'assets/specilist-register/js/switch.js',
    ]);
  }
  loadExternalScripts(urls: string[]) {
    urls.forEach((url) => {
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      this.renderer.appendChild(document.body, script);
    });
  }
}
