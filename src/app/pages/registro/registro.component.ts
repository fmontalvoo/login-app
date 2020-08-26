import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';

import { UsuarioModel } from 'src/app/models/usuario.model';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public usuario: UsuarioModel;
  public recordar: boolean = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
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

    this.auth.signup(this.usuario)
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
            title: 'Error al registrarse',
            text: e.error.error.message
          });
        }
      );

  }


}
