import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { tareaInterfaz } from './interfaz_tarea';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(
    private firestore:AngularFirestore
  ) { }

  // Servicio de firebases es una promesa POST
  agregarTarea(tarea: tareaInterfaz): Promise<any> {
    return this.firestore.collection<tareaInterfaz>('tareas').add(tarea);
  }

  // Servicio de firebases es un observable GET
  obtenerTarea(): Observable<any> {
    return this.firestore.collection('tareas').snapshotChanges();
  }


}
