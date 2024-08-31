import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private pb: PocketBase;
  private camiwaServiceEvents = new BehaviorSubject<any>(null);

  camiwaServiceEvents$ = this.camiwaServiceEvents.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8090');
  }

  async subscribeToCamiwaServices(userId: string) {
    try {
      // (Opcional) Autenticación
      await this.pb.collection('users').authWithPassword('admin@email.com', 'admin1234');

      // Suscribirse a todos los cambios en la colección 'camiwaServices'
      this.pb.collection('camiwaServices').subscribe('*', (e) => {
        // Filtrar eventos por userId usando notación de índice
        if (e.record['userId'] === userId) {
          this.handleCamiwaServiceEvent(e);
        }
      });
    } catch (error) {
      console.error('Error al suscribirse a camiwaServices:', error);
    }
  }

  private handleCamiwaServiceEvent(event: any) {
    console.log('Evento recibido:', event);
    this.camiwaServiceEvents.next(event);
  }

  unsubscribeFromCamiwaServices() {
    this.pb.collection('camiwaServices').unsubscribe('*');
  }
}
