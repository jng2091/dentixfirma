import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ObjConsulta } from '../../models/ObjConsulta'
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-lpdf',
  templateUrl: './lpdf.component.html',
  styleUrls: ['./lpdf.component.css']
})
export class LpdfComponent implements OnInit {

  objConsultas: ObjConsulta[];
  mensaje;
  loading;
  submitted;

  loading2;
  submitted2;

  constructor(public snackBar: MatSnackBar, public dataService: DataService) { }

  ngOnInit() {
  }

  buscar(identificacion) {

    this.mensaje = "";

    if (!identificacion.value) {
      this.MostrarMensaje("Ingrese una identificación");
      return;
    }

    if (isNaN(parseFloat(identificacion.value)) || identificacion.value.length > 15) {
      this.MostrarMensaje("Ingrese una identificación valida");
      return;
    }

    this.loading = true;
    this.submitted = true;

    this.dataService.verConsultas(identificacion.value).subscribe(data => {

      this.loading = false;
      this.submitted = false;

      if (data.length == 0) {
        this.mensaje = "No se encontró ninguna solicitud";
      }

      this.objConsultas = data;
    }, err => {
      this.loading = false;
      this.submitted = false;
      this.MostrarMensaje("Se genero un error. Intente de nuevo");
    })




  }

  verPdf(objConsulta: ObjConsulta) {

    this.loading2 = true;
    this.submitted2 = true;

    this.dataService.verPdf(objConsulta.id).subscribe(data => {

      this.loading2 = false;
      this.submitted2 = false;
      
      var file = new Blob([data], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");

    }, err => {
      this.loading2 = false;
      this.submitted2 = false;
      this.MostrarMensaje("Se genero un error. Intente de nuevo");
    })
  }

  MostrarMensaje(mensaje) {
    this.snackBar.open(mensaje, "", {
      duration: 3000
    });
  }
}
