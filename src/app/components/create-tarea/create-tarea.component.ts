import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tareaInterfaz } from '../../service/interfaz_tarea';
import { TareasService } from '../../service/tareas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-tarea',
  templateUrl: './create-tarea.component.html',
  styleUrls: ['./create-tarea.component.scss']
})
export class CreateTareaComponent implements OnInit {

  public formCreateTarea!: FormGroup;

  public submitted: boolean = false;

  public loading: boolean = false;

  public titulo: string = 'Crear Tarea';

  public nomBoton: string = 'Agregar';

  // Esta variable es para poder editar la tarea con el id
  public ids!: string | null;

  constructor (
    private formBuilder: FormBuilder,
    private tareasService: TareasService,
    private router: Router,
    private toastr: ToastrService,
    // Este metodo es para editar el componente
    private aRouter: ActivatedRoute,
  ) {
    // Atrapamos el valor del id en el parametro de la url, con este metodo; con la variable ID traemos el nombre del parametro que le dimos en app-routing despues del /:'id'
    this.ids = this.aRouter.snapshot.paramMap.get('id');
    /* console.log(this.id); */    
  }

  ngOnInit(): void {
    // Se inicia el fomulario con los valideitors
    this.formCreateTarea = this.formBuilder.group({
      tarea: ['', Validators.required],
      descripcion: ['', Validators.required],
    })

    this.editarTarea ();
  }

  agregarTarea() {
    this.submitted = false;

    if (this.ids === null) {
      if (this.formCreateTarea.status === 'VALID') {

        let estructura: tareaInterfaz = {
          "tarea": this.formCreateTarea.value.tarea,
          "descripcion": this.formCreateTarea.value.descripcion,
          "fechaCreacion": new Date(),
          "fechaActualizacion": new Date(),
          "checked": false,
        }
  
        /* console.log(estructura); */
  
        // funcion que tiene el servicio
        this.creacionTarea(estructura);
  
        this.formCreateTarea.reset();
        this.toastr.success('Tarea Registrada con Exito', 'Se agrego una tarea');
        this.loading = true;
        
      } else {
        this.submitted = true;
        /* this.formCreateTarea.reset(); */
        this.formCreateTarea.markAllAsTouched();
        console.log(this.formCreateTarea.status);
      }

    } else {
      this.actualizarTarea (this.ids);
      this.toastr.info('La Tarea se Actualizo Exitosamente', 'Tarea Modificada');
    }

  }

  creacionTarea (estructura: object) {
    // Servicio que retorna una promesa.
    this.tareasService.agregarTarea(estructura).then(() => {
      /* console.log('Tarea Registrada'); */
      this.router.navigate(['../list-tarea/list-tarea.component.html'])
      this.loading = false;
      
    }).catch(Error => {
      /* console.error(Error); */
      this.toastr.error('Error en la Peticion', Error.error); 
      this.loading = false;       
    }) 
  }

  editarTarea () {
    if (this.ids !== null) {
      this.loading = true;

      this.tareasService.editarTarea(this.ids).subscribe((res: any) => {
        this.loading = false;

        // Nombres que cambian cuando se ingresa al formato de editar.
        this.titulo = 'Editar Tarea';
        this.nomBoton = 'Editar';
        // En este console.log podemos acceder al dato en especifico que necesitamos, se puede colocar mas campos si lo requerimos con un setValue en formulario control.
        /* console.log(res.payload.data()['tarea']); */

        this.formCreateTarea.setValue({
          tarea: res.payload.data()['tarea'],
          descripcion: res.payload.data()['descripcion'],
        })
        
      })
    }
  }

  actualizarTarea (id: string) {

    let estructura: tareaInterfaz = {
      "tarea": this.formCreateTarea.value.tarea,
      "descripcion": this.formCreateTarea.value.descripcion,
      "fechaActualizacion": new Date(),
    }

    this.loading = true;

    this.tareasService.actualizarTarea(id, estructura ).then(() => {
      this.router.navigate(['../list-tarea/list-tarea.component.html']);
      this.loading = false;
      
    }).catch(Error => {
      /* console.error(Error); */
      this.toastr.error('Error en la Peticion', Error.error); 
      this.loading = false;       
    }) 

  }

}
