import { ComponentFixture, TestBed } from '@angular/core/testing';


import { CrearReporteComponent } from './crear-reporte.component';


describe('CrearReporteComponent', () => {
  let component: CrearReporteComponent;
  let fixture: ComponentFixture<CrearReporteComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearReporteComponent]
    })
    .compileComponents();


    fixture = TestBed.createComponent(CrearReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
