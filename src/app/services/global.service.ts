import { Injectable } from '@angular/core';
// import { Butler } from "@services/butler.service";
// import { Yeoman } from './yeoman.service';
// import { DataApiService } from './data-api-service';
// import { virtualRouter } from './virtualRouter.service';
// import { AuthRESTService } from './auth-rest.service';
// import { Catalogo } from './catalogo.service';
import { tap, count, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { virtualRouter } from './virtualRouter.service';
import { environment } from '../../environments/environment';
import PocketBase from 'pocketbase';
// import { Apollo, gql } from 'apollo-angular';
// interface Specialist {
//   id: string;
//   full_name: string;
//   specialties: { id: string; name: string }[];
//   // otros campos que se encuentran en la data...
// }
class MyClass {
  specialtyFilteredSelected: Specialty | null = null;
  specialists: Specialist[] = [];
  filteredSpecialists: Specialist[] = [];
  specialtiesFilteredSelected = false;

  // Tu constructor y otros métodos aquí...
}

interface Specialty {
  name: string;
  id: string;
  fatherId: string;
}
interface Category {
  id: string;
}

interface Specialist {
  id: string;

  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  address: string;
  advertisePlatform: boolean;
  advertiseProfile: boolean;
  advertiseServices: string[];
  availability: string;
  certificates: string[];
  city: string;
  consultationAddress: string;
  country: string;
  days: string[];
  email: string;
  friday: boolean;
  full_name: string;
  gender: string;
  graduationYear: string;
  membership: string;
  membershipPlan: string;
  monday: boolean;
  phone: string;
  profession: string;
  saturday: boolean;
  schedule: string;
  services: string;
  studyArea: string;
  sunday: boolean;
  thursday: boolean;
  tuesday: boolean;
  university: string;
  wednesday: boolean;
  documents: string[];
  status: 'pending' | 'active' | 'approved';
  images: string[];
  specialties: Specialty[];
}
interface ApiResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: any[]; // Puedes ajustar el tipo de 'items' según su estructura real
}
// const GET_EXTERNAL_PRODUCTS_WITH_DISCOUNTS = gql`
//   query GetExternalProducts($url: String!, $clcodigo: Int!, $page: Int!, $limit: Int!, $discountUrl: String!, $prolistaprecio: Int!) {
//     getExternalProducts(url: $url, clcodigo: $clcodigo, page: $page, limit: $limit, discountUrl: $discountUrl, prolistaprecio: $prolistaprecio) {
//       arcodigo
//       arnombre
//       descuentoPorcentaje
//       descuentoPromocional
//     }
//   }
// `;
@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  approvedSpecialistsCount = 0;
  // pagesArray: number[] = [];
  public urlPrev = '';
  private categoriesUrl =
    'https://db.buckapi.com:8090/api/collections/camiwaCategories/records';
  private specialtiesUrl =
    'https://db.buckapi.com:8090/api/collections/camiwaSpecialties/records';
  private travelersUrl =
    'https://db.buckapi.com:8090/api/collections/camiwaTravelers/records';

  private specialistsUrl =
    'https://db.buckapi.com:8090/api/collections/camiwaSpecialists/records';
  private productsUrl =
    'https://db.buckapi.com:8090/api/collections/frutmeProducts/records';
  private doctorsUrl = environment.apiUrl + '/api/collections/doctors/records';

  private toursUrl = 'http://localhost8070/api/collections/tours/records';

  private infoUrl = 'http://localhost8095/api/collections/info/records';
  private assetmentsUrl =
    'http://localhost8095/api/collections/assetments/records';
  aside = true;
  allLoaded = false;
  totalRequests = 0;
  modalType: string = '';
  specialtyId: string = ';';
  private pb = new PocketBase('https://db.buckapi.com:8090');
  uploaderImages: string[] = [];
  certificates: string[] = [];
  avatar: string[] = [];
  totalCategoryCounts = 0;
  categoryCounts: { [key: string]: number } = {};
  viewSelected = 'list';
  newImage: boolean = false;
  dayNames = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  daysMap = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  newUploaderImage: boolean = false;
  newUploaderAvatar: boolean = false;
  specialistRegisterStep: number = 1;
  selectedTicketsCount = 0;
  // idCategorySelected = '';
  products: any[] = [];
  workingDays: any[] = [];
  showCalendar = true;
  doctors: any[] = [];
  specialties: any[] = [];
  specialtiesFiltered: any[] = [];
  // specialtyFilteredSelected: any[] = [];
  specialtyFilteredSelected: Specialty | null = null;

  specialistsToShow: Specialist[] = [];
  totalFilteredSpecialists: number = 0; // Total de especialistas filtrados

  specialtiesFilteredSelected = false;
  categorySelected: any = false;
  categoryFilterSelected: any = false;

  categoryFiltered: any[] = [];
  // specialists: any[] = [];
  travelers: any[] = [];
  specialistsUnlimited: any[] = [];
  car: any[] = [];
  categoryPrev: { nameCategory: string; image: string; subCategory: any[] } = {
    nameCategory: 'Select one',
    image:
      'data:image/png;base64,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',
    subCategory: [],
  };
  attemptPrev: { name: string; image: string; description: any[] } = {
    name: 'Select one',
    image:
      'data:image/png;base64,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',
    description: [],
  };
  previewRequest: {
    id: string;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    saturday: boolean;
    friday: boolean;
    full_name: string;
    address: string;
    city: string;
    days: string[];
    country: string;
    email: string;
    phone: string;
    profession: string;
    studyArea: string;
    university: string;
    graduationYear: string;
    specialties: { name: string }[];
    certificates: string[];
    documents: string[];
    images: string[];
  } = {
    id: '',
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    saturday: false,
    friday: false,
    full_name: '',
    address: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    profession: '',
    studyArea: '',
    university: '',
    graduationYear: '',
    specialties: [],
    certificates: [],
    documents: [],
    days: [],

    images: [],
  };
  previewCard: {
    ticketNumber: string;
    image: string;
    ticketsQuantity: number;
    ticketPrice: number;
    description: string;
    selected: { [key: number]: boolean };
    ticketNumbers: any;
  } = {
    ticketNumber: '',
    image: '',
    ticketsQuantity: 100,
    ticketPrice: 2,
    description: '',
    selected: {
      8: true,
      4: true,
      9: true,
      48: true,
    },
    ticketNumbers: {},
  };
  filteredSpecialists: Specialist[] = [];
  filteredSpecialties: Specialty[] = [];

  specialtySelected: string = '';
  specialists: Specialist[] = [];
  idCategorySelected: string | null = null;
  filtered = false;
  mySelection: { [key: number]: boolean } = {};
  assetments: any[] = [];
  info: any[] = [];
  categories: any[] = [];
  tours: any[] = [];
  currentPage: number = 1;
  totalProducts: number = 0; // Total de productos que tu API puede devolver
  totalDoctors: number = 0; // Total de doctors que tu API puede devolver
  limit: number = 5;
  profileOption = 'attempts';
  itemsPerPage = 20;
  clients: any;
  deviceType: string = '';
  currentUser: any;
  ordersSize = 0;
  clientDetail: { clrepresentante: any }[] = [];
  intro: any = '';
  unity: any = '';
  // categorySelected:any;
  showKeyboard = false;
  comprador = false;

  productos = false;
  indicePre: any = '';
  selectedView: any = 'grid';
  view: any = true;
  constructor(
    //   private apollo: Apollo,
    //   public catalogo: Catalogo,
    //   public authRESTService: AuthRESTService,
    //   public butler: Butler,
    public http: HttpClient,
    public virtuallRouter: virtualRouter //   public yeoman: Yeoman,
  ) //   public dataApiService: DataApiService
  {
    this.specialistsToShow = this.specialists;
    this.initializeRealtime();
    this.getCategories().subscribe((response) => {
      this.categories = response.items;
      console.log('Categorías:', JSON.stringify(this.categories));
      // Inicializar el contador para cada categoría
      this.categoryCounts = {};
      this.categories.forEach((category) => {
        this.categoryCounts[category.id] = 0;
      });
      this.getSpecialties().subscribe((response) => {
        this.specialties = response;
        console.log('Especialidades:', JSON.stringify(this.specialties));
        // Contar las especialidades para cada categoría
        this.specialties.forEach((specialty) => {
          if (this.categoryCounts[specialty.fatherId] !== undefined) {
            this.categoryCounts[specialty.fatherId]++;
          }
        });

        // Mostrar los contadores por consola
        console.log(
          'Contadores de especialidades por categoría:',
          JSON.stringify(this.categoryCounts)
        );

        // Calcular el total de categoryCounts
        this.totalCategoryCounts = Object.values(this.categoryCounts).reduce(
          (sum, count) => sum + count,
          0
        );
        console.log('Total de categoryCounts:', this.totalCategoryCounts);
      });
    });

    this.getSpecialists().subscribe((response) => {
      this.specialists = response.items;
      this.specialistsUnlimited = [];
      let size = this.specialists.length;

      for (let i = 0; i < size; i++) {
        // Corrección aquí: 'i < size'
        console.log('membership ' + this.specialists[i].membership);

        if (this.specialists[i].membership === 'Unlimited Plan') {
          this.specialistsUnlimited.push(this.specialists[i]);
        }
      }
      console.log('specialists' + JSON.stringify(this.specialists));
    });
    this.getTravelers().subscribe((response) => {
      this.travelers = response.items;
      let size = this.travelers.length;

      for (let i = 0; i < size; i++) {
        // Corrección aquí: 'i < size'
        console.log('membership ' + this.travelers[i].membership);
      }
      console.log('travelers' + JSON.stringify(this.travelers));
    });

    // this.getDoctors().subscribe(
    //   response=>{
    //     this.doctors=response;
    //   }
    // );
  }
  setCategory(category: { id: string }) {
    // Si la categoría clickeada es la misma que la actualmente seleccionada, deselecciona
    if (this.idCategorySelected === category.id) {
      this.categoryFilterSelected = false;
      this.idCategorySelected = '';
    } else {
      // Selecciona la nueva categoría
      this.categoryFilterSelected = true;
      this.idCategorySelected = category.id;
    }
    // Filtra especialistas y especialidades basados en la categoría seleccionada
    this.filterSpecialistsByCategory();
    this.filterSpecialtiesByCategory();
  }

  filterSpecialistsByCategory() {
    if (this.idCategorySelected) {
      // Crear un mapa de id de especialidad a fatherId para un acceso rápido
      const specialtyToFatherIdMap = this.specialties.reduce(
        (map, specialty) => {
          map[specialty.id] = specialty.fatherId;
          return map;
        },
        {}
      );

      this.specialistsToShow = this.specialists.filter((specialist) =>
        specialist.specialties.some(
          (specialty) =>
            specialtyToFatherIdMap[specialty.id] === this.idCategorySelected
        )
      );
      this.specialtiesFilteredSelected = false;
    } else {
      this.specialtiesFilteredSelected = false;

      this.specialistsToShow = this.specialists;
    }
  }

  viewCalendar() {
    this,this.viewDetail(this.previewRequest);
    this.showCalendar = true;
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
    this.workingDays = workingDays;
    console.log(JSON.stringify(this.workingDays));

    // Actualiza la vista de detalle y la ruta
    this.previewRequest = specialist;
    this.setRoute('specialistdetail');
  }

  filterSpecialtiesByCategory() {
    if (this.idCategorySelected) {
      this.specialtiesFiltered = this.specialties.filter(
        (specialty) => specialty.fatherId === this.idCategorySelected
      );
    } else {
      this.specialtiesFiltered = this.specialties;
    }
  }

  // selectSpecialty(specialty:Specialty){
  // this.specialtiesFilteredSelected=true;
  // this.specialtyFilteredSelected=specialty;
  // }

  selectSpecialty(specialty: Specialty) {
    if (this.specialtyId === specialty.id) {
      this.specialtyId = '';
      this.specialtyFilteredSelected = null;
      this.specialtiesFilteredSelected = false;
      this.filteredSpecialists = this.specialists; // Restablece la lista
      this.totalFilteredSpecialists = this.filteredSpecialists.length; // Actualiza el total
    } else {
      this.specialtyId = specialty.id;
      this.specialtyFilteredSelected = specialty;
      this.specialtiesFilteredSelected = true;
      this.filterSpecialistsBySpecialty(specialty.id); // Aplica el filtrado
    }
    this.updateSpecialistsToShow();
  }
  onSpecialtyChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    console.log('Hola ' + selectedId);
    if (selectedId === '') {
      // Si se selecciona "Todas las especialidades", restablece el filtro
      this.specialtyId = '';
      this.specialtyFilteredSelected = null;
      this.specialtiesFilteredSelected = false;
      this.filteredSpecialists = this.specialists;
      this.totalFilteredSpecialists = this.filteredSpecialists.length;
    } else {
      // Encuentra la especialidad seleccionada
      const selectedSpecialty = this.specialtiesFiltered.find(
        (sp) => sp.id === selectedId
      );
      if (selectedSpecialty) {
        this.selectSpecialty(selectedSpecialty);
      }
    }
  }
  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.toLowerCase();
    this.filterSpecialists(searchTerm);
  }
  filterSpecialists(searchTerm: string) {
    this.filteredSpecialists = this.specialists.filter((specialist) => {
      const matchesFullName = specialist.full_name
        .toLowerCase()
        .includes(searchTerm);
      const matchesServices = specialist.services
        .toLowerCase()
        .includes(searchTerm);
      const matchesProfession = specialist.profession
        .toLowerCase()
        .includes(searchTerm);
      const matchesSpecialties = specialist.specialties.some((specialty: any) =>
        specialty.name.toLowerCase().includes(searchTerm)
      );
      return (
        matchesFullName ||
        matchesServices ||
        matchesProfession ||
        matchesSpecialties
      );
    });
    this.totalFilteredSpecialists = this.filteredSpecialists.length;
    this.specialistsToShow = this.filteredSpecialists;
  }
  updateSpecialistsToShow() {
    if (this.specialtiesFilteredSelected) {
      // Filtra especialistas por especialidad
      this.specialistsToShow = this.filteredSpecialists;
    } else {
      // Muestra todos los especialistas
      this.specialistsToShow = this.specialists;
    }
  }

  filterSpecialistsBySpecialty(specialtyId: string) {
    this.filteredSpecialists = this.specialists.filter((specialist) =>
      specialist.specialties.some((specialty) => specialty.id === specialtyId)
    );

    // Actualiza el total de especialistas encontrados
    this.totalFilteredSpecialists = this.filteredSpecialists.length;
  }

  getFilteredSpecialists(): Specialist[] {
    return this.filteredSpecialists;
  }

  unapproveSpecialist(id: string): Observable<any> {
    const data = { status: 'pending' };

    return this.http.patch<any>(`${this.specialistsUrl}/${id}`, data);
  }
  approveSpecialist(id: string): Observable<any> {
    const data = { status: 'approved' };
    return this.http.patch<any>(`${this.specialistsUrl}/${id}`, data);
  }
  private initializeRealtime() {
    // Subscribe to real-time updates
    this.pb.collection('camiwaSpecialists').subscribe('*', (e) => {
      this.updateSpecialistsList();
    });

    // Initial load of specialists
    this.updateSpecialistsList();
  }
  public updateSpecialistsList() {
    this.getSpecialists().subscribe((response) => {
      this.specialists = response.items;
      this.updateSpecialistsToShow();
      this.approvedSpecialistsCount = this.countApprovedSpecialists();
      this.specialistsUnlimited = [];
      this.totalRequests = 0;

      let size = this.specialists.length;
      for (let i = 0; i < size; i++) {
        if (this.specialists[i].membership === 'Unlimited Plan') {
          this.specialistsUnlimited.push(this.specialists[i]);
        }

        if (this.specialists[i].status === 'pending') {
          this.totalRequests++;
        }
      }
    });
  }
  countApprovedSpecialists(): number {
    return this.specialists.filter(
      (specialist) => specialist.status === 'approved'
    ).length;
  }
  public handleRealtimeUpdate(event: any) {
    const record = event.record;

    switch (event.action) {
      case 'create':
        this.specialists.push(record);
        break;
      case 'update':
        const index = this.specialists.findIndex((s) => s.id === record.id);
        if (index !== -1) {
          this.specialists[index] = record;
        }
        break;
      case 'delete':
        this.specialists = this.specialists.filter((s) => s.id !== record.id);
        break;
    }
    this.updateTotalRequests();
  }
  private updateTotalRequests() {
    this.totalRequests = this.specialists.filter(
      (s) => s.status === 'pending'
    ).length;
  }
  setView(view: string) {
    this.viewSelected = view;
  }
  setPreview(id: any, index: any) {
    this.idCategorySelected = id;
    this.getSpecialties();
    this.categorySelected = this.categories[index];
  }
  getDoctors(): Observable<any[]> {
    this.urlPrev = this.doctorsUrl;
    return this.getAllPages(this.urlPrev).pipe(
      tap((doctors) => {
        // Extraer todas las categorías encontradas
        const categories: Set<string> = new Set(); // Aquí establecemos explícitamente que el conjunto contendrá cadenas de texto

        doctors.forEach((product) => categories.add(product.cat)); // Asumiendo que 'cat' es la propiedad que contiene la categoría de cada producto

        // Ordenar las categorías alfabéticamente
        this.categories = Array.from(categories).sort((a, b) =>
          a.localeCompare(b)
        );
      })
    );
  }

  getSpecialties(): Observable<any[]> {
    this.urlPrev = this.specialtiesUrl;
    return this.getAllPages(this.urlPrev).pipe(
      tap((specialties) => {
        // Extraer todas las categorías encontradas
        const categories: Set<string> = new Set(); // Aquí establecemos explícitamente que el conjunto contendrá cadenas de texto

        specialties.forEach((product) => categories.add(product.cat)); // Asumiendo que 'cat' es la propiedad que contiene la categoría de cada producto

        // Ordenar las categorías alfabéticamente
        this.specialties = Array.from(categories).sort((a, b) =>
          a.localeCompare(b)
        );
        this.specialties = [...this.specialties];
      })
    );
  }

  setStep(step: number) {
    this.specialistRegisterStep = step;
  }
  private getAllPages(url: string, doctors: any[] = []): Observable<any[]> {
    return this.http.get<any>(url).pipe(
      switchMap((response: any) => {
        // Procesa los elementos de la página actual y los agrega al array de productos
        doctors.push(...response.items);

        // Verifica si hay más páginas
        if (response.page < response.totalPages) {
          // Si hay más páginas, realiza la solicitud recursiva para la siguiente página
          const nextPageUrl = `${this.urlPrev}?page=${response.page + 1}`;
          return this.getAllPages(nextPageUrl, doctors);
        } else {
          // Si no hay más páginas, organiza los productos por categoría y emite el array completo de productos
          const organizedDoctors = this.organizeDoctorsByCategory(doctors);
          return of(organizedDoctors);
        }
      })
    );
  }

  private organizeDoctorsByCategory(doctors: any[]): any[] {
    // Crear un objeto para almacenar productos organizados por categoría
    const organizedByCategory: { [key: string]: any[] } = {};

    // Organizar productos por categoría
    doctors.forEach((doctor) => {
      const category = doctor.cat; // Reemplaza 'category' con la propiedad real que almacena la categoría en tu objeto de producto
      if (!organizedByCategory[category]) {
        organizedByCategory[category] = [];
      }
      organizedByCategory[category].push(doctor);
    });

    // Convertir el objeto organizado nuevamente en un array
    const organizedDoctors = Object.values(organizedByCategory).flat();
    this.totalDoctors = organizedDoctors.length;
    return organizedDoctors;
  }

  getTotalAmount() {
    const selectedTicketsCount = Object.keys(this.mySelection).length;
    const ticketPrice = this.previewCard.ticketPrice;

    return selectedTicketsCount * ticketPrice;
  }

  select(i: any) {
    // Verifica si el elemento ya está presente en global.mySelection
    const isSelected = this.mySelection[i];

    // Si el elemento ya está seleccionado, lo elimina; de lo contrario, lo agrega
    if (isSelected) {
      this.selectedTicketsCount = this.selectedTicketsCount - 1;
      delete this.mySelection[i]; // Elimina el elemento si ya está seleccionado
    } else {
      this.selectedTicketsCount = this.selectedTicketsCount + 1;
      this.mySelection[i] = true; // Agrega el elemento si no está seleccionado
    }
  }
  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  // setView(view: any) {
  //   this.selectedView = view;
  // }
  // get totalPages(): number {
  //   return Math.ceil(this.totalProducts / 20);
  // }
  getCategories(): Observable<any> {
    return this.http.get<any>(this.categoriesUrl);
  }
  getSpecialists(): Observable<any> {
    return this.http.get<any>(this.specialistsUrl);
  }
  getTravelers(): Observable<any> {
    return this.http.get<any>(this.travelersUrl);
  }
  // getDoctors(): Observable<any> {
  //   return this.http.get<any>(this.productsUrl);
  // }
  getTours(): Observable<any> {
    return this.http.get<any>(this.toursUrl);
  }
  getInffo(): Observable<any> {
    return this.http.get<any>(this.infoUrl);
  }
  getAssetments(): Observable<any> {
    return this.http.get<any>(this.assetmentsUrl);
  }
  get pagesArray(): number[] {
    const totalPages = Math.ceil(this.totalProducts / this.itemsPerPage);
    return new Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  //   getExternalProducts(url: string, clcodigo: number, page: number, limit: number, discountUrl: string, prolistaprecio: number): Observable<any[]> {
  //     return this.apollo.watchQuery<any>({
  //       query: GET_EXTERNAL_PRODUCTS_WITH_DISCOUNTS,
  //       variables: { url, clcodigo, page, limit, discountUrl, prolistaprecio }
  //     })
  //     .valueChanges
  //     .pipe(map(result => result.data.getExternalProducts));
  //   }

  setPrev(item: any) {
    console.log(item);
    this.categoryPrev = item;
  }

  getOrdersByClient() {
    let clientString = localStorage.getItem('clientCard');
    if (clientString !== null) {
      let clientCard = JSON.parse(clientString);
      //   this.dataApiService.getOrdersByClient(clientCard.idUser).subscribe(response => {
      //     const tempOrders = response; this.yeoman.myOrders = tempOrders;
      //     this.yeoman.myOrders = this.yeoman.myOrders.reverse();
      //     this.classifyOrders();
      //     this.ordersSize = this.yeoman.myOrders.length;
      //   })
    }
  }
  setRoute(route: string) {
    this.virtuallRouter.routerActive = route;
  }
  classifyOrders() {
    // this.yeoman.ordersNew = [];
    // this.yeoman.ordersProcessing = [];
    // this.yeoman.ordersFinished = [];
    // for (const order of this.yeoman.myOrders) {
    //   if (order.status === 'nueva') {
    //     this.yeoman.ordersNew.push(order);
    //   } else if (order.status === 'procesando') {
    //     this.yeoman.ordersProcessing.push(order);
    //   } else if (order.status === 'terminada') {
    //     this.yeoman.ordersFinished.push(order);
    //   }
    // }
    // this.cdr.detectChanges();
  }
  //   findClient() {
  //     const idFind = this.authRESTService.getCurrentUser().id;
  //     if (idFind !== undefined) {
  //       this.dataApiService.getClientBy(idFind).subscribe((res: any) => {
  //         localStorage.setItem('clientCard', JSON.stringify(res[0]));
  //         let clientString = localStorage.getItem('clientCard');
  //         if (clientString !== null) {
  //           let clientCard = JSON.parse(clientString);
  //           if (clientCard.status == "active") {
  //             const idClient = clientCard.idUser;
  //             const idDist = clientCard.ref;
  //             this.yeoman.idClient = idClient;
  //             this.yeoman.client = clientCard;
  //             this.yeoman.clientEmail = clientCard.email;
  //             this.yeoman.idDist = idDist;
  //             this.getOrdersByClient();
  //             this.findDist2(clientCard.ref);
  //           } else {
  //             // this.router.navigate(['/unavailable']);
  //           }
  //         }
  //       });
  //     }
  //   }
  ClientFicha(): any {
    let client_string = localStorage.getItem('clientFicha');
    if (client_string) {
      let client: any = JSON.parse(client_string!);
      return client;
    } else {
      return { cldisponible: 0 };
    }
  }
  type(): string | null {
    const typeString = localStorage.getItem('type');
    if (typeString) {
      try {
        return typeString;
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        return null;
      }
    }
    return null;
  }
}
