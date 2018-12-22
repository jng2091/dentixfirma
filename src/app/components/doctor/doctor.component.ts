import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FirmaDialog } from '../home/home.component';
import { ObjSolicitud } from '../../models/ObjSolicitud';
import { DataService } from '../../services/data.service';
import { ObjCatalogo } from '../../models/ObjCatalogo';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  error = false;
  mensaje: string;
  doctorForm: FormGroup;
  img: string = "";
  submitted: boolean = false;
  loading: boolean = false;
  link;
  objDoctor: ObjSolicitud = {};
  clinicas;
  objCatalogo: ObjCatalogo;

  constructor(private formBuilder: FormBuilder, public snackBar: MatSnackBar, public dialog: MatDialog, public dataService: DataService) {


    this.objCatalogo = this.dataService.objCatalogo;
    this.clinicas = this.dataService.objCatalogo.clinicas;

    // this.dataService.objSolicitud.subscribe(data => {
    //   this.objDoctor = data;
    //   if (data) this.clinicas = data.clinicas;
    // }, err => {
    //   this.mensaje = "Se ha generado un error. Intente de nuevo"
    //   this.submitted = false;
    //   this.loading = false;
    //   this.error = true
    // });

  }

  ngOnInit() {
    this.doctorForm = this.formBuilder.group({
      identificacion: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      tipoIdentificacion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      clinica: ['', [Validators.required]],
    });

    this.doctorForm.controls.clinica.disable();
  }


  get f() { return this.doctorForm.controls; }

  crearDoctor(formDirective) {

    if (this.doctorForm.invalid || !this.img) {
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.objDoctor.tipoIdentificacion = this.f.tipoIdentificacion.value;
    this.objDoctor.identificacion = this.f.identificacion.value;
    this.objDoctor.nombre = this.f.nombre.value.toUpperCase();
    this.objDoctor.ciudad = this.f.ciudad.value;
    this.objDoctor.clinica = this.f.clinica.value;
    this.objDoctor.firma = this.img;

    this.dataService.crearDoctor(this.objDoctor).subscribe(data => {
      this.submitted = false;
      this.loading = false;
      this.img = null;
      if (data == 0) {
        this.MostrarMensaje("Doctor creado satisfactoriamente!");
        formDirective.resetForm();
        this.doctorForm.reset();
      }
      else {
        this.mensaje = "Se ha generado un error. Intente de nuevo"
        this.error = true
      }

    }, err => {
      this.mensaje = "Se ha generado un error. Intente de nuevo"
      this.submitted = false;
      this.loading = false;
      this.error = true
    });
  }

  // keyupNumber(num, len) {
  //   num.value = num.value.replace(/\D/g, '').substring(0, len);
  // }

  changeNombre() {
    this.f.nombre.setValue(this.f.nombre.value.toUpperCase());
  }

  changeCiudad() {
    this.objCatalogo.clinicas = this.clinicas.filter(c => c.parent == this.f.ciudad.value);
    this.f.clinica.setValue(null);
    this.doctorForm.controls.clinica.enable();
  }

  MostrarMensaje(mensaje) {
    this.snackBar.open(mensaje, "", {
      duration: 3000
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FirmaDialog, {
      width: '100%',
      height: '100%',
      maxWidth: "100%",
      maxHeight: "100%",
      data: this.img
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.img = result;
    });
  }

}
