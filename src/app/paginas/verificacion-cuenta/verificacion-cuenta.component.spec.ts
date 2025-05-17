import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificacionCuentaComponent } from './verificacion-cuenta.component';

describe('VerificacionCuentaComponent', () => {
  let component: VerificacionCuentaComponent;
  let fixture: ComponentFixture<VerificacionCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificacionCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificacionCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
