import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObjSolicitud } from '../models/ObjSolicitud';
import { environment } from '../../environments/environment';
import { ObjCatalogo } from '../models/ObjCatalogo';
import { ObjDoctor } from '../models/ObjDoctor';
import { ObjConsulta } from '../models/ObjConsulta';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  baseUrl = environment.baseUrl;

  // private objSolicitudSource = new BehaviorSubject<ObjSolicitud>(null);

  // objSolicitud = this.objSolicitudSource.asObservable();

  objCatalogo: ObjCatalogo;

  constructor(private httpClient: HttpClient) { }

  // obtenerCatalogo() {
  //   this.httpClient.get<ObjSolicitud>(this.baseUrl + "/api/values/obtenerCatalogo").subscribe(data => {
  //     this.objSolicitudSource.next(data);
  //   });

  // }


  obtenerCatalogo() {
    return this.httpClient.get<ObjCatalogo>(this.baseUrl + "/api/values/obtenerCatalogo");
  }

  crearPdf(objFirma: ObjSolicitud) {
    const httpOptions = {
      'responseType': 'arraybuffer' as 'json'
      //'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.httpClient.post<any>(this.baseUrl + "/api/values/crearPdf"
      , objFirma
      , httpOptions

      //, { headers: new HttpHeaders({ "Authorization": "Bearer " + token }) }
    );
  }

  verPlantilla(tipo: string, tratamiento: string) {
    const httpOptions = {
      'responseType': 'arraybuffer' as 'json'
      //'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.httpClient.get<any>(this.baseUrl + `/api/values/verPlantilla/?tipo=${tipo}&tratamiento=${tratamiento}`
      , httpOptions
      //, { headers: new HttpHeaders({ "Authorization": "Bearer " + token }) }
    );
  }

  crearDoctor(objDoctor: ObjSolicitud) {

    return this.httpClient.post<any>(this.baseUrl + "/api/values/crearDoctor"
      , objDoctor
      //, { headers: new HttpHeaders({ "Authorization": "Bearer " + token }) }
    );
  }

  actualizarDoctor(objDoctor: ObjDoctor) {

    return this.httpClient.post<ObjDoctor>(this.baseUrl + "/api/values/actualizarDoctor"
      , objDoctor
      //, { headers: new HttpHeaders({ "Authorization": "Bearer " + token }) }
    );
  }

  activarDoctor(id, activo) {
    return this.httpClient.get<number>(this.baseUrl + `/api/values/activarDoctor/?id=${id}&activo=${activo}`);
  }

  verDoctores() {
    return this.httpClient.get<ObjDoctor[]>(this.baseUrl + "/api/values/verDoctores");
  }

  verConsultas(identificacion) {
    return this.httpClient.get<ObjConsulta[]>(this.baseUrl + `/api/values/verConsultas/?identificacion=${identificacion}`);
  }

  verPdf(id) {
    const httpOptions = {
      'responseType': 'arraybuffer' as 'json'
      //'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.httpClient.get<any>(this.baseUrl + `/api/values/verPdf/?id=${id}`
      , httpOptions
      //, { headers: new HttpHeaders({ "Authorization": "Bearer " + token }) }
    );
  }

  // save(id: number, gestion: number) {
  //   return this.httpClient.post<Solicitudes>(this.baseUrl + "/api/values/crearPdf"
  //    , { id: id, gestion: gestion }
  //     //, { headers: new HttpHeaders({ "Authorization": "Bearer " + token }) }
  //   );

  // }
}
