import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private pb = new PocketBase(environment.apiUrl);
  // Agrega al principio del servicio:
  private authUser = this.pb.authStore.model;

  // Puedes usar este getter si quieres más limpio
  get isAuthenticated(): boolean {
    return this.pb.authStore.isValid;
  }

  isUserLoggedIn(): boolean {
    return this.pb.authStore.isValid;
  }
  

  async enviarMensaje(userId: string, message: string): Promise<string> {
    // 1. Guardar mensaje del usuario
   
    await this.pb.collection('camiwaChatBot').create({
      sessionId: userId,
      message,
      sender: 'user',
      timestamp: new Date().toISOString()
    });
    

    // 2. Procesar respuesta automática
    const respuestaBot = await this.procesarMensaje(userId, message);

    // 3. Guardar respuesta del bot
      
    await this.pb.collection('camiwaChatBot').create({
        sessionId: userId,
        message: respuestaBot,
        sender: 'bot',
        timestamp: new Date().toISOString()
      });
      

    return respuestaBot;
  }

  async obtenerMensajes(userId: string): Promise<any[]> {
    return await this.pb.collection('camiwaChatBot').getFullList({
      filter: `sessionId="${userId}"`,
      sort: '+timestamp'
    });
  }
  

  listenMensajes(userId: string, callback: (msg: any) => void) {
    this.pb.collection('camiwaChatBot').subscribe('*', event => {
      if (event.action === 'create' && event.record['sessionId'] === userId) {
        callback(event.record);
      }
    });
  }
  

  // 🧠 Procesa la lógica del bot
  private async procesarMensaje(userId: string, mensaje: string): Promise<string> {
    const msg = mensaje.toLowerCase().trim();
    console.log('Mensaje procesado:', msg);  // 👉 DEBUG
  
    if ((msg.includes('cita') || msg.includes('agendar')) && !this.isAuthenticated) {
      return 'Para agendar una cita, por favor inicia sesión o crea una cuenta.';
    }
  
    if (msg.includes('cita') || msg.includes('agendar')) {
      return this.flujoAgendarCita();
    }
  
    if (msg.includes('categoría') || msg.includes('categorias')) {
      return await this.flujoListarCategorias();
    }
    if (msg.includes('categoría') || msg.includes('categorias') || msg.includes('categorias disponibles')) {
      return await this.flujoListarCategorias();
    }
    if (msg.includes('paciente') || msg.includes('último paciente')) {
      return await this.flujoUltimoPaciente();
    }
  
    if (msg.includes('contacto') || msg.includes('profesional')) {
      return 'Puedes contactar a un profesional desde la sección de perfiles disponibles.';
    }
  
    return 'Lo siento, no entendí tu mensaje. Puedes preguntar por: **citas**, **categorías**, **pacientes** o **contacto**.';
  }
  
  

  // 🧩 Subflujos del bot

  private flujoAgendarCita(): string {
    return 'Para agendar una cita, por favor indícame el día, hora y el tipo de profesional que necesitas.';
  }

  private async flujoListarCategorias(): Promise<string> {
    const categories = await this.pb.collection('camiwaCategories').getFullList();
    if (categories.length === 0) return 'No hay categorías registradas actualmente.';
    return 'Categorías disponibles: ' + categories.map(c => c['name']).join(', ');
  }

  private async flujoUltimoPaciente(): Promise<string> {
    const specialists = await this.pb.collection('camiwaSpecialists').getFullList({
      sort: '-created',
      limit: 1
    });
    const p = specialists[0];
    return p ? `Último paciente registrado: ${p['full_name']}` : 'No hay pacientes registrados.';
  }

  async obtenerRespuesta(mensaje: string): Promise<{ texto: string, botones?: any[] }> {
    const pregunta = mensaje.toLowerCase();
  
    if (pregunta.includes('categoría') || pregunta.includes('categorias')) {
      try {
        const categorias = await this.pb.collection('camiwaCategories').getFullList({
          filter: 'active=true',
          sort: 'name',
          fields: 'name',
        });
  
        const nombres = categorias.map((cat: any) => `• ${cat.name}`).join('\n');
        return {
          texto: `Estas son las categorías activas disponibles:\n${nombres}`,
        };
      } catch (error) {
        console.error('Error cargando categorías:', error);
        return { texto: 'Lo siento, no pude obtener las categorías en este momento.' };
      }
    }
  
    if (pregunta.includes('especialidad')) {
      try {
        const especialidades = await this.pb.collection('camiwaSpecialties').getFullList({
          sort: 'name',
          fields: 'name',
        });
  
        const nombres = especialidades.map((esp: any) => `• ${esp.name}`).join('\n');
        return {
          texto: `Estas son las especialidades disponibles:\n${nombres}`,
        };
      } catch (error) {
        console.error('Error cargando especialidades:', error);
        return { texto: 'No pude obtener la lista de especialidades en este momento.' };
      }
    }
  
    if (pregunta.includes('profesional') || pregunta.includes('especialista')) {
      return {
        texto: 'Para ver a los profesionales disponibles, haz clic en el siguiente botón:',
        botones: [
          { label: 'Ver especialistas', action: 'ver-especialistas' }
        ]
      };
    }
  
    return {
      texto: 'Lo siento, no entendí tu mensaje. Puedes preguntarme por categorías, especialidades o profesionales.'
    };
  }
  
  
}
