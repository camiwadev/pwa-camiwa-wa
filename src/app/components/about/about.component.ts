import { Component } from '@angular/core';
import { ContactComponent } from "../contact/contact.component";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ContactComponent,ContactComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
