import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private pb = new PocketBase("https://db.buckapi.com:8090");
  private chatsCollection = 'camiwaChats';

  constructor() {
    this.initializeRealtime();
  }

  // Método para enviar un mensaje
  sendMessage(conversationId: string, senderId: string, receiverId: string, message: string): Promise<any> {
    const data = {
      conversationId,
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
      status: 'sent', // Estado inicial del mensaje
    };
    return this.pb.collection(this.chatsCollection).create(data);
  }

  // Método para actualizar el estado del mensaje
  updateMessageStatus(messageId: string, status: 'delivered' | 'read'): Promise<any> {
    return this.pb.collection(this.chatsCollection).update(messageId, { status });
  }

  // Método para recibir mensajes en tiempo real
  initializeRealtime() {
    this.pb.collection(this.chatsCollection).subscribe('*', (event) => {
      console.log('Nuevo mensaje recibido:', event);

      // Cuando se recibe un mensaje nuevo, actualizar el estado a 'delivered'
      if (event.action === 'create' && event.record["status"] === 'sent') {
        this.updateMessageStatus(event.record["id"], 'delivered'); // Marcar como entregado
      }
    });
  }

  // Método para obtener mensajes de una conversación específica
  getMessages(conversationId: string): Observable<any[]> {
    return new Observable((observer) => {
      this.pb.collection(this.chatsCollection).getFullList({
        filter: `conversationId="${conversationId}"`,
        sort: 'timestamp',
      }).then((messages) => {
        observer.next(messages);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  // Método para marcar mensajes como leídos
  markMessagesAsRead(conversationId: string, receiverId: string) {
    this.getMessages(conversationId).subscribe(messages => {
      messages.forEach(message => {
        if (message["receiverId"] === receiverId && message["status"] === 'delivered') {
          this.updateMessageStatus(message["id"], 'read'); // Marcar como leído
        }
      });
    });
  }
}
