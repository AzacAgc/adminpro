import { Component, OnInit } from '@angular/core';

import { HospitalService } from 'src/app/services/service.index';
import { Hospital } from 'src/app/models/hospital.model';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: []
})
export class HospitalesComponent implements OnInit {
  desde: number = 0;
  cargando: boolean = false;
  hospitales: Hospital[] = [];
  totalRegistros: number;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) {}

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion.subscribe(resp =>
      this.cargarHospitales()
    );
  }

  cargarHospitales() {
    this.cargando = true;

    this._hospitalService
      .cargarHospitales(this.desde)
      .subscribe((resp: any) => {
        this.hospitales = resp.hospitales;
        this.totalRegistros = resp.total;

        this.cargando = false;
      });
  } // end of cargarHospitales

  obtenerHospitalPorId(id: string) {
    this._hospitalService.obtenerHospitalPorId(id)
      .subscribe(resp => console.log(resp));
  } // end of obtenerHospitalPorId

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  } // end of cambiarDesde

  actualizarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital).subscribe();
  } // end of actualizarHospital

  borrarHospital(hospital: Hospital) {
    swal({
      title: '¿Estas seguro?',
      text: 'Estas a punto de borrar a ' + hospital.nombre + '.',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._hospitalService
          .borrarHospital(hospital._id)
          .subscribe(borrado => {
            this.cargarHospitales();
          });
      }
    });
  } // end of borrarHospital

  buscarHospitales(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospitales(termino).subscribe((resp: any) => {
      this.hospitales = resp;

      this.cargando = false;
    });
  } // end of buscarHospitales

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('hospitales', id);
  } // end of mostrarModal

  guardarHospital() {
    swal({
      title: 'Crear hospital',
      text: 'Escriba el nombre del nuevo hospital',
      content: 'input',
      icon: 'info',
      buttons: ['Cancelar', true]
    }).then((nombre: string ) => {
      if ( nombre.length <= 0 ) {
        return;
      }

      this._hospitalService.crearHospital(nombre)
        .subscribe( () => this.cargarHospitales() );
    });
  } // end of guardarHospital
}// end of class HospitalesComponent
