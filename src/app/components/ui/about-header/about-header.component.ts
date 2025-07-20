import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { AuthRESTService } from '@app/services/auth-rest.service';
import { PocketbaseService } from '@app/services/pocketbase.service';
import { PocketAuthService } from '@app/services/pocket-auth.service';
@Component({
  selector: 'app-about-header',
  standalone: true,
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule

  ],
  templateUrl: './about-header.component.html',
  styleUrl: './about-header.component.css'
})
export class AboutHeaderComponent {
  constructor(
    public global:GlobalService,
    public authRest:AuthRESTService,
    public pocketAuth:PocketAuthService
  ){}
}
