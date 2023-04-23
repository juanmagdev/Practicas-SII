import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetalleContactoComponent } from './detalle-contacto/detalle-contacto.component';
import { FormularioContactoComponent } from './formulario-contacto/formulario-contacto.component';

@NgModule({
  declarations: [
    AppComponent,
    DetalleContactoComponent,
    FormularioContactoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
