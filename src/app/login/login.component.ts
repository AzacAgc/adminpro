import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UsuarioService } from '../services/service.index';
import { Usuario } from 'src/app/models/usuario.model';

declare function initPlugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  recuerdame: boolean = false;
  email: string;

  auth2: any;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    initPlugins();
    this.googelInit();

    this.email = localStorage.getItem('email') || '';

    if (this.email.length > 0) {
      this.recuerdame = true;
    }
  }

  googelInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          '604907753441-173vn1tiolhboeo6sh3d275pcg4h3bbe.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSingIn( document.getElementById('btnGoogle') );
    });
  } // end of googelInit

  attachSingIn( element ) {
    this.auth2.attachClickHandler( element, {}, googleUser => {
      // const profile = googleUser.getBasicProfile();

      const token = googleUser.getAuthResponse().id_token;

      this._usuarioService.loginGoogle( token )
        .subscribe(correcto => window.location.href = '#/dashboard' );
    });
  }

  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }

    const usuario = new Usuario(null, forma.value.email, forma.value.password);

    this._usuarioService
      .login(usuario, forma.value.recuerdame)
      .subscribe( correcto => this.router.navigate(['/dashboard']) );
  } // end of ingresar
}
