import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-contact-header',
  standalone: true,
  imports: [    CommonModule,
    NgMultiSelectDropDownModule],
  templateUrl: './contact-header.component.html',
  styleUrl: './contact-header.component.css'
})
export class ContactHeaderComponent {
  constructor(
    public global:GlobalService
  ){}
}
