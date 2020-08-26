import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';

import { UsuarioModel } from 'src/app/models/usuario.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public usuario: UsuarioModel;
  public recordar: boolean = false;

  constructor(private auth: AuthService, private router: Router) {
    this.usuario = new UsuarioModel();
  }

  ngOnInit() {
    let email: string = this.auth.getLocalStorage('email');
    if (email) {
      this.usuario.email = email;
      this.recordar = true;
    }
  }

  public onSubmit(form: NgForm) {
    if (form.invalid)
      return;

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Cargando...'
    });
    Swal.showLoading();

    this.auth.login(this.usuario)
      .subscribe(
        response => {
          Swal.close();

          if (this.recordar)
            this.auth.saveLocalStorage('email', this.usuario.email);

          this.router.navigateByUrl('/home');
        },
        e => {
          Swal.fire({
            icon: 'error',
            title: 'Error al ingresar',
            text: e.error.error.message
          });
        }
      );

  }

}
