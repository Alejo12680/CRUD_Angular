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

Lo modificamos a esta,









To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
