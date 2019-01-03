import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/service.index';

declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  desde: number = 0;
  cargando: boolean = false;
  medicos: Medico[] = [];

  constructor(public _medicosService: MedicoService) {}

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;

    this._medicosService.cargarMedicos( this.desde ).subscribe(medicos => {
      this.medicos = medicos;

      this.cargando = false;
    });
  } // end of cargarMedicos

  buscarMedicos(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }
    this._medicosService
      .buscarMedicos(termino)
      .subscribe(medicos => (this.medicos = medicos));
  } // end of buscarMedicos

  borrarMedico(medico: Medico) {
    swal({
      title: '¿Estas seguro?',
      text: 'Estas a punto de borrar a ' + medico.nombre + '.',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._medicosService
          .borrarMedico(medico._id)
          .subscribe(() => this.cargarMedicos());
      }
    });
  } // end of borrarMedico

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if (desde >= this._medicosService.totalMedicos) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();
  } // end of cambiarDesde
}// end of class MedicosComponent
