import { Component } from '@angular/core';
import { TareasService } from '../../service/tareas.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  public filtroTexto: string = '';
  private filtroTextoOriginal: string = ''; 

  public enviar: boolean = false;

  constructor(
    private tareasService: TareasService,
  ) { }

  filtrarTareas() {
    /* console.log(this.filtroTexto); */    
    this.tareasService.setFiltroTexto(this.filtroTexto);  
  }

  resetearFormulario() {
    // Restaura el texto vacio
    this.filtroTexto = this.filtroTextoOriginal; 

    // Trae de nuevo la lista de tareas
    this.tareasService.setFiltroTexto(this.filtroTexto); 

  }

}
