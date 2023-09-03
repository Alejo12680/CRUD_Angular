import { Component } from '@angular/core';
import { TareasService } from '../../service/tareas.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-tarea',
  templateUrl: './list-tarea.component.html',
  styleUrls: ['./list-tarea.component.scss']
})
export class ListTareaComponent {

  public tarea: any [] = [];

  constructor (
    private tareasService: TareasService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    // Funcion que obtiene las tareas por el metodo GET mediante un subscribe
    this.getTareas ();
  }

  getTareas () {
    this.tareasService.obtenerTarea().subscribe((res: any) => {
      // Imprime toda la estructura de los datos que nos envia firebase
      /* console.log(res); */

      this.tarea = [];
      // La informacion llega con muchos datos por default por esa razon se hace un forech o se puede map
      res.forEach((element: any) => {
        // Para acceder a cada ID de la coleccion en firebase se hace de esta forma
        /* console.log(element.payload.doc.id); */

        // Para acceder a los datos de la coleccion en firebase se hace de esta forma
        /* console.log(element.payload.doc.data()); */

        // Se almacenan los datos en la variable, pero para esto se va crear un objeto dentro el array para obtener un id con sus respectivos datos, con un metodo push() y luego con el Spread Operator sobre un array 
        /* this.tarea = element.payload.doc.data() */
        
        // Creamos un objeto donde le damos un Id propio para obtener todos los datos en un orden que podamos iterar con Html, con ayuda del Spread Operator copiamos el array que optuvimos anterior mente
        this.tarea.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })        
      });
      
      // Fuera del bucle for imprimimos el resultado
      /* console.log(this.tarea); */
      
    })
  }

  elimnarTareas(id: string) {
    this.tareasService.eliminarTarea(id).then(() => {
      this.toastr.error('Tarea Eliminada con Exitosamente', 'Se elimino una tarea', {
        positionClass: 'toast-bottom-right'
      });

    }).catch(Error => {
      /* console.error(Error); */
      this.toastr.error('Error en la Peticion', Error.error);        
    }) 
  }

}
