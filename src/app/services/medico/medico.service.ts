import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from 'src/app/config/config';
import { UsuarioService } from '../usuario/usuario.service';

import { map } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';

@Injectable()
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {}

  cargarMedicos(desde: number = 0) {
    let url = URL_SERVICIOS + '/medico';
    url += '?desde=' + desde;

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalMedicos = resp.total;

        return resp.medicos;
      })
    );
  } // end of cargarMedicos

  buscarMedicos(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get(url).pipe(map((resp: any) => resp.medicos));
  } // end of buscarMedicos

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url).pipe(
      map(resp => {
        console.log(resp);

        swal('Médico borrado', 'Médico borrado correctamente.', 'success');

        return resp;
      })
    );
  } // end of borrarMedico

  guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {
      // Actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, medico ).pipe(
        map((resp: any) => {
          swal('Médico actualizado', medico.nombre, 'success');

          return resp.medico;
        })
      );
    } else {
      // Creando
      url += '?token=' + this._usuarioService.token;

      return this.http.post(url, medico).pipe(
        map((resp: any) => {
          swal('Medico creado', medico.nombre, 'success');

          return resp.medico;
        })
      );
    }// end if else
  } // end of guardarMedico

  cargarMedico(id: string) {
    const url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get(url).pipe(map((resp: any) => resp.medico));
  } // end of cargarMedico
}// end of service MedicoService
