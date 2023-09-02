import { Component } from '@angular/core';
import { TareasService } from '../../service/tareas.service';

@Component({
  selector: 'app-list-tarea',
  templateUrl: './list-tarea.component.html',
  styleUrls: ['./list-tarea.component.scss']
})
export class ListTareaComponent {

  public tarea: [] = [];

  constructor (
    private tareasService: TareasService,
  ) { }

  ngOnInit(): void {
    // Funcion que obtiene las tareas por el metodo GET mediante un subscribe
    this.getTareas ();
  }

  getTareas () {
    this.tareasService.obtenerTarea().subscribe((res: any) => {
      // Imprime toda la estructura de los datos que nos envia firebase
      /* console.log(res); */

      // La informacion llega con muchos datos por default por esa razon se hace un forech o se puede map
      res.forEach((element: any) => {
        // Para acceder a cada ID de la coleccion en firebase se hace de esta forma
        /* console.log(element.payload.doc.id); */

        // Para acceder a los datos de la coleccion en firebase se hace de esta forma
        /* console.log(element.payload.doc.data()); */

        // Se almacenan los datos en la variable, pero para esto se va crear un objeto dentro el array para obtener un id con sus respectivos datos, con un metodo push() y luego con el Spread Operator sobre un array 
        this.tarea = element.payload.doc.data()
        
      });
      
    })
  }

}
