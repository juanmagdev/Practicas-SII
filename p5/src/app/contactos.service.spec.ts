import { TestBed } from '@angular/core/testing';

import { ContactosService } from './contactos.service';

describe('Los contactos', () => {
  let service: ContactosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactosService);
  });

  it('deberían tener un atributo favorito', () => {
    expect(service.getContactos()[0].favorito).toBeDefined();
  });
});
