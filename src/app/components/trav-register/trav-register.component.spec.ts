import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravRegisterComponent } from './trav-register.component';

describe('TravRegisterComponent', () => {
  let component: TravRegisterComponent;
  let fixture: ComponentFixture<TravRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
