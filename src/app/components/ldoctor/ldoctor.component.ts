import { Component, OnInit, ViewChild, } from '@angular/core';
import { ObjDoctor } from '../../models/ObjDoctor';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { DataService } from 'src/app/services/data.service';
import { EdoctorComponent } from '../edoctor/edoctor.component';


@Component({
  selector: 'app-ldoctor',
  templateUrl: './ldoctor.component.html',
  styleUrls: ['./ldoctor.component.css']
})
export class LdoctorComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<ObjDoctor>;

  displayedColumns: string[] =
    [
      'Id'
      , 'TipoIdentificacion'
      , 'Identificacion'
      , 'Nombre'
      , 'Clinica'
      , 'Ciudad'
      , 'Activo'
      , 'FechaCreacion'
      , 'Editar'
      , 'ACDE'
    ];

  doctores: ObjDoctor[];

  constructor(public snackBar: MatSnackBar, public dataService: DataService, public dialog: MatDialog, ) {
    this.dataService.verDoctores().subscribe(data => {
      this.doctores = data;
      this.dataSource = new MatTableDataSource(this.doctores);
      this.dataSource.paginator = this.paginator;

    }, err => {
      this.MostrarMensaje("Se genero un error. Intente de nuevo");
    });

  }

  ngOnInit() {



  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  MostrarMensaje(mensaje) {
    this.snackBar.open(mensaje, "", {
      duration: 3000
    });
  }

  editar(doctor: ObjDoctor) {

    const dialogRef = this.dialog.open(EdoctorComponent, {
      // width: '100%',
      // height: '100%',
      // maxWidth: "100%",
      // maxHeight: "100%",
      data: doctor
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let updateItem = this.doctores.find(d => d.id === result.id);
        let index = this.doctores.indexOf(updateItem);
        this.doctores[index] = result;
        this.dataSource = new MatTableDataSource(this.doctores);
        this.dataSource.paginator = this.paginator;
        this.MostrarMensaje("Doctor actualizado!");
      }
    });

  }

  ACDE(doctor: ObjDoctor) {

    this.dataService.activarDoctor(doctor.id, !doctor.activo).subscribe(data => {
      if (data == 0) {
        let acde = doctor.activo ? "desactivado" : "activado";
        this.MostrarMensaje(`Doctor ${acde}`);
        doctor.activo = !doctor.activo;
      } else {
        this.MostrarMensaje("Se genero un error. Intente de nuevo");
      }
    }, err => {
      this.MostrarMensaje("Se genero un error. Intente de nuevo");
    });


  }
}
