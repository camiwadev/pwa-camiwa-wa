import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypingService {
  private pb = new PocketBase("https://db.buckapi.com:8090");
  private typingCollection = 'camiwaTypingStatus';

  constructor() {}

  // Método para iniciar el estado de escribiendo
  startTyping(conversationId: string, userId: string): Promise<any> {
    const data = {
      conversationId,
      userId,
      typing: true,
    };
    return this.pb.collection(this.typingCollection).create(data);
  }

  // Método para detener el estado de escribiendo
  stopTyping(conversationId: string, userId: string): Promise<any> {
    const data = {
      conversationId,
      userId,
      typing: false,
    };
    return this.pb.collection(this.typingCollection).create(data);
  }

  // Método para suscribirse a cambios en el estado de escribiendo
  subscribeToTypingStatus(conversationId: string): Observable<any> {
    return new Observable((observer) => {
      this.pb.collection(this.typingCollection).subscribe('*', (event) => {
        if (event.record["conversationId"] === conversationId) { // Acceso con notación de corchetes
          observer.next(event.record);
        }
      });
    });
  }
}
