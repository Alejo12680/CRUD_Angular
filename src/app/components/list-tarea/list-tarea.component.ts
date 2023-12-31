import { Component, OnDestroy } from '@angular/core';
import { TareasService } from '../../service/tareas.service';
import { ToastrService } from 'ngx-toastr';
import { tareaInterfaz } from '../../service/interfaz_tarea';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-list-tarea',
  templateUrl: './list-tarea.component.html',
  styleUrls: ['./list-tarea.component.scss']
})
export class ListTareaComponent implements OnDestroy {

  public tarea: any [] = [];
  public tareasOriginales: any[] = [];

  public filtroTexto: string = '';

  // Variable donde se subscribe inicializada con new Subscription()
  private subscription: Subscription = new Subscription();


  constructor (
    private tareasService: TareasService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    // Funcion que obtiene las tareas por el metodo GET mediante un subscribe
    this.getTareas ();

    // funcion del observable que se suscribe
    this.subscription = this.tareasService.filtroTexto$.subscribe(texto => {
      this.filtroTexto = texto;
      this.filtrarTareas();
    });
    
  }

  // Implementa el método 'ngOnDestroy' para desuscribirte cuando el componente se destruye
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getTareas () {
    this.tareasService.obtenerTarea().subscribe((res: any) => {
      // Imprime toda la estructura de los datos que nos envia firebase
      /* console.log(res); */

      // Variable para el Filtro de busqueda
      this.tareasOriginales = [];

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
        
        // Almacenamos de igual forma que las this.tarea original para que aparezcan los items de nuevo en el buscador
        this.tareasOriginales.push({
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

  // Filtro de busqueda
  filtrarTareas() {
    // Convertir el filtro de texto a minúsculas para que la búsqueda sea insensible a mayúsculas/minúsculas
    const filtroTextoLowerCase = this.filtroTexto.toLowerCase();

    // Si no hay texto de filtro, mostrar todas las tareas
    if (!this.filtroTexto || this.filtroTexto.trim() === '') {
      // Puedes cargar todas las tareas nuevamente aquí o mantener la lista original
      this.tarea = [...this.tareasOriginales];
      return;

    } else {
        // Filtrar las tareas basadas en el texto de filtro
        this.tarea = this.tarea.filter((dato: any) => {
        // Aquí, debes ajustar el campo en el que deseas realizar la búsqueda.
        // En este ejemplo, se busca en el campo 'tarea'.
        const tareaTexto = dato.tarea.toLowerCase(); // Asegúrate de que el campo coincida con tu estructura de datos.
        
        // Utiliza 'includes' para verificar si el texto de la tarea contiene el filtro
        return tareaTexto.includes(filtroTextoLowerCase);
      });
    }
    
  }

  // funcion para exportar a EXCEL
  exportarAExcel(): void {

    // Mapeamos el array para obtener un nuevo objeto mas limpio y eso es lo que vamos a enviar al Excel, Ejemplo para mapear objetos es: variableNew = this.array.map(data => ({name: data.name}))
    let tareas = this.tarea.map(res => ({
        id: res.id,
        tarea: res.tarea,
        descripcion: res.descripcion,
        estado: res.checked,
      }));

    /* console.log(tareas); */
    

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tareas);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(wb, 'tabla_exportada.xlsx');
  }

}
