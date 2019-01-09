import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Usuario } from 'src/app/models/usuario.model';
import { URL_SERVICIOS } from 'src/app/config/config';

import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import swal from 'sweetalert';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarDelStorage();
  }
  renuevaToken() {
    let url = URL_SERVICIOS + '/login/renuevaToken';
    url += '?token=' + this.token;

    return this.http.get( url ).pipe(
      map((resp: any) => {
        this.token = resp.token;

        localStorage.setItem('token', this.token);

        return true;
      }),
      catchError(err => {
        this.router.navigate(['/login']);
        swal('Sesión invalida', 'No fue posible reanudar la sesión', 'error');

        return throwError(err);
      })
    );
  }

  estaLogeado() {
    return this.token.length > 5 ? true : false;
  }

  cargarDelStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse( localStorage.getItem('menu') );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  } // end of cargarDelStorage

  guardarEnStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify( menu ) );

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.token = '';
    this.usuario = null;
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, {token}).pipe(
      map((resp: any) => {
        this.guardarEnStorage(resp.id, resp.token, resp.usuario, resp.menu);

        return true;
      })
    );
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        this.guardarEnStorage(resp.id, resp.token, resp.usuario, resp.menu);

        return true;
      }),
      catchError( err => {
        swal('Error en el login', err.error.mensaje, 'error');

        return throwError( err );
      })
    );
  } // end of login

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        swal('Usuario creado', usuario.email, 'success');

        return resp.usuario;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');

        return throwError(err);
      })
    );
  } // end of crearUsuario

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe( map((resp: any) => {
        if (usuario._id === this.usuario._id) {
          const usuarioBD: Usuario = resp.usuario;
          this.guardarEnStorage(usuarioBD._id, this.token, usuarioBD, this.menu);
        }

        swal('Usuario actualizado', usuario.nombre, 'success');

        return true;
      }), catchError(err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');

        return throwError(err);
      })
    );
  } // end of actualizarUsuario

  cambiarImagen(archivo: File, id: string) {
    this._subirArchivoService
      .subirArchivo(archivo, 'usuarios', id)
      .then((resp: any) => {
        resp = JSON.parse(resp);

        this.usuario.img = resp.usuario.img;

        swal('Imagen actualizada', this.usuario.nombre, 'success');

        this.guardarEnStorage(id, this.token, this.usuario, this.menu);
      })
      .catch(err => {
        console.error(err);
      });
  } // end of cambiarImagen

  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this.http.get(url).pipe(map((resp: any) => resp.usuarios));
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url).pipe(
      map(resp => {
        swal(
          'Usuario borrado',
          'El usuario ha sido borrado correctamente',
          'success'
        );
        return true;
      })
    );
  } // end of borrarUsuario

}// end of service UsuarioService
