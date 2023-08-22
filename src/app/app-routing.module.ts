import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTareaComponent } from './components/list-tarea/list-tarea.component';
import { CreateTareaComponent } from './components/create-tarea/create-tarea.component';

const routes: Routes = [

  {
    path:'',
    redirectTo:'listTareas',
    pathMatch:'full'
  },
  {
    path:'listTareas',
    component: ListTareaComponent
  },
  {
    path:'createTarea',
    component: CreateTareaComponent
  },

  // Este path siempre va a lo ultimo, es un volteo de ruta cuando el usuario escribe una URL que no corresponde a ningun componente.
  {
    path:'**',
    redirectTo:'listTareas',
    pathMatch:'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
