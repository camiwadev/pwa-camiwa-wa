import { Component,ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { AuthRESTService } from '@app/services/auth-rest.service';

@Component({
  selector: 'app-sidebar-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-dashboard.component.html',
  styleUrl: './sidebar-dashboard.component.css',
  encapsulation: ViewEncapsulation.Emulated 
})
export class SidebarDashboardComponent {
  constructor(public global: GlobalService, public autRest: AuthRESTService) {}
}
