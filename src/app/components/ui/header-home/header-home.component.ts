import { Component,Renderer2 } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { virtualRouter } from '@app/services/virtualRouter.service';
import { CommonModule } from '@angular/common';
import { AuthRESTService } from '@app/services/auth-rest.service';
import { PocketAuthService } from '@app/services/pocket-auth.service';
import { PocketbaseService } from '@app/services/pocketbase.service';

@Component({
  selector: 'app-header-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-home.component.html',
  styleUrl: './header-home.component.css'
})
export class HeaderHomeComponent {
constructor(
  public authRest:AuthRESTService,
  public global:GlobalService,
  public pocketAuth:PocketbaseService,
  public virtualRouter:virtualRouter
){}
}
