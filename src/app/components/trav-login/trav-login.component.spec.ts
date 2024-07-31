import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravLoginComponent } from './trav-login.component';

describe('TravLoginComponent', () => {
  let component: TravLoginComponent;
  let fixture: ComponentFixture<TravLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
