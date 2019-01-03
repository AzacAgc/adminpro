import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from 'src/app/config/config';
import { Hospital } from 'src/app/models/hospital.model';

import { UsuarioService } from '../usuario/usuario.service';

import { map } from 'rxjs/operators';

@Injectable()
export class HospitalService {
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {}

  cargarHospitales(desde: number = 0) {
    const url = URL_SERVICIOS + '/hospital?desde=' + desde;

    return this.http.get(url);
  } // end of cargarHospitales

  obtenerHospitalPorId(id: string) {
    const url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.hospital)
      );
  } // end of obtenerHospital

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url).pipe(
      map((resp: any) => {
        swal(
          'Hospital borrado',
          'El hospital ha sido borrado correctamente',
          'success'
        );

        return true;
      })
    );
  } // end of borrarHospital

  crearHospital(nombre: string) {
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this._usuarioService.token;

    if (nombre.length <= 0) {
      return;
    }

    const hospital = new Hospital(nombre);

    return this.http.post(url, hospital).pipe(
      map((resp: any) => {
        swal('Hospital creado', nombre, 'success');

        return resp.hospital;
      })
    );
  } // end of crearHospital

  buscarHospitales(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this.http.get(url).pipe(
      map((resp: any) => resp.hospitales)
    );
  } // end of buscarHospital

  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, hospital ).pipe(
      map((resp: any) => {
        swal('Hospital actualizado', hospital.nombre, 'success');

        return resp.hospital;
      })
    );
  } // end of actualizarHospital

}// end of service HospitalService
