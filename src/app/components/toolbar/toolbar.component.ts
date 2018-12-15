import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  indexTab = localStorage.getItem("tabIndex") == null ? "0" : localStorage.getItem("tabIndex");
  seeTab1InConfiguraton = true;
  seeTab2InConfiguraton = false;
  seg: number = 0;
  email;
  nombreProyecto = environment.nombreProyecto;

  constructor(private router: Router, private authService: AuthService) {

    this.email = localStorage.getItem("email");
    let intervalId;

    intervalId = setInterval(() => {
      let token = localStorage.getItem("token");
      let expired = localStorage.getItem("expired");

      if (token === null || expired === null) {
        localStorage.removeItem("token");
        localStorage.removeItem("expired");
        this.router.navigate(["/auth"]);
        clearInterval(intervalId);
        return;
      }

      let expiredMessage: number = Number(expired) - (1000 * 60 * 10);
      let expiredClose: number = Number(expired) - (1000 * 60 * 5);
      let fecha: number = new Date().getTime();

      if (fecha > expiredMessage) {
        this.seg = Math.round(((expiredClose - fecha)) / 1000);
      }

      if (fecha > expiredClose) {
        localStorage.removeItem("token");
        localStorage.removeItem("expired");
        this.router.navigate(["/auth"]);
        clearInterval(intervalId);
      }

    }, 1000);
  }

  ngOnInit() {
    this.setTabInConfiguration(this.indexTab);
  }

  setTab(index) {
    localStorage.setItem("tabIndex", index);
    this.setTabInConfiguration(index);
  }


  logout() {
    localStorage.removeItem("email");
    localStorage.removeItem("expired");
    this.router.navigate(["/auth"]);
  }

  setTabInConfiguration(index) {
    if (index == "0") {
      this.seeTab1InConfiguraton = true;
      this.seeTab2InConfiguraton = false;
    }
    else if (index == "1") {
      this.seeTab2InConfiguraton = true;
      this.seeTab1InConfiguraton = false;
    }
  }

  extend() {
    this.authService.extend().subscribe(res => {
      this.seg = 0;
      localStorage.setItem("token", res.token);
      localStorage.setItem("expired", res.expired.toString());

    });
  }
}


