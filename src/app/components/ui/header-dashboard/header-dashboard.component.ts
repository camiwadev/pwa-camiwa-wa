import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthRESTService } from '@app/services/auth-rest.service';
import { GlobalService } from '@app/services/global.service';
import { PocketAuthService } from '@app/services/pocket-auth.service';
import { virtualRouter } from '@app/services/virtualRouter.service';

@Component({
  selector: 'app-header-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-dashboard.component.html',
  styleUrl: './header-dashboard.component.css'
})
export class HeaderDashboardComponent {
  constructor(
    public authRest: AuthRESTService,
    public global:GlobalService,
    public virtuakrouter:virtualRouter,
    public pocketAuth:PocketAuthService
  ){
    this.authRest.getCurrentUser();
  }


}
