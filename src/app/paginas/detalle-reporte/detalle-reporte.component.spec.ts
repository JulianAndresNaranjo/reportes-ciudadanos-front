import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleReporteComponent } from './detalle-reporte.component';

describe('DetalleReporteComponent', () => {
  let component: DetalleReporteComponent;
  let fixture: ComponentFixture<DetalleReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleReporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
