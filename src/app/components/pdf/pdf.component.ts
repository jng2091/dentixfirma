import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, HostListener, Inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ObjSolicitud } from '../../models/ObjSolicitud';
import { FirmaDialog } from '../home/home.component';
import { ObjCatalogo } from '../../models/ObjCatalogo';


@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {

  error = false;
  mensaje: string;
  firmaForm: FormGroup;
  img: string = "";
  submitted: boolean = false;
  loading: boolean = false;
  link;
  consentimiento: boolean = true;
  clinicas;
  doctores;
  objFirma: ObjSolicitud = {};
  objCatalogo: ObjCatalogo;

  constructor(private formBuilder: FormBuilder, public snackBar: MatSnackBar, public dialog: MatDialog, public dataService: DataService) {

    this.objCatalogo = this.dataService.objCatalogo;
    this.clinicas = this.dataService.objCatalogo.clinicas
    this.doctores = this.dataService.objCatalogo.doctores



    // this.dataService.objSolicitud.subscribe(data => {
    //   this.objFirma = data;
    //   if (data) {
    //     this.clinicas = data.clinicas
    //     this.doctores = data.doctores
    //   };
    // }, err => {
    //   this.mensaje = "Se ha generado un error. Intente de nuevo"
    //   this.submitted = false;
    //   this.loading = false;
    //   this.error = true
    // });

  }

  ngOnInit() {
    this.firmaForm = this.formBuilder.group({
      tipo: ['', [Validators.required]],
      identificacion: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      tipoIdentificacion: ['', [Validators.required]],
      tratamiento: ['', [Validators.required]],
      observacion: ['', []],
      doctor: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      noHistClinica: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      ciudad: ['', [Validators.required]],
      clinica: ['', [Validators.required]],
    });

    this.firmaForm.controls.clinica.disable();
    this.firmaForm.controls.doctor.disable();
  }


  get f() { return this.firmaForm.controls; }

  enviar() {

    this.error = false;

    //if (this.f.tipo.value == "1") {
      if (this.firmaForm.invalid || !this.img) {
        return;
      }
    // }
    // else if (this.f.tipo.value == "2") {
    //   if (
    //     !this.f.tipoIdentificacion.valid ||
    //     !this.f.identificacion.valid ||
    //     !this.f.nombre.valid ||
    //     !this.f.doctor.valid ||
    //     !this.f.ciudad.valid ||
    //     !this.f.tratamiento.valid ||
    //     !this.f.clinica.valid || !this.img
    //   ) {
    //     return;
    //   }
    // }
    // else {
    //   return;
    // }


    this.submitted = true;
    this.loading = true;


    this.objFirma.tipo = this.f.tipo.value;
    this.objFirma.tipoIdentificacion = this.f.tipoIdentificacion.value;
    this.objFirma.identificacion = this.f.identificacion.value;
    this.objFirma.nombre = this.f.nombre.value.toUpperCase();
    this.objFirma.noHistClinica = this.f.noHistClinica.value;
    this.objFirma.tratamiento = this.f.tratamiento.value;
    this.objFirma.observacion = this.f.observacion.value;
    this.objFirma.doctor = this.f.doctor.value;
    this.objFirma.ciudad = this.f.ciudad.value;
    this.objFirma.clinica = this.f.clinica.value;
    this.objFirma.firma = this.img;



    this.dataService.crearPdf(this.objFirma).subscribe(data => {
      this.link = data;
      this.submitted = false;
      this.loading = false;
    }, err => {
      this.mensaje = "Se ha generado un error. Intente de nuevo"
      this.submitted = false;
      this.loading = false;
      this.error = true
    });
  }

  abrirPdf() {
    var file = new Blob([this.link], { type: 'application/pdf' });
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");

  }

  verPlantilla() {

    if (!this.f.tipo.valid || !this.f.tratamiento.valid) {
      this.MostarMensaje("Ingrese el tipo y el tratamiento");
      return;
    }
    this.submitted = true;
    this.loading = true;

    this.dataService.verPlantilla(this.f.tipo.value, this.f.tratamiento.value).subscribe(data => {
      console.log(data);
      var file = new Blob([data], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");

      this.submitted = false;
      this.loading = false;

    }, err => {
      this.mensaje = "Se ha generado un error. Intente de nuevo"
      this.submitted = false;
      this.loading = false;
      this.error = true
    });
  }

  nuevaSolicitud(formDirective) {
    this.img = null;
    this.link = null;
    //this.consentimiento = false;
    formDirective.resetForm();
    this.firmaForm.reset();
  }


  // keyupNumber(num, len) {
  //   num.value = num.value.replace(/\D/g, '').substring(0, len);
  // }

  changeNombre() {
    this.f.nombre.setValue(this.f.nombre.value.toUpperCase());
  }

  MostarMensaje(mensaje) {
    this.snackBar.open(mensaje, "", {
      duration: 3000
    });
  }

  changeCiudad() {
    this.objCatalogo.clinicas = this.clinicas.filter(c => c.parent == this.f.ciudad.value);
    this.f.clinica.setValue(null);
    this.f.doctor.setValue(null);
    this.f.clinica.enable();
    this.f.doctor.disable();
  }

  changeClinica() {
    this.objCatalogo.doctores = this.doctores.filter(c => c.parent == this.f.clinica.value);
    this.f.doctor.setValue(null);
    this.f.doctor.enable();
  }

  // changeTipo() {

  //   if (this.f.tipo.value == "1") {
  //     this.consentimiento = true;
  //   }
  //   else {
  //     this.consentimiento = false;
  //   }
  // }

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
