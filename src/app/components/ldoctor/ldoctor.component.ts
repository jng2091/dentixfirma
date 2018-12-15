import { Component, OnInit, ViewChild, } from '@angular/core';
import { ObjDoctor } from '../../models/ObjDoctor';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { DataService } from 'src/app/services/data.service';


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
    ];

  doctores: ObjDoctor[];

  constructor(public snackBar: MatSnackBar, public dataService: DataService) {
    this.dataService.verDoctores().subscribe(data => {
      this.doctores = data;
      this.dataSource = new MatTableDataSource(this.doctores);
      this.dataSource.paginator = this.paginator;

    }, err => {
      this.MostarMensaje("Se genero un error. Intente de nuevo");
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
  MostarMensaje(mensaje) {
    this.snackBar.open(mensaje, "", {
      duration: 3000
    });
  }

  editar(doctor: ObjDoctor) {
    this.MostarMensaje("En desarollo");
  }
}
