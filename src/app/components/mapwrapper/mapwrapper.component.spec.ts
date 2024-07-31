import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapwrapperComponent } from './mapwrapper.component';

describe('MapwrapperComponent', () => {
  let component: MapwrapperComponent;
  let fixture: ComponentFixture<MapwrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapwrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapwrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
