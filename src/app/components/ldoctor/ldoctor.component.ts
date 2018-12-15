import { Component, OnInit, ViewChild, } from '@angular/core';
import { ObjDoctor } from '../../models/ObjDoctor';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';


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
      , 'FechaCreacion'
    ];

  doctores: ObjDoctor[] = [{
    id: 1,
    tipoIdentificacion: "CC",
    identificacion: "1234567",
    nombre: "PEPE PEREZ",
    clinica: "CLINICA",
    ciudad: "CIUDAD",
    fechaCreacion: "2018-12-12"

  },
  {
    id: 2,
    tipoIdentificacion: "CC",
    identificacion: "1234567",
    nombre: "ANDREA PEREZ",
    clinica: "CLINICA",
    ciudad: "CIUDAD",
    fechaCreacion: "2018-12-12"

  }];

  constructor(public snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.doctores);
    this.dataSource.paginator = this.paginator;


  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  MostarMensaje(mensaje) {
    this.snackBar.open(mensaje, "", {
      duration: 3000
    });
  }
}
