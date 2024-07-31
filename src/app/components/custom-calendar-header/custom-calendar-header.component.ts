import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatCalendar, MatCalendarHeader, MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { GlobalService } from '@app/services/global.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-custom-calendar-header',
  standalone: true,
  styleUrl: './custom-calendar-header.component.css',
  imports: [CommonModule, MatIconModule,MatDatepickerModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  template: `
  <div class="mat-calendar-header" 
  
   
  >
    <button mat-icon-button class="mat-calendar-previous-button btn-perfil"  (click)="previousClicked()">
      <mat-icon>chevron_left</mat-icon>
    </button>
    <div class="mat-calendar-period-button"  (mouseenter)="previousClicked()"
    (mouseleave)="nextClicked()">
      <button mat-button disabled class="otra">
        {{ activeDateAsDate | date: 'MMMM y' }}
      </button>
    </div>
    <button mat-icon-button class="mat-calendar-next-button btn-perfil" (click)="nextClicked()">
      <mat-icon>chevron_right</mat-icon>
    </button>
  </div>
  `,
  styles: [`
  .mat-calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .mat-calendar-period-button button {
    pointer-events: none;
  }
  `]
})
export class CustomCalendarHeaderComponent<D> extends MatCalendarHeader<D> {
  constructor(
    private _customIntl: MatDatepickerIntl,
    private _customCalendar: MatCalendar<D>,
    private _customDateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _customDateFormats: MatDateFormats,
    private _customChangeDetectorRef: ChangeDetectorRef,
    public global: GlobalService
  ) {
    super(_customIntl, _customCalendar, _customDateAdapter, _customDateFormats, _customChangeDetectorRef);
  }

  show() {
    this.previousClicked();
    this.nextClicked();
    // alert('El método show() se está ejecutando.');
  
  }
  
  override previousClicked(): void {
    this.changeMonth(-1);
   
  }
  
  get activeDateAsDate(): Date {
    return this._customDateAdapter.toIso8601(this._customCalendar.activeDate) as unknown as Date;
  }
  
  override nextClicked(): void {
    this.changeMonth(1);
   
  }

  private changeMonth(months: number): void {
    const currentDate = this._customCalendar.activeDate;
    if (currentDate) {
      const newDate = this._customDateAdapter.addCalendarMonths(currentDate, months);
      this._customCalendar.activeDate = newDate;
    }
  }
}
