import { Component } from '@angular/core';
import { ChatbotService } from '@app/services/chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import PocketBase from 'pocketbase';
import { environment } from '../../../environments/environment';
import { virtualRouter } from '@app/services/virtualRouter.service';
@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  mensajes: any[] = [];
  nuevoMensaje = '';
  userId = '';
  public isAuthenticated = false;
  botEscribiendo = false;
  mostrarSugerencias = true;
  pb = new PocketBase(environment.apiUrl);
  botonesSugeridos: any[] = [];
  constructor(private chatbotService: ChatbotService, private virtualRouter: virtualRouter) {}
 

    async ngOnInit() {
      const pb = new PocketBase(environment.apiUrl);
    
      // 1. Verificamos si el usuario está autenticado
      const isAuthenticated = pb.authStore.isValid;
      this.userId = isAuthenticated
        ? pb.authStore.model?.['id'] || this.getAnonUserId()
        : this.getAnonUserId();
    
      // 2. Cargar mensajes existentes
      await this.cargarMensajes();
      const bienvenidaKey = 'chat_bienvenida_mostrada';
      const yaMostro = localStorage.getItem(bienvenidaKey);
      if (!yaMostro) {
        this.mensajes.push({
          message: '👋 ¡Hola! Soy tu asistente virtual. Estoy aquí para ayudarte a encontrar servicios de salud, especialistas médicos o agendar una cita. ¿Con qué deseas empezar?',
          sender: 'bot',
          timestamp: new Date().toISOString()
        });
        this.mostrarSugerencias = true;
        localStorage.setItem(bienvenidaKey, 'true');
      }
      
      // 3. Escuchar nuevos mensajes en tiempo real
      this.chatbotService.listenMensajes(this.userId, (nuevo) => {
        this.mensajes.push(nuevo);
      });
    }
    
  async cargarMensajes() {
    this.mensajes = await this.chatbotService.obtenerMensajes(this.userId);
  }
  handleBoton(action: string) {
    switch(action) {
      case 'ver-especialistas':
        this.virtualRouter.routerActive = 'mapwrapper'; // o donde muestres los especialistas
        break;
      default:
        console.warn('Acción no reconocida:', action);
    }
  }
  
  /* async enviar() {
    if (!this.nuevoMensaje || this.nuevoMensaje.trim() === '') return;
  
    const userInput = this.nuevoMensaje.trim();
  
    const nuevoMensaje = {
      sessionId: this.userId,
      message: userInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
  
    console.log('📤 Enviando mensaje:', nuevoMensaje);
  
    try {
      await this.pb.collection('camiwaChatBot').create(nuevoMensaje);
      this.mensajes.push(nuevoMensaje);
      this.nuevoMensaje = '';
      this.botEscribiendo = true;
  
      // Obtener respuesta desde el servicio
      const mensajeBot = await this.chatbotService.obtenerRespuesta(userInput);
  
      // Crear objeto válido para la colección PocketBase
      const respuestaBot = {
        sessionId: this.userId,
        message: mensajeBot.texto,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
  
      setTimeout(async () => {
        try {
          await this.pb.collection('camiwaChatBot').create(respuestaBot);
          this.mensajes.push(respuestaBot);
          this.botEscribiendo = false;
  
          // Agregar botones si existen
          this.botonesSugeridos = mensajeBot.botones ?? [];
        } catch (error) {
          console.error('❌ Error al enviar respuesta del bot:', error);
          this.botEscribiendo = false;
        }
      }, 1000);
  
    } catch (error) {
      console.error('❌ Error al crear mensaje:', error);
    }
  } */

    async enviar() {
      if (!this.nuevoMensaje || this.nuevoMensaje.trim() === '') return;
    
      const userInput = this.nuevoMensaje.trim();
      const nuevoMensaje = {
        sessionId: this.userId,
        message: userInput,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
    
      this.mensajes.push(nuevoMensaje);
      this.nuevoMensaje = '';
      this.botEscribiendo = true;
    
      // Obtener respuesta del bot (sin guardar en base de datos si no quieres)
      const respuesta = await this.chatbotService.obtenerRespuesta(userInput);
    
      const respuestaBot = {
        sessionId: this.userId,
        message: respuesta.texto,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
    
      setTimeout(() => {
        this.mensajes.push(respuestaBot);
        this.botEscribiendo = false;
        this.botonesSugeridos = respuesta.botones ?? [];
      }, 1000);
      console.log('🟨 Botones sugeridos:', this.botonesSugeridos);
    }
    
    /* usarBotonSugerido(texto: string) {
      this.nuevoMensaje = texto;
      this.enviar(); // reutiliza el flujo de envío
    } */
      usarBotonSugerido(boton: any) {
        if (typeof boton === 'string') {
          this.nuevoMensaje = boton;
          this.enviar();
          return;
        }
      
        if (boton.action) {
          this.handleBoton(boton.action);
        } else if (boton.label) {
          this.nuevoMensaje = boton.label;
          this.enviar();
        }
      }
    
  getAnonUserId(): string {
    const key = 'chat_anon_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  }

  enviarSugerencia(texto: string) {
    this.nuevoMensaje = texto;
    this.enviar();
  }
  
}

