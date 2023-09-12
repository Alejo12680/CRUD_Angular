# CrudFirebase

El proyecto esta generado con [Angular CLI](https://github.com/angular/angular-cli) version 16.0.4. y Firebases version 12.5.3

## Development con las herramientas de Firebases

Para utilizar, la base de datos firestore debemos instalar el modulo "npm install firebase" juneto con el comando "ng g enviroments" para generar los entonrnos de Enviroments que ya no vienen por default despues de la version 15 de Angular. 

Configuramos el const firebaseConfig = {
  apiKey: "Clave-crud-tareas",
  authDomain: "Clave-crud-tarea",
  projectId: "Clave-crud-tarea",
  storageBucket: "Clave-crud-tarea",
  messagingSenderId: "Clave-crud-tarea",
  appId: "Clave-crud-tarea"
};  

en el enviaroment para despues en los modulos hacer la configuracion pertiene inicializando los servicios de firestore.

## En el App.Modules

Importamos estas depedencias:

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

y las inportamos de la siguiente manera;

```
imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],

```

## Error en los servicios de FireStore

Al crear un servicio para poder obtener, enviar o actualizar genera un error el;

```
Error: node_modules/@angular/fire/compat/firestore/interfaces.d.ts:26:18 - error TS2430: Interface 'QuerySnapshot' incorrectly extends interface 'QuerySnapshot'.
Types of property 'docs' are incompatible.
Type 'QueryDocumentSnapshot[]' is not assignable to type 'QueryDocumentSnapshot[]'.
Type 'QueryDocumentSnapshot' is not assignable to type 'QueryDocumentSnapshot'.
The types returned by 'data(...)' are incompatible between these types.
Type 'T' is not assignable to type 'DocumentData'.

```

Este Error fue solucionado modificando el node_mode de angular y en el gitignore habilitando para que guarde los cambios del node_mode, se aclara que es un Mala practica modificar el node_mode. Pero fue la unica solucion que encontre:

Ruta a donde debemos ir (node_modules/@angular/fire/compat/firestore/interfaces.d.ts)

Despues revizamos estos valores:

```
export interface DocumentSnapshotExists<T> extends firebase.firestore.DocumentSnapshot {
        readonly exists: true;
        data(options?: SnapshotOptions): T;
    }

export interface QueryDocumentSnapshot<T> extends firebase.firestore.QueryDocumentSnapshot {
    data(options?: SnapshotOptions): T;
}
export interface QuerySnapshot<T> extends firebase.firestore.QuerySnapshot {
    readonly docs: QueryDocumentSnapshot<T>[];
}
export interface DocumentChange<T> extends firebase.firestore.DocumentChange {
    readonly doc: QueryDocumentSnapshot<T>;
}

```

Lo modificamos este codigo:

```
export interface DocumentSnapshotExists<T> extends firebase.firestore.DocumentSnapshot <T>{
    readonly exists: true;
    data(options?: SnapshotOptions): T;
}
export interface QueryDocumentSnapshot<T> extends firebase.firestore.QueryDocumentSnapshot <T>{
    data(options?: SnapshotOptions): T;
}
export interface QuerySnapshot<T> extends firebase.firestore.QuerySnapshot <T>{
    readonly docs: QueryDocumentSnapshot<T>[];
}
export interface DocumentChange<T> extends firebase.firestore.DocumentChange <T> {
    readonly doc: QueryDocumentSnapshot<T>;
}
```

## Utilizacion de Observables BehaviorSubjects

Para comunicar el componenete "nav" con el componenete "List-tarea, fue necesario utlizar un State Management con ayuda de un observable, de esta forma se logro el objetivo de un buscador reactivo:

En Tarea.service.ts, Importamos la libreria "rxjs" que viene en Agular

```
import { Observable, BehaviorSubject } from 'rxjs';

export class TareasService {

  constructor(
    private firestore:AngularFirestore
  ) { }

  // Variables en las que se suscribe y se hace llamado del observable.
  private filtroTextoSubject = new BehaviorSubject<string>('');
  filtroTexto$ = this.filtroTextoSubject.asObservable();

  // Servicio que transmite el observable, para el buscador del componente, este es un observable que suscribe el componente que necesite la informacion y haciendolo reactivo.
  setFiltroTexto(texto: string) {
    this.filtroTextoSubject.next(texto);
  }
  // ******************************************************************
```

En el input del componente "nav" en HTML integramos el ngModal

```
<form class="d-flex" role="search" (ngSubmit)="filtrarTareas()">
  <input class="form-control me-2" type="text" placeholder="Nombre de la tarea" name="filtroTexto" [(ngModel)]="filtroTexto" (click)="resetearFormulario()">
  <button class="btn btn-outline-warning me-3" type="submit">Buscar</button>
</form>
```

y en el TypeScript del componente "nav", importamos el servicio

```
import { TareasService } from '../../service/tareas.service';

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

```

ya con este arreglo, vamos a comunicarnos con la lista de Items en el componentes "list-tarea" en el typeScript

```
import { Subscription } from 'rxjs';

export class ListTareaComponent implements OnDestroy {

  public tarea: any [] = [];
  public tareasOriginales: any[] = [];
  public filtroTexto: string = '';
  private subscription: Subscription = new Subscription();

  constructor (
    private tareasService: TareasService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.tareasService.filtroTexto$.subscribe(texto => {
      this.filtroTexto = texto;
      this.filtrarTareas();
    });
    
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

filtrarTareas() {
    const filtroTextoLowerCase = this.filtroTexto.toLowerCase();

    if (!this.filtroTexto || this.filtroTexto.trim() === '') {
      this.tarea = [...this.tareasOriginales];
      return;

    } else {
        this.tarea = this.tarea.filter((dato: any) => {
        const tareaTexto = dato.tarea.toLowerCase(); 
        return tareaTexto.includes(filtroTextoLowerCase);
      });
    }
    
  }

```

## Implementacion de bibliote para descargar en Excel

primero instalamos para exportar en "xlsx".

`npm install xlsx --save`

Donde se encuentra la tabla de items, en el typeScript importamos la libreria.

`import * as XLSX from 'xlsx';`

Creamos esta funcion para poder ejecutar la accion de exportar

```
  exportarAExcel(): void {
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
    XLSX.writeFile(wb, 'tabla_exportada.xlsx');
  }
```

y creamos un boton con esta funcion para que se active en el html

```
<button (click)="exportarAExcel()" class="btn btn-success me-2">Excel</button>
```

## Depliegue en el hosting de Firebases

Creamos un nuevo proyecto e instalamos el Firebase Hosting

```
npm install -g firebase-tools
```
Luego inicializamos el proyecto con `firebase login` y damos ok con nuestra cuenta de google, luego con `firebase init` Escojemos nuestro proyecto y el Hosting Setup, Pregunta si creamos una carpte llamada (Public), que queremos distribuir en el hosting, luego damos en "yes" que rescribe las rutas del index y por ultimo decimos que No, al deployment en Github.

Ya en nuestro codigo borramos las carpte (Public), para agregarle una nueva ruta que no la proporciona angular con el comando `ng build`, esto genera la carpeta "Dist" en el cual almacena todo el proyecto que debemos distribuir, ya con esta carpeta le damos la nueva ruta en firebase.json;

```
{
  "hosting": {
    "public": "dist/crud-firebase",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}

```
ya por ultimo hacemos del deployment con este comando `firebase deploy` despues de subir todo el proyecto nos enviara el link donde ahora podemos ver nuestro proyecto https://crud-tareas-fb995.web.app/listTareas.

## Error al hacer el ng Build

Si no esta configurado el "budgets" y si nuestra aplicacion es muy grande nos saldra un error de WARNING in budgets, maximum exceeded for initial o ERROR in budgets, maximum exceeded for initial, esto quiere decir en nuestro caso, el presupuesto es el límite para el tamaño de los paquetes, por lo tanto como probablemente habrás adivinado, puedes aumentar el maximumWarningvalor para evitar esta advertencia o el error. de estamanera;

Abra el archivo angular.json y busque budgetsla palabra clave.
Debería verse así:

```
"budgets": [
       {
          "type": "initial",
          "maximumWarning": "2mb",
          "maximumError": "5mb"
       }
    ]
```

aumentamos el valor de maximumWarning.

```
"budgets": [
       {
          "type": "initial",
          "maximumWarning": "4mb", <===
          "maximumError": "5mb"
       }
    ]

```

De esta manera podremos hacer el "ng build" sin ningun problema.










