import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Contacto } from '../contacto';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormularioContactoComponent} from '../formulario-contacto/formulario-contacto.component'
import { ContactosService } from '../contactos.service';

@Component({
  selector: 'app-detalle-contacto',
  templateUrl: './detalle-contacto.component.html',
  styleUrls: ['./detalle-contacto.component.css']
})
export class DetalleContactoComponent {
  @Input() contacto?: Contacto;
  @Output() contactoEditado = new EventEmitter<Contacto>();
  @Output() contactoEliminado = new EventEmitter<number>();

  constructor(private contactosService: ContactosService, private modalService: NgbModal) { }

  editarContacto(): void {
    let ref = this.modalService.open(FormularioContactoComponent);
    ref.componentInstance.accion = "Editar";
    ref.componentInstance.contacto = {...this.contacto};
    ref.result.then((contacto: Contacto) => {
      this.contactoEditado.emit(contacto);
    }, (reason) => {});
  }

  eliminarContacto(): void {
    this.contactoEliminado.emit(this.contacto?.id);
  }
}
