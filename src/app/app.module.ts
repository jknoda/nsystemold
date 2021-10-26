import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {InputMaskModule} from 'primeng/inputmask';
import {ToastModule} from 'primeng/toast';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { MenuModule } from './principal/menu/menu.module';
import { TopoModule } from './principal/topo/topo.module';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthComponent } from './auth/auth.component';
import { UsuarioComponent } from './Cadastros/usuario/usuario.component';
import { TopoService } from './principal/topo/topo.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    UsuarioComponent
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(firebase)),
    provideAuth(() => getAuth()),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    InputTextModule,
    DropdownModule,
    BrowserAnimationsModule,
    InputMaskModule,
    ToastModule,
    MenuModule,    
    TopoModule    
  ],
  providers: [    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    TopoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

const firebase = {
  apiKey: "AIzaSyDfHXtFhUHbY4yqDgLhT8fklAZKbLkfePg",
  authDomain: "authentication-cff69.firebaseapp.com",
  databaseURL: "https://authentication-cff69-default-rtdb.firebaseio.com",
  projectId: "authentication-cff69",
  storageBucket: "authentication-cff69.appspot.com",
  messagingSenderId: "146817382520",
  appId: "1:146817382520:web:5e9af5d1c75862e8cb558d",
  measurementId: "G-WSLWFXPMV8"
}
