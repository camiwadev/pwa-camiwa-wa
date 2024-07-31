import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filterbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filterbar.component.html',
  styleUrl: './filterbar.component.css'
})
export class FilterbarComponent {
  constructor(
    public global: GlobalService
  ) { }

  // setSpecialty(specialty:string){
  //   console.log(specialty);
  //   this.global.specialtySelected = specialty.toString();


  //   this.global.filtered=true;
  // }
  generateRandomNumber(): number {
    return Math.floor(Math.random() * 90) + 10; // Genera un número aleatorio de dos cifras entre 10 y 99
  }
}
