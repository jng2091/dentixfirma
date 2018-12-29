import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ObjSolicitud } from '../../models/ObjSolicitud';
import { DataService } from '../../services/data.service';
import { ObjCatalogo } from '../../models/ObjCatalogo';
import { ObjDoctor } from '../..//models/ObjDoctor';

@Component({
  selector: 'app-edoctor',
  templateUrl: './edoctor.component.html',
  styleUrls: ['./edoctor.component.css']
})
export class EdoctorComponent implements OnInit {


  error = false;
  mensaje: string;
  doctorForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  objDoctor: ObjDoctor = {};
  clinicas;
  objCatalogo: ObjCatalogo;

  constructor(private formBuilder: FormBuilder, public snackBar: MatSnackBar
    , public dialog: MatDialog, public dataService: DataService
    , public dialogRef: MatDialogRef<EdoctorComponent>, @Inject(MAT_DIALOG_DATA) public data: ObjDoctor) {


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

    //this.doctorForm.controls.clinica.disable();

    let ti = this.objCatalogo.tiposIdentificacion.find(c => c.viewValue == this.data.tipoIdentificacion).value;
    let ci = this.objCatalogo.ciudades.find(c => c.viewValue == this.data.ciudad).value;
    let cl = this.objCatalogo.clinicas.find(c => c.viewValue == this.data.clinica).value;

    this.clinicas = this.objCatalogo.clinicas.filter(c => c.parent == ci);

    this.f.tipoIdentificacion.setValue(ti);
    this.f.identificacion.setValue(this.data.identificacion);
    this.f.nombre.setValue(this.data.nombre);
    this.f.ciudad.setValue(ci);
    this.f.clinica.setValue(cl);
  }


  get f() { return this.doctorForm.controls; }

  editarDoctor(formDirective) {
    if (this.doctorForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.objDoctor.id = this.data.id;
    this.objDoctor.tipoIdentificacion = this.f.tipoIdentificacion.value;
    this.objDoctor.identificacion = this.f.identificacion.value;
    this.objDoctor.nombre = this.f.nombre.value.toUpperCase();
    this.objDoctor.ciudad = this.f.ciudad.value;
    this.objDoctor.clinica = this.f.clinica.value;

    this.dataService.actualizarDoctor(this.objDoctor).subscribe(res => {
      this.submitted = false;
      this.loading = false;

      this.dialogRef.close(res);

    }, err => {
      this.submitted = false;
      this.loading = false;
      this.MostrarMensaje("Se genero un error. Intente de nuevo");
    });

  }

  changeNombre() {
    this.f.nombre.setValue(this.f.nombre.value.toUpperCase());
  }

  changeCiudad() {
    this.clinicas = this.objCatalogo.clinicas.filter(c => c.parent == this.f.ciudad.value);
    this.f.clinica.setValue(null);
    this.doctorForm.controls.clinica.enable();
  }

  MostrarMensaje(mensaje) {
    this.snackBar.open(mensaje, "", {
      duration: 3000
    });
  }
}
