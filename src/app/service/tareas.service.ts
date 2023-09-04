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

  // Servicio para enviar los datos de firebases es una promesa POST
  agregarTarea(tarea: tareaInterfaz): Promise<any> {
    return this.firestore.collection<tareaInterfaz>('tareas').add(tarea);
  }

  // Servicio para obtener los datos de firebases es un observable GET
  obtenerTarea(): Observable<any> {
    // Para ordenar el resultados de datos que nos trae firebases vamos a colocar en la variable 'tareas' como se llama la base en firebases colocamos ('tarea', ref => ref.orderBy('fechaCreacion', 'desc'))
    return this.firestore.collection('tareas', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

  // Servicio para Eliminar en firebases que devuelve una promesa POST tipificamos esta funcion
  eliminarTarea( id: string): Promise<any> {
    return this.firestore.collection('tareas').doc(id).delete();
  }

  // Servicio para Editar una tarea en Firebases que devuelve un Observable de tipo POST con los datos a actualizar
  editarTarea( id: string): Observable<any> {
    return this.firestore.collection('tareas').doc(id).snapshotChanges();
  }

  // Servicio para enviar la actualizacion de la tarea editable que esta en metodo POST que devuelve una Promesa
  actualizarTarea(id: string, data: any): Promise<any>  {
    return this.firestore.collection('tareas').doc(id).update(data);
  }


}
