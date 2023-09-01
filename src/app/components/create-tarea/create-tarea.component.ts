import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tareaInterfaz } from '../../service/interfaz_tarea';
import { TareasService } from '../../service/tareas.service';

@Component({
  selector: 'app-create-tarea',
  templateUrl: './create-tarea.component.html',
  styleUrls: ['./create-tarea.component.scss']
})
export class CreateTareaComponent {

  public formCreateTarea!: FormGroup;

  public submitted: boolean = false;

  constructor (
    private formBuilder: FormBuilder,
    private tareasService: TareasService,
  ) {}

  ngOnInit(): void {
    // Se inicia el fomulario
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

      // Servicio que retorna una promesa.
      this.tareasService.agregarTarea(estructura).then(() => {
        console.log('Tarea Registrada');
        
      }).catch(Error => {
        console.error(Error);        
      })  

      console.log(estructura);
      this.formCreateTarea.reset();
      
    } else {
      this.submitted = true;
      this.formCreateTarea.reset();
      console.log(this.formCreateTarea.status);
    }

  }

}
