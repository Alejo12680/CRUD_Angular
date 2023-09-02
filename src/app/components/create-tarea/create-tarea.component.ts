import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tareaInterfaz } from '../../service/interfaz_tarea';
import { TareasService } from '../../service/tareas.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-tarea',
  templateUrl: './create-tarea.component.html',
  styleUrls: ['./create-tarea.component.scss']
})
export class CreateTareaComponent {

  public formCreateTarea!: FormGroup;

  public submitted: boolean = false;

  public loading: boolean = false;

  constructor (
    private formBuilder: FormBuilder,
    private tareasService: TareasService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    // Se inicia el fomulario con los valideitors
    this.formCreateTarea = this.formBuilder.group({
      tarea: ['', Validators.required],
    })
  }

  agregarTarea() {
    this.submitted = false;

    if (this.formCreateTarea.status === 'VALID') {

      let estructura: tareaInterfaz = {
        "tarea": this.formCreateTarea.value.tarea,
        "fechaCreacion": new Date(),
        "fechaActualizacion": new Date(),
      }

      /* console.log(estructura); */

      // funcion que tiene el servicio
      this.creacionTarea(estructura);

      this.formCreateTarea.reset();
      this.toastr.success('Tarea Registrada con Exito', 'Se agrego una tarea');
      this.loading = true;
      
    } else {
      this.submitted = true;
      this.formCreateTarea.reset();
      console.log(this.formCreateTarea.status);
    }

  }

  creacionTarea (estructura: object) {
    // Servicio que retorna una promesa.
    this.tareasService.agregarTarea(estructura).then(() => {

      /* console.log('Tarea Registrada'); */
      /* this.router.navigate(['../list-tarea/list-tarea.component.html']) */
      this.loading = false;
      
    }).catch(Error => {
      /* console.error(Error); */
      this.toastr.error('Error en la Peticion', Error.error); 
      this.loading = false;       
    }) 
  }

}
