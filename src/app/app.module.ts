import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Modulos
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Importa de AngularFirestoreModule
import { ReactiveFormsModule } from '@angular/forms';
// Importante importar las animaciones o sino el toastr no va funcionar bien
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



// Componentes
import { AppComponent } from './app.component';
import { ListTareaComponent } from './components/list-tarea/list-tarea.component';
import { CreateTareaComponent } from './components/create-tarea/create-tarea.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { environment } from 'src/environments/environment.development';


@NgModule({
  declarations: [
    AppComponent,
    ListTareaComponent,
    CreateTareaComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ReactiveFormsModule,
    AngularFirestoreModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
