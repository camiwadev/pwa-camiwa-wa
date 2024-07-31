import { Component,Renderer2 } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { virtualRouter } from '@app/services/virtualRouter.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-home.component.html',
  styleUrl: './header-home.component.css'
})
export class HeaderHomeComponent {
constructor(
  public global:GlobalService,
  public virtualRouter:virtualRouter
){}
}
