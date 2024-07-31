import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravHomeComponent } from './trav-home.component';

describe('TravHomeComponent', () => {
  let component: TravHomeComponent;
  let fixture: ComponentFixture<TravHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
