import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {ContactosService } from './contactos.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

describe('El componente principal', () => {
  const mockService = {
    getContactos: () => {
      return [
        {id: 1, nombre: 'Juan', apellidos: 'Pérez', email: '', telefono: '', favorito: true},
        {id: 2, nombre: 'Ana', apellidos: 'García', email: '', telefono: '', favorito: false}]
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: ContactosService, useValue: mockService},
        NgbModal]
    }).compileComponents();
  });

  it('debe mostrar una estrella en los contactos favoritos', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelectorAll('button.list-group-item').forEach((element, index) => {
      if (index == 0) {
        expect(element.textContent).toContain("Juan");
        expect(element.querySelector('.bi-star-fill')).not.toBeNull();
      }
    });
  });

  it('no debe mostrar una estrella en los contactos que no sean favoritos', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelectorAll('button.list-group-item').forEach((element, index) => {
      if (index != 0) {
        expect(element.querySelector('.bi-star-fill')).toBeNull();
      }
    });
  });
});
