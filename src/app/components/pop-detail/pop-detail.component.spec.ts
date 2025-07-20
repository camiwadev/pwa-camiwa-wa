import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDetailComponent } from './pop-detail.component';

describe('PopDetailComponent', () => {
  let component: PopDetailComponent;
  let fixture: ComponentFixture<PopDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
