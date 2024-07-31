import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistRegisterComponent } from './specialist-register.component';

describe('SpecialistRegisterComponent', () => {
  let component: SpecialistRegisterComponent;
  let fixture: ComponentFixture<SpecialistRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialistRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialistRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
