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
      await this.pb.collection('users').authWithPassword('admin@email.com', 'admin1234');
      this.pb.collection('camiwaServices').subscribe('*', (e) => {
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

  // Método para editar un item
  async editItem(itemId: string, updatedData: any) {
    try {
      const updatedItem = await this.pb.collection('camiwaServices').update(itemId, updatedData);
      console.log('Item actualizado:', updatedItem);
      return updatedItem;
    } catch (error) {
      console.error('Error al actualizar el item:', error);
      throw error;
    }
  }

  // Método para eliminar un item
  async deleteItem(itemId: string) {
    try {
      await this.pb.collection('camiwaServices').delete(itemId);
      console.log('Item eliminado:', itemId);
    } catch (error) {
      console.error('Error al eliminar el item:', error);
      throw error;
    }
  }
}
