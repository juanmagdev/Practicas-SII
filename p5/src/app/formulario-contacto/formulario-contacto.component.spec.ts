import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioContactoComponent } from './formulario-contacto.component';
import { FormsModule } from '@angular/forms';

describe('El formulario de contactos', () => {
  let component: FormularioContactoComponent;
  let fixture: ComponentFixture<FormularioContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[FormsModule],
      declarations: [ FormularioContactoComponent ],
      providers: [NgbActiveModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioContactoComponent);
    component = fixture.componentInstance;

  });

  it('debe mostrar un checkbox "favorito" debajo del teléfono', () => {
    component.accion = "Añadir";
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#telefono + input')).not.toBeNull();
    expect(compiled.querySelector('#telefono + input')?.hasAttribute('type')).toBeTruthy();
    expect(compiled.querySelector('#telefono + input')?.getAttribute('type')).toBe('checkbox');

    expect(compiled.querySelector('#telefono ~ label')).not.toBeNull();
    expect(compiled.querySelector('#telefono ~ label')?.textContent).toContain('Favorito');
  });

  it('debe mostrar el checkbox marcado para los contactos favoritos', (done: DoneFn) => {
    component.accion = "Añadir";
    component.contacto = {id: 1, nombre: 'Juan', apellidos: 'Pérez', email: '', telefono: '', favorito: true};
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('#telefono + input') as HTMLInputElement;
    const nombre = compiled.querySelector('#nombre') as HTMLInputElement;
    fixture.whenStable().then(() => {
      expect(checkbox.checked).toBeTruthy();
      done();
    });
  });

  it('debe mostrar el checkbox sin marcar para los contactos que no son favoritos', (done: DoneFn) => {
    component.accion = "Añadir";
    component.contacto = {id: 1, nombre: 'Juan', apellidos: 'Pérez', email: '', telefono: '', favorito: false};
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('#telefono + input') as HTMLInputElement;
    const nombre = compiled.querySelector('#nombre') as HTMLInputElement;
    fixture.whenStable().then(() => {
      expect(checkbox.checked).toBeFalsy();
      done();
    });
  });

  it('debe cambiar el modelo cuando desmarco un checkbox marcado', (done: DoneFn) => {
    component.accion = "Añadir";
    component.contacto = {id: 1, nombre: 'Juan', apellidos: 'Pérez', email: '', telefono: '', favorito: true};
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('#telefono + input') as HTMLInputElement;
    const nombre = compiled.querySelector('#nombre') as HTMLInputElement;
    fixture.whenStable().then(() => {
      checkbox.click();
      fixture.detectChanges();
      expect(component.contacto.favorito).toBeFalsy();
      done();
    });
  });

  it('debe cambiar el modelo cuando marco un checkbox desmarcado', (done: DoneFn) => {
    component.accion = "Añadir";
    component.contacto = {id: 1, nombre: 'Juan', apellidos: 'Pérez', email: '', telefono: '', favorito: false};
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('#telefono + input') as HTMLInputElement;
    const nombre = compiled.querySelector('#nombre') as HTMLInputElement;
    fixture.whenStable().then(() => {
      checkbox.click();
      fixture.detectChanges();
      expect(component.contacto.favorito).toBeTruthy();
      done();
    });
  });
});
