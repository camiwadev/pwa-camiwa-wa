import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
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
    public global:GlobalService
  ){}
}
