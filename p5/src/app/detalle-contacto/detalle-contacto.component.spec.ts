import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleContactoComponent } from './detalle-contacto.component';

describe('El componente de detalle de contacto', () => {
  let component: DetalleContactoComponent;
  let fixture: ComponentFixture<DetalleContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleContactoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleContactoComponent);
    component = fixture.componentInstance;
  });

  it('debe mostrar el atributo "favorito" debajo del teléfono', () => {
    component.contacto = {id: 1, nombre: 'Juan', apellidos: 'Pérez', email: '', telefono: '', favorito: true};
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#telefono + div')).not.toBeNull();
    expect(compiled.querySelector('#telefono + div label')?.textContent).toContain('Favorito');
  });

  it('debe mostrar "Sí" para en el atributo "favorito" para los contactos favoritos', () => {
    component.contacto = {id: 1, nombre: 'Juan', apellidos: 'Pérez', email: '', telefono: '', favorito: true};
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#telefono + div')).not.toBeNull();
    expect(compiled.querySelector('#telefono + div span')?.textContent).toContain('Sí');
  });

  it('debe mostrar "No" para en el atributo "favorito" para los contactos que no sean favoritos', () => {
    component.contacto = {id: 1, nombre: 'Juan', apellidos: 'Pérez', email: '', telefono: '', favorito: false};
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#telefono + div')).not.toBeNull();
    expect(compiled.querySelector('#telefono + div span')?.textContent).toContain('No');
  });
});
