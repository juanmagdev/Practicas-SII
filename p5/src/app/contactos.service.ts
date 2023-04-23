import { Injectable } from '@angular/core';
import {Contacto } from './contacto';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  private contactos: Contacto [] = [
    {id: 1, nombre: 'Juan', apellidos: 'Pérez', email: 'perez@uma.es', telefono: '666666666', favorito: true},
    {id: 2, nombre: 'Ana', apellidos: 'García', email: 'ana@uma.es', telefono: '55555555', favorito: false},
    {id: 3, nombre: 'Luis', apellidos: 'González', email: 'gonzalez@uma.es', telefono: '444444444', favorito: false},
  ];

  constructor() { }

  getContactos(): Contacto [] {
    return this.contactos;
  }

  addContacto(contacto: Contacto) {
    contacto.id = this.contactos.length + 1;
    this.contactos.push(contacto);
  }

  editarContacto(contacto: Contacto) {
    let indice = this.contactos.findIndex(c => c.id == contacto.id);
    this.contactos[indice] = contacto;
  }

  eliminarcContacto(id: number) {
    let indice = this.contactos.findIndex(c => c.id == id);
    this.contactos.splice(indice, 1);
  }
}
