import { Component } from '@angular/core';
import  {Contacto} from '../contacto';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-formulario-contacto',
  templateUrl: './formulario-contacto.component.html',
  styleUrls: ['./formulario-contacto.component.css']
})
export class FormularioContactoComponent {
  accion: "Añadir" | "Editar" | undefined;
  contacto: Contacto = {id: 0, nombre: '', apellidos: '', email: '', telefono: '', favorito: false};

  constructor(public modal: NgbActiveModal) { }

  guardarContacto(): void {
    this.modal.close(this.contacto);
  }

}
