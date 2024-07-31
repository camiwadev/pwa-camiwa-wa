import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(
    public global:GlobalService
  ){}
}
