import { Component } from '@angular/core';
import { TareasService } from '../../service/tareas.service';
import { ToastrService } from 'ngx-toastr';
import { tareaInterfaz } from '../../service/interfaz_tarea';


@Component({
  selector: 'app-list-tarea',
  templateUrl: './list-tarea.component.html',
  styleUrls: ['./list-tarea.component.scss']
})
export class ListTareaComponent {

  public tarea: any [] = [];

  public seleccion: any [] = [];
  public estado!: boolean;


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

      // Para agregar el campo checked de forma manual sin un servicio, mapeamos todo nuestro array que seria lo mismo que un foreach y se lo agregamos con en el estado en false, ya que con este estado podemos interpolar en html con un ngModal para que indica si sufre algun cambio de estado cada vez que lo seleccionamos, [(ngModel)]="dato.checked".
      /* this.tarea.map(res => {
        res.checked = false;
      }); */
      /* console.log(this.tarea); */
      
    })
  }

  elimnarTareas (id: string) {
    this.tareasService.eliminarTarea(id).then(() => {
      this.toastr.error('Tarea Eliminada con Exitosamente', 'Se elimino una tarea', {
        positionClass: 'toast-bottom-right'
      });

    }).catch(Error => {
      /* console.error(Error); */
      this.toastr.error('Error en la Peticion', Error.error);        
    }) 
  }

  saveEstado (id: string, estado: boolean) {

    // Se puede filtrar el array para obtener todo resultado que esta en true junto con todos los datos para procesarlo con otras funciones que desconosco en este momento, puede guardarce en el localStore pero no se logro por tal motivo se creo un servicio parte.
    /* this.seleccion = this.tarea.filter(add => add.checked === true);
    console.log(this.seleccion); */
    

    // Utilizo un servicio para enviarle el estado a la base de datos en una actualizacion por aparte, para cuando obtengo el getTareas me traiga el estado en el que se deja actualizado.
    let estructura: tareaInterfaz = {
      "checked": estado,
    }

    this.tareasService.actualizarEstado(id, estructura ).then(() => {
      
    }).catch(Error => {
      console.error(Error);
      this.toastr.error('Error en la Peticion', Error.error);      
    }) 
    
  }

}
