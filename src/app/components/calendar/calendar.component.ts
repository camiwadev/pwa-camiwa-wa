import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';

import interactionPlugin from '@fullcalendar/interaction';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,CommonModule ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    editable: true,
    selectable: true,
    events: [
      { title: 'Evento 1', date: '2023-06-01' },
      { title: 'Evento 2', date: '2023-06-05' }
    ],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  handleDateClick(arg: any) {
    alert('Date clicked: ' + arg.dateStr);
  }

  handleEventClick(arg: any) {
    alert('Event clicked: ' + arg.event.title);
  }
}