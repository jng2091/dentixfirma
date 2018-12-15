import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  hide = true;
  error = false;
  mensaje:string;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  get f() { return this.loginForm.controls; }


  login() {

    if (this.loginForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.authService.authenticate(this.f.email.value, this.f.password.value).subscribe(res => {
      if (res.error == 0) {

        this.mensaje="Usuario y/o contraseña erronea";
        this.error = true;
        this.submitted = false;
        this.loading = false;
        return;
      }
      //localStorage.setItem("email", this.f.email.value);
      localStorage.setItem("token", res.token);
      localStorage.setItem("expired", res.expired.toString());
      this.router.navigate(["/home"]);
    }, err => {
      this.mensaje="Se ha generado un error. Intente de nuevo"
      this.submitted = false;
      this.loading = false;
      this.error = true;
    });


  }

}
